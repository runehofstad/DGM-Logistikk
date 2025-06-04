import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

export function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <ShieldX className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle>Ingen tilgang</CardTitle>
          <CardDescription>
            Du har ikke tilgang til denne siden. Kontakt administrator hvis du mener dette er en feil.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link to="/">
            <Button>Tilbake til forsiden</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}