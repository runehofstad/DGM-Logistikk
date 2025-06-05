import { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface AddressAutocompleteProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

let isScriptLoading = false;
let isScriptLoaded = false;

export function AddressAutocomplete({ 
  id, 
  placeholder, 
  value, 
  onChange, 
  required 
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!isScriptLoaded && !isScriptLoading && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      isScriptLoading = true;
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      window.initGoogleMaps = () => {
        isScriptLoaded = true;
        isScriptLoading = false;
      };
      
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!inputRef.current || !window.google || autocompleteRef.current) return;

    // Wait for Google Maps to be fully loaded
    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(checkGoogleMaps);
        
        try {
          // Initialize autocomplete
          autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current!, {
            componentRestrictions: { country: ['no', 'se', 'dk'] }, // Nordic countries
            fields: ['formatted_address', 'name']
          });

          // Listen for place selection
          if (autocompleteRef.current) {
            autocompleteRef.current.addListener('place_changed', () => {
              const place = autocompleteRef.current?.getPlace();
              if (place && (place.formatted_address || place.name)) {
                onChange(place.formatted_address || place.name || '');
              }
            });
          }
        } catch (error) {
          console.error('Error initializing Google Places Autocomplete:', error);
        }
      }
    }, 100);

    return () => {
      clearInterval(checkGoogleMaps);
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  return (
    <Input
      ref={inputRef}
      id={id}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  );
}