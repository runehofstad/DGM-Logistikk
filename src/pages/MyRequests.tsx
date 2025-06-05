import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import type { FreightRequest } from '@/types';
import { MoreVertical, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';

export function MyRequests() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<FreightRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRequest, setEditingRequest] = useState<FreightRequest | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    cargoType: '',
    weight: '',
    numberOfItems: '',
    pickupLocation: '',
    deliveryLocation: '',
    specialNeeds: ''
  });

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'requests'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FreightRequest));
      
      setRequests(requestsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleEdit = (request: FreightRequest) => {
    setEditingRequest(request);
    setEditFormData({
      cargoType: request.cargoType,
      weight: request.weight.toString(),
      numberOfItems: request.numberOfItems.toString(),
      pickupLocation: request.pickupLocation,
      deliveryLocation: request.deliveryLocation,
      specialNeeds: request.specialNeeds || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingRequest) return;

    try {
      const updatedData = {
        cargoType: editFormData.cargoType,
        weight: parseFloat(editFormData.weight),
        numberOfItems: parseInt(editFormData.numberOfItems),
        pickupLocation: editFormData.pickupLocation,
        deliveryLocation: editFormData.deliveryLocation,
        specialNeeds: editFormData.specialNeeds,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'requests', editingRequest.id), updatedData);

      // Update local state immediately for better UX
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === editingRequest.id 
            ? { ...req, ...updatedData, updatedAt: new Date() }
            : req
        )
      );

      toast({
        title: "Forespørsel oppdatert",
        description: "Endringene har blitt lagret.",
      });
      
      setEditingRequest(null);
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke oppdatere forespørselen.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'requests', id));
      
      toast({
        title: "Forespørsel slettet",
        description: "Forespørselen har blitt fjernet.",
      });
      
      setDeleteConfirmId(null);
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke slette forespørselen.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'active' | 'completed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'requests', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Status oppdatert",
        description: `Forespørselen er nå ${newStatus === 'active' ? 'aktiv' : newStatus === 'completed' ? 'fullført' : 'kansellert'}.`,
      });
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke oppdatere status.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Laster dine forespørsler...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mine fraktforespørsler</h1>
        <p className="text-muted-foreground">
          Administrer dine aktive og tidligere forespørsler
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Du har ingen fraktforespørsler ennå.
            </p>
            <Button onClick={() => navigate('/ny-forespørsel')}>
              Opprett din første forespørsel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{request.cargoType}</CardTitle>
                    <CardDescription>
                      {request.pickupLocation} → {request.deliveryLocation}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      request.status === 'active' ? 'default' : 
                      request.status === 'completed' ? 'secondary' : 
                      'outline'
                    }>
                      {request.status === 'active' ? 'Aktiv' : 
                       request.status === 'completed' ? 'Fullført' : 'Kansellert'}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/foresporsler/${request.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Se detaljer
                        </DropdownMenuItem>
                        {request.status === 'active' && (
                          <>
                            <DropdownMenuItem onClick={() => handleEdit(request)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Rediger
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(request.id, 'completed')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Merk som fullført
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(request.id, 'cancelled')}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Kanseller
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem 
                          onClick={() => setDeleteConfirmId(request.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Slett
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Vekt</p>
                    <p className="font-medium">{request.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Antall kolli</p>
                    <p className="font-medium">{request.numberOfItems}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Opprettet</p>
                    <p className="font-medium">
                      {(request.createdAt as any)?.toDate ? 
                        (request.createdAt as any).toDate().toLocaleDateString('nb-NO') : 
                        new Date().toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium">
                      {request.status === 'active' ? 'Aktiv' : 
                       request.status === 'completed' ? 'Fullført' : 'Kansellert'}
                    </p>
                  </div>
                </div>
                {request.specialNeeds && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Spesielle behov</p>
                    <p className="text-sm">{request.specialNeeds}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingRequest} onOpenChange={() => setEditingRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rediger forespørsel</DialogTitle>
            <DialogDescription>
              Oppdater informasjonen om din fraktforespørsel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-cargoType">Type last</Label>
              <Input
                id="edit-cargoType"
                value={editFormData.cargoType}
                onChange={(e) => setEditFormData({...editFormData, cargoType: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-weight">Vekt (kg)</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  value={editFormData.weight}
                  onChange={(e) => setEditFormData({...editFormData, weight: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-numberOfItems">Antall kolli</Label>
                <Input
                  id="edit-numberOfItems"
                  type="number"
                  value={editFormData.numberOfItems}
                  onChange={(e) => setEditFormData({...editFormData, numberOfItems: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pickupLocation">Henteadresse</Label>
              <AddressAutocomplete
                id="edit-pickupLocation"
                placeholder="Gateadresse, Postnummer Sted"
                value={editFormData.pickupLocation}
                onChange={(value) => setEditFormData({...editFormData, pickupLocation: value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-deliveryLocation">Leveringsadresse</Label>
              <AddressAutocomplete
                id="edit-deliveryLocation"
                placeholder="Gateadresse, Postnummer Sted"
                value={editFormData.deliveryLocation}
                onChange={(value) => setEditFormData({...editFormData, deliveryLocation: value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-specialNeeds">Spesielle behov</Label>
              <Textarea
                id="edit-specialNeeds"
                value={editFormData.specialNeeds}
                onChange={(e) => setEditFormData({...editFormData, specialNeeds: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRequest(null)}>
              Avbryt
            </Button>
            <Button onClick={handleSaveEdit}>
              Lagre endringer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekreft sletting</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil slette denne forespørselen? Denne handlingen kan ikke angres.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Avbryt
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Slett forespørsel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}