import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Company, FreightRequest } from '@/types';
import { Building2, Users, Package, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export function Admin() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    companies: 0,
    users: 0,
    activeRequests: 0,
    pendingCompanies: 0
  });
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([]);
  const [recentRequests, setRecentRequests] = useState<FreightRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load pending companies
    const companiesQuery = query(
      collection(db, 'companies'),
      where('approved', '==', false),
      orderBy('createdAt', 'desc')
    );

    const companiesUnsubscribe = onSnapshot(companiesQuery, (snapshot) => {
      const companies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Company));
      setPendingCompanies(companies);
      setStats(prev => ({ ...prev, pendingCompanies: companies.length }));
    });

    // Load recent requests
    const requestsQuery = query(
      collection(db, 'requests'),
      orderBy('createdAt', 'desc')
    );

    const requestsUnsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FreightRequest)).slice(0, 10);
      setRecentRequests(requests);
      
      const activeCount = snapshot.docs.filter(doc => doc.data().status === 'active').length;
      setStats(prev => ({ ...prev, activeRequests: activeCount }));
    });

    // Load user count
    const usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStats(prev => ({ ...prev, users: snapshot.size }));
    });

    // Load company count
    const allCompaniesUnsubscribe = onSnapshot(collection(db, 'companies'), (snapshot) => {
      setStats(prev => ({ ...prev, companies: snapshot.size }));
    });

    setLoading(false);

    return () => {
      companiesUnsubscribe();
      requestsUnsubscribe();
      usersUnsubscribe();
      allCompaniesUnsubscribe();
    };
  }, []);

  const handleApproveCompany = async (companyId: string) => {
    try {
      await updateDoc(doc(db, 'companies', companyId), {
        approved: true,
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Firma godkjent",
        description: "Firmaet har blitt godkjent og kan nå bruke plattformen.",
      });
    } catch (error: any) {
      console.error('Error approving company:', error);
      toast({
        title: "Feil",
        description: error.message || "Kunne ikke godkjenne firma. Prøv igjen.",
        variant: "destructive",
      });
    }
  };

  const handleRejectCompany = async (companyId: string) => {
    try {
      await deleteDoc(doc(db, 'companies', companyId));
      
      toast({
        title: "Firma avvist",
        description: "Firmaregistreringen har blitt avvist og slettet.",
      });
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke avvise firma. Prøv igjen.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, 'requests', requestId));
      
      toast({
        title: "Forespørsel slettet",
        description: "Forespørselen har blitt fjernet.",
      });
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke slette forespørsel. Prøv igjen.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Laster administrasjonspanel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Administrasjonspanel</h1>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt antall firmaer</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt antall brukere</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive forespørsler</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventende godkjenninger</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCompanies}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Companies */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Firmaer som venter på godkjenning</CardTitle>
          <CardDescription>Gjennomgå og godkjenn nye firmaregistreringer</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingCompanies.length === 0 ? (
            <p className="text-muted-foreground">Ingen firmaer venter på godkjenning.</p>
          ) : (
            <div className="space-y-4">
              {pendingCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{company.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Org.nr: {company.organizationNumber} | {company.contactEmail}
                    </p>
                    <p className="text-sm mt-1">{company.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveCompany(company.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Godkjenn
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejectCompany(company.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Avvis
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Nylige forespørsler</CardTitle>
          <CardDescription>De 10 siste fraktforespørslene</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{request.cargoType}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.pickupLocation} → {request.deliveryLocation}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={request.status === 'active' ? 'default' : 'secondary'}>
                    {request.status === 'active' ? 'Aktiv' : 
                     request.status === 'completed' ? 'Fullført' : 'Kansellert'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteRequest(request.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}