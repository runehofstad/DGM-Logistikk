import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ForespørselList } from '@/components/ForespørselList';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { FreightRequest, Company } from '@/types';
import { Search, Filter } from 'lucide-react';

export function Requests() {
  const [requests, setRequests] = useState<FreightRequest[]>([]);
  const [companies, setCompanies] = useState<Record<string, Company>>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cargoType: '',
    location: ''
  });

  useEffect(() => {
    const q = query(
      collection(db, 'requests'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FreightRequest));

      // Fetch company data for each request
      const companyIds = [...new Set(requestsData.map(r => r.companyId))];
      const companiesData: Record<string, Company> = {};
      
      for (const companyId of companyIds) {
        if (companyId) {
          const companyDoc = await getDoc(doc(db, 'companies', companyId));
          if (companyDoc.exists()) {
            companiesData[companyId] = { id: companyDoc.id, ...companyDoc.data() } as Company;
          }
        }
      }

      setCompanies(companiesData);
      setRequests(requestsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesCargoType = !filters.cargoType || 
      request.cargoType.toLowerCase().includes(filters.cargoType.toLowerCase());
    
    const matchesLocation = !filters.location || 
      request.pickupLocation.toLowerCase().includes(filters.location.toLowerCase()) ||
      request.deliveryLocation.toLowerCase().includes(filters.location.toLowerCase());
    
    return matchesCargoType && matchesLocation;
  });

  const handleContact = (request: FreightRequest) => {
    const company = companies[request.companyId];
    if (company) {
      window.location.href = `mailto:${company.contactEmail}?subject=Forespørsel om frakt: ${request.cargoType}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Laster forespørsler...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Aktive fraktforespørsler</h1>
        <p className="text-muted-foreground">
          Bla gjennom og søk etter fraktoppdrag
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-4 mb-6 border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Filtrer forespørsler</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cargoType">Type last</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="cargoType"
                type="text"
                placeholder="Søk etter lasttype..."
                className="pl-9"
                value={filters.cargoType}
                onChange={(e) => setFilters({...filters, cargoType: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lokasjon</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                placeholder="Søk etter sted..."
                className="pl-9"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={() => setFilters({ cargoType: '', location: '' })}
              className="w-full"
            >
              Nullstill filter
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Ingen forespørsler funnet som matcher søkekriteriene.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            {filteredRequests.length} forespørsler funnet
          </p>
          {filteredRequests.map(request => (
            <ForespørselList
              key={request.id}
              request={request}
              companyName={companies[request.companyId]?.name}
              onContact={() => handleContact(request)}
            />
          ))}
        </div>
      )}
    </div>
  );
}