import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';
import { useState } from 'react';
import dgmLogo from '@/assets/DGM_logo.png';

export function Layout() {
  const { currentUser, logout } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/logg-inn');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src={dgmLogo} alt="DGM Logistikk" className="h-10 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <>
                  <Link to="/foresporsler">
                    <Button variant="ghost">Forespørsler</Button>
                  </Link>
                  {role === 'buyer' && (
                    <>
                      <Link to="/ny-forespørsel">
                        <Button variant="ghost">Ny forespørsel</Button>
                      </Link>
                      <Link to="/mine-foresporsler">
                        <Button variant="ghost">Mine forespørsler</Button>
                      </Link>
                    </>
                  )}
                  <Link to="/firma">
                    <Button variant="ghost">Mitt firma</Button>
                  </Link>
                  <Link to="/profil">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  {role === 'superadmin' && (
                    <Link to="/admin">
                      <Button variant="ghost" size="icon">
                        <Shield className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/logg-inn">
                    <Button variant="ghost">Logg inn</Button>
                  </Link>
                  <Link to="/registrer">
                    <Button>Registrer deg</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentUser ? (
                <>
                  <Link to="/foresporsler" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      Forespørsler
                    </Button>
                  </Link>
                  {role === 'buyer' && (
                    <>
                      <Link to="/ny-forespørsel" className="block">
                        <Button variant="ghost" className="w-full justify-start">
                          Ny forespørsel
                        </Button>
                      </Link>
                      <Link to="/mine-foresporsler" className="block">
                        <Button variant="ghost" className="w-full justify-start">
                          Mine forespørsler
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link to="/firma" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      Mitt firma
                    </Button>
                  </Link>
                  <Link to="/profil" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      Min profil
                    </Button>
                  </Link>
                  {role === 'superadmin' && (
                    <Link to="/admin" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleLogout}
                  >
                    Logg ut
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/logg-inn" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      Logg inn
                    </Button>
                  </Link>
                  <Link to="/registrer" className="block">
                    <Button className="w-full justify-start">
                      Registrer deg
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}