import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/types';

export function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'buyer' as UserRole
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passordene matcher ikke",
        description: "Vennligst sjekk at passordene er identiske.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.fullName, formData.role);
      toast({
        title: "Registrering vellykket",
        description: "Din konto har blitt opprettet.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Registrering feilet",
        description: error.message || "Noe gikk galt. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Opprett konto</CardTitle>
          <CardDescription>
            Fyll ut skjemaet for å registrere deg på DGM Logistikk
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Fullt navn</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Ola Nordmann"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                placeholder="din@epost.no"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Jeg ønsker å</Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
              >
                <option value="buyer">Kjøpe frakttjenester</option>
                <option value="seller">Selge frakttjenester</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passord</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bekreft passord</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrerer..." : "Registrer deg"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Har du allerede en konto?{' '}
              <Link to="/logg-inn" className="text-primary hover:underline">
                Logg inn her
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}