import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Company } from '@/types';

interface FirmaSkjemaProps {
  company?: Company;
  onSubmit: (data: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'approved'>) => Promise<void>;
  loading?: boolean;
}

export function FirmaSkjema({ company, onSubmit, loading }: FirmaSkjemaProps) {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    organizationNumber: company?.organizationNumber || '',
    contactEmail: company?.contactEmail || '',
    description: company?.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{company ? 'Rediger firmainformasjon' : 'Registrer firma'}</CardTitle>
        <CardDescription>
          {company 
            ? 'Oppdater informasjonen om ditt firma'
            : 'Fyll ut skjemaet for å registrere ditt firma på plattformen'
          }
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Firmanavn</Label>
            <Input
              id="name"
              type="text"
              placeholder="Transport AS"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organizationNumber">Organisasjonsnummer</Label>
            <Input
              id="organizationNumber"
              type="text"
              placeholder="123456789"
              value={formData.organizationNumber}
              onChange={(e) => setFormData({...formData, organizationNumber: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Kontakt e-post</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="post@firma.no"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Firmabeskrivelse</Label>
            <Textarea
              id="description"
              placeholder="Beskriv hva slags tjenester dere tilbyr..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Lagrer...' : (company ? 'Oppdater firma' : 'Registrer firma')}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}