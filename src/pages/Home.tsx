import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, Users, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';

export function Home() {
  const { currentUser } = useAuth();
  const { role } = useRole();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Velkommen til DGM Logistikk
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Den ledende B2B-plattformen som kobler kjøpere og selgere av frakttjenester i Norge
          </p>
          
          {!currentUser ? (
            <div className="flex gap-4 justify-center">
              <Link to="/registrer">
                <Button size="lg">Kom i gang</Button>
              </Link>
              <Link to="/logg-inn">
                <Button size="lg" variant="outline">Logg inn</Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link to="/foresporsler">
                <Button size="lg">Se forespørsler</Button>
              </Link>
              {role === 'buyer' && (
                <Link to="/ny-forespørsel">
                  <Button size="lg" variant="outline">Ny forespørsel</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Hvorfor velge DGM Logistikk?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Truck className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Effektiv matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Vi kobler raskt sammen kjøpere og selgere av frakttjenester
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Package className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Alle typer frakt</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Fra småpakker til store industrilaster - vi dekker alt
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Verifiserte bedrifter</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Alle bedrifter gjennomgår en godkjenningsprosess
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Trygg plattform</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sikre transaksjoner og beskyttelse av bedriftsinformasjon
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!currentUser && (
        <section className="bg-primary/5 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Klar til å effektivisere din logistikk?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Registrer din bedrift i dag og få tilgang til Norges største nettverk av frakttjenester
            </p>
            <Link to="/registrer">
              <Button size="lg">Registrer bedrift</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}