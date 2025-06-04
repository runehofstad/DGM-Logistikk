import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { FreightRequest } from '@/types';
import { MapPin, Package, Weight, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ForespørselKortProps {
  request: FreightRequest;
  companyName?: string;
  onContact?: () => void;
}

export function ForespørselKort({ request, companyName, onContact }: ForespørselKortProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{request.cargoType}</h3>
            {companyName && (
              <p className="text-sm text-muted-foreground">{companyName}</p>
            )}
          </div>
          <Badge variant={request.status === 'active' ? 'default' : 'secondary'}>
            {request.status === 'active' ? 'Aktiv' : 
             request.status === 'completed' ? 'Fullført' : 'Kansellert'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>
            {request.pickupLocation} → {request.deliveryLocation}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Weight className="h-4 w-4 text-muted-foreground" />
            <span>{request.weight} kg</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{request.numberOfItems} kolli</span>
          </div>
        </div>
        
        {request.specialNeeds && (
          <p className="text-sm text-muted-foreground mt-2">
            <span className="font-medium">Spesielle behov:</span> {request.specialNeeds}
          </p>
        )}
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
          <Calendar className="h-3 w-3" />
          <span>
            {formatDistanceToNow(
              request.createdAt instanceof Date 
                ? request.createdAt 
                : (request.createdAt as any).toDate(), 
              { 
                addSuffix: true, 
                locale: nb 
              }
            )}
          </span>
        </div>
      </CardContent>
      
      {onContact && request.status === 'active' && (
        <CardFooter>
          <Button onClick={onContact} className="w-full">
            Kontakt avsender
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}