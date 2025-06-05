import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import type { Company } from '@/types';

export function NewRequest() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    cargoType: '',
    weight: '',
    numberOfItems: '',
    pickupLocation: '',
    deliveryLocation: '',
    specialNeeds: ''
  });

  useEffect(() => {
    const loadCompany = async () => {
      if (!userData?.companyId) {
        setCompany(null);
        return;
      }
      
      try {
        const companyDoc = await getDoc(doc(db, 'companies', userData.companyId));
        if (companyDoc.exists()) {
          setCompany({ id: companyDoc.id, ...companyDoc.data() } as Company);
        } else {
          // Company was deleted, clear the companyId from user
          setCompany(null);
          if (currentUser) {
            await updateDoc(doc(db, 'users', currentUser.uid), {
              companyId: null,
              updatedAt: serverTimestamp()
            });
          }
        }
      } catch (error) {
        console.error('Error loading company:', error);
        setCompany(null);
      }
    };

    if (userData?.companyId) {
      loadCompany();
    }
  }, [userData, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !userData?.companyId) {
      toast({
        title: "Mangler firmainformasjon",
        description: "Du må registrere et firma før du kan opprette forespørsler.",
        variant: "destructive",
      });
      navigate('/firma');
      return;
    }

    if (!company?.approved) {
      toast({
        title: "Firma ikke godkjent",
        description: "Ditt firma må godkjennes av administrator før du kan opprette forespørsler.",
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    if (!formData.cargoType || !formData.weight || !formData.numberOfItems || 
        !formData.pickupLocation || !formData.deliveryLocation) {
      toast({
        title: "Mangler påkrevde felt",
        description: "Vennligst fyll ut alle påkrevde felt.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        cargoType: formData.cargoType,
        weight: parseFloat(formData.weight),
        numberOfItems: parseInt(formData.numberOfItems),
        pickupLocation: formData.pickupLocation,
        deliveryLocation: formData.deliveryLocation,
        specialNeeds: formData.specialNeeds || '',
        companyId: userData.companyId,
        userId: currentUser.uid,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Submitting request:', requestData);
      
      await addDoc(collection(db, 'requests'), requestData);

      toast({
        title: "Forespørsel opprettet",
        description: "Din fraktforespørsel har blitt publisert.",
      });
      
      navigate('/foresporsler');
    } catch (error: any) {
      console.error('Error creating request:', error);
      toast({
        title: "Feil ved opprettelse",
        description: error.message || "Noe gikk galt. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {company && !company.approved && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Firma venter på godkjenning</CardTitle>
            <CardDescription className="text-yellow-700">
              Ditt firma må godkjennes av administrator før du kan opprette forespørsler.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Ny fraktforespørsel</CardTitle>
          <CardDescription>
            Fyll ut detaljene om lasten du trenger transportert
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cargoType">Type last</Label>
              <Input
                id="cargoType"
                type="text"
                placeholder="F.eks. Byggematerialer, Møbler, Elektronikk"
                value={formData.cargoType}
                onChange={(e) => setFormData({...formData, cargoType: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Vekt (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="1000"
                  min="0.1"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfItems">Antall kolli</Label>
                <Input
                  id="numberOfItems"
                  type="number"
                  placeholder="10"
                  min="1"
                  step="1"
                  value={formData.numberOfItems}
                  onChange={(e) => setFormData({...formData, numberOfItems: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Henteadresse</Label>
              <AddressAutocomplete
                id="pickupLocation"
                placeholder="Gateadresse, Postnummer Sted"
                value={formData.pickupLocation}
                onChange={(value) => setFormData({...formData, pickupLocation: value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryLocation">Leveringsadresse</Label>
              <AddressAutocomplete
                id="deliveryLocation"
                placeholder="Gateadresse, Postnummer Sted"
                value={formData.deliveryLocation}
                onChange={(value) => setFormData({...formData, deliveryLocation: value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialNeeds">Spesielle behov (valgfritt)</Label>
              <Textarea
                id="specialNeeds"
                placeholder="F.eks. kranbil nødvendig, temperaturkontroll, forsiktig håndtering"
                value={formData.specialNeeds}
                onChange={(e) => setFormData({...formData, specialNeeds: e.target.value})}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Publiserer...' : 'Publiser forespørsel'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}