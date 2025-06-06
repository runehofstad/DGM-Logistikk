import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { FirmaSkjema } from '@/components/FirmaSkjema';
import { useToast } from '@/hooks/use-toast';
import type { Company } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function CompanyPage() {
  const { currentUser, userData } = useAuth();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shouldReload, setShouldReload] = useState(0);

  useEffect(() => {
    const loadCompanyData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // First try to load by companyId
        if (userData?.companyId) {
          const companyDoc = await getDoc(doc(db, 'companies', userData.companyId));
          if (companyDoc.exists()) {
            setCompany({ id: companyDoc.id, ...companyDoc.data() } as Company);
            setLoading(false);
            return;
          }
        }

        // If no companyId or company not found, try to find company created by user
        const { query, where, getDocs, collection: firestoreCollection } = await import('firebase/firestore');
        const companiesQuery = query(
          firestoreCollection(db, 'companies'),
          where('createdBy', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(companiesQuery);
        
        if (!querySnapshot.empty) {
          const companyDoc = querySnapshot.docs[0];
          setCompany({ id: companyDoc.id, ...companyDoc.data() } as Company);
          
          // Update user's companyId if not set
          if (!userData?.companyId) {
            await updateDoc(doc(db, 'users', currentUser.uid), {
              companyId: companyDoc.id,
              updatedAt: serverTimestamp()
            });
          }
        }
      } catch (error) {
        console.error('Error loading company:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [userData, currentUser, shouldReload]);

  const handleSubmit = async (data: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'approved'>) => {
    if (!currentUser) return;
    setSaving(true);

    try {
      if (company) {
        // Update existing company
        await updateDoc(doc(db, 'companies', company.id), {
          ...data,
          updatedAt: serverTimestamp()
        });
        
        toast({
          title: "Firmainformasjon oppdatert",
          description: "Endringene har blitt lagret.",
        });
      } else {
        // Create new company
        const companyRef = doc(collection(db, 'companies'));
        await setDoc(companyRef, {
          ...data,
          createdBy: currentUser.uid,
          approved: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Update user with company ID
        await updateDoc(doc(db, 'users', currentUser.uid), {
          companyId: companyRef.id,
          updatedAt: serverTimestamp()
        });

        toast({
          title: "Firma registrert",
          description: "Ditt firma er nå registrert og venter på godkjenning.",
        });
      }
      
      setShouldReload(prev => prev + 1);
    } catch (error: any) {
      toast({
        title: "Feil ved lagring",
        description: error.message || "Noe gikk galt. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Laster firmainformasjon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {company && !company.approved && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Venter på godkjenning</CardTitle>
            <CardDescription className="text-yellow-700">
              Ditt firma er registrert og venter på godkjenning fra administrator.
              Du vil få beskjed når firmaet er godkjent.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {company && company.approved && (
        <div className="mb-6">
          <Badge variant="default" className="mb-4">Godkjent firma</Badge>
        </div>
      )}

      <FirmaSkjema
        company={company || undefined}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}