import { useState } from 'react';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Mail, Phone } from 'lucide-react';

export function Profile() {
  const { currentUser, userData, enable2FA } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [fullName, setFullName] = useState(userData?.fullName || '');
  const [show2FASetup, setShow2FASetup] = useState(false);

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    setLoading(true);

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        fullName,
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Profil oppdatert",
        description: "Dine endringer har blitt lagret.",
      });
    } catch (error: any) {
      toast({
        title: "Feil ved oppdatering",
        description: error.message || "Noe gikk galt. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!phoneNumber) {
      toast({
        title: "Telefonnummer påkrevd",
        description: "Du må oppgi et telefonnummer for å aktivere 2FA.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await enable2FA(phoneNumber);
      
      toast({
        title: "2FA aktivert",
        description: "To-faktor autentisering er nå aktivert for din konto.",
      });
      
      setShow2FASetup(false);
    } catch (error: any) {
      toast({
        title: "Feil ved aktivering av 2FA",
        description: error.message || "Noe gikk galt. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = () => {
    switch (userData?.role) {
      case 'buyer':
        return <Badge>Kjøper</Badge>;
      case 'seller':
        return <Badge>Selger</Badge>;
      case 'superadmin':
        return <Badge variant="destructive">Administrator</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Min profil</h1>

      <div className="space-y-6">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Kontoinformasjon</CardTitle>
            <CardDescription>Din grunnleggende kontoinformasjon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">E-post</span>
              </div>
              <span className="text-sm">{currentUser?.email}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Rolle</span>
              </div>
              {getRoleBadge()}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">2FA Status</span>
              </div>
              <Badge variant={userData?.twoFactorEnabled ? "default" : "outline"}>
                {userData?.twoFactorEnabled ? "Aktivert" : "Deaktivert"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Rediger profil</CardTitle>
            <CardDescription>Oppdater din personlige informasjon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Fullt navn</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ola Nordmann"
              />
            </div>
            
            <Button onClick={handleUpdateProfile} disabled={loading}>
              {loading ? "Lagrer..." : "Lagre endringer"}
            </Button>
          </CardContent>
        </Card>

        {/* 2FA Setup */}
        {!userData?.twoFactorEnabled && (
          <Card>
            <CardHeader>
              <CardTitle>To-faktor autentisering</CardTitle>
              <CardDescription>
                Legg til et ekstra lag med sikkerhet til kontoen din
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!show2FASetup ? (
                <Button onClick={() => setShow2FASetup(true)}>
                  Aktiver 2FA
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Telefonnummer</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+47 123 45 678"
                    />
                  </div>
                  <div id="recaptcha-container"></div>
                  <div className="flex gap-2">
                    <Button onClick={handleEnable2FA} disabled={loading}>
                      {loading ? "Aktiverer..." : "Bekreft og aktiver"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShow2FASetup(false)}
                      disabled={loading}
                    >
                      Avbryt
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}