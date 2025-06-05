import type { FreightRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Weight, Building2, Calendar, Mail } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';
// import { nb } from 'date-fns/locale';

interface ForespørselListProps {
  request: FreightRequest;
  companyName?: string;
  onContact: () => void;
}

export function ForespørselList({ request, companyName, onContact }: ForespørselListProps) {
  let createdAt: Date;
  
  if (request.createdAt) {
    // Check if it's a Firestore Timestamp
    if (typeof (request.createdAt as any).toDate === 'function') {
      createdAt = (request.createdAt as any).toDate();
    } else {
      // It's already a Date or something else
      createdAt = new Date(request.createdAt as any);
    }
  } else {
    createdAt = new Date();
  }
  
  return (
    <div className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left section - Main info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">{request.cargoType}</h3>
            <Badge variant="secondary" className="ml-2">
              {request.status === 'active' ? 'Aktiv' : 
               request.status === 'completed' ? 'Fullført' : 'Kansellert'}
            </Badge>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">Fra: {request.pickupLocation}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">Til: {request.deliveryLocation}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Weight className="h-4 w-4 mr-1" />
              <span>{request.weight} kg</span>
            </div>
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-1" />
              <span>{request.numberOfItems} kolli</span>
            </div>
            {companyName && (
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                <span>{companyName}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{createdAt.toLocaleDateString('nb-NO')}</span>
            </div>
          </div>

          {request.specialNeeds && (
            <p className="text-sm text-muted-foreground italic">
              Spesielle behov: {request.specialNeeds}
            </p>
          )}
        </div>

        {/* Right section - Action button */}
        <div className="flex-shrink-0">
          <Button onClick={onContact} size="sm">
            <Mail className="h-4 w-4 mr-1" />
            Kontakt
          </Button>
        </div>
      </div>
    </div>
  );
}