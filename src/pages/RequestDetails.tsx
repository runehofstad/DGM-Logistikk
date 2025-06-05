import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Package, Weight, Building2, User, FileText } from 'lucide-react';
import type { FreightRequest, Company, User as UserType } from '@/types';

export function RequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<FreightRequest | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [requestUser, setRequestUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadRequestDetails = async () => {
      try {
        // Load request
        const requestDoc = await getDoc(doc(db, 'requests', id));
        
        if (!requestDoc.exists()) {
          navigate('/foresporsler');
          return;
        }

        const requestData = { id: requestDoc.id, ...requestDoc.data() } as FreightRequest;
        setRequest(requestData);

        // Load company
        if (requestData.companyId) {
          const companyDoc = await getDoc(doc(db, 'companies', requestData.companyId));
          if (companyDoc.exists()) {
            setCompany({ id: companyDoc.id, ...companyDoc.data() } as Company);
          }
        }

        // Load user
        if (requestData.userId) {
          const userDoc = await getDoc(doc(db, 'users', requestData.userId));
          if (userDoc.exists()) {
            setRequestUser({ uid: userDoc.id, ...userDoc.data() } as UserType);
          }
        }
      } catch (error) {
        console.error('Error loading request details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRequestDetails();
  }, [id, navigate]);

  const handleContact = () => {
    if (company) {
      window.location.href = `mailto:${company.contactEmail}?subject=Forespørsel om frakt: ${request?.cargoType}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Laster detaljer...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Forespørselen ble ikke funnet.</p>
            <Button className="mt-4" onClick={() => navigate('/foresporsler')}>
              Tilbake til forespørsler
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const createdAt = (request.createdAt as any)?.toDate ? (request.createdAt as any).toDate() : new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Tilbake
      </Button>

      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{request.cargoType}</CardTitle>
                <CardDescription className="mt-2">
                  Opprettet {createdAt.toLocaleDateString('nb-NO')} kl. {createdAt.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}
                </CardDescription>
              </div>
              <Badge variant={
                request.status === 'active' ? 'default' : 
                request.status === 'completed' ? 'secondary' : 
                'outline'
              }>
                {request.status === 'active' ? 'Aktiv' : 
                 request.status === 'completed' ? 'Fullført' : 'Kansellert'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Transport Details */}
        <Card>
          <CardHeader>
            <CardTitle>Transportdetaljer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">Henteadresse</span>
                </div>
                <p className="font-medium">{request.pickupLocation}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">Leveringsadresse</span>
                </div>
                <p className="font-medium">{request.deliveryLocation}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Weight className="h-4 w-4 mr-2" />
                  <span className="text-sm">Total vekt</span>
                </div>
                <p className="font-medium">{request.weight} kg</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Package className="h-4 w-4 mr-2" />
                  <span className="text-sm">Antall kolli</span>
                </div>
                <p className="font-medium">{request.numberOfItems} stk</p>
              </div>
            </div>

            {request.specialNeeds && (
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="text-sm">Spesielle behov</span>
                </div>
                <p className="font-medium">{request.specialNeeds}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company Information */}
        {company && (
          <Card>
            <CardHeader>
              <CardTitle>Firmainformasjon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span className="text-sm">Firmanavn</span>
                </div>
                <p className="font-medium">{company.name}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm">Kontaktperson</span>
                </div>
                <p className="font-medium">{requestUser?.fullName || 'Ikke oppgitt'}</p>
              </div>

              {company.description && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Om firmaet</p>
                  <p className="text-sm">{company.description}</p>
                </div>
              )}

              <div className="pt-4">
                <Button onClick={handleContact} className="w-full sm:w-auto">
                  Kontakt firma
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}