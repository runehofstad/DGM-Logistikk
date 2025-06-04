import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function NewRequest() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cargoType: '',
    weight: '',
    numberOfItems: '',
    pickupLocation: '',
    deliveryLocation: '',
    specialNeeds: ''
  });

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

    setLoading(true);

    try {
      await addDoc(collection(db, 'requests'), {
        ...formData,
        weight: parseFloat(formData.weight),
        numberOfItems: parseInt(formData.numberOfItems),
        companyId: userData.companyId,
        userId: currentUser.uid,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Forespørsel opprettet",
        description: "Din fraktforespørsel har blitt publisert.",
      });
      
      navigate('/foresporsler');
    } catch (error: any) {
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
                  value={formData.numberOfItems}
                  onChange={(e) => setFormData({...formData, numberOfItems: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Henteadresse</Label>
              <Input
                id="pickupLocation"
                type="text"
                placeholder="Gateadresse, Postnummer Sted"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryLocation">Leveringsadresse</Label>
              <Input
                id="deliveryLocation"
                type="text"
                placeholder="Gateadresse, Postnummer Sted"
                value={formData.deliveryLocation}
                onChange={(e) => setFormData({...formData, deliveryLocation: e.target.value})}
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