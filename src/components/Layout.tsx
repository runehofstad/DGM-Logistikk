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
      <nav className="shadow-sm border-b" style={{ backgroundColor: '#220C4D' }}>
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
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Forespørsler</Button>
                  </Link>
                  {role === 'buyer' && (
                    <>
                      <Link to="/ny-forespørsel">
                        <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Ny forespørsel</Button>
                      </Link>
                      <Link to="/mine-foresporsler">
                        <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Mine forespørsler</Button>
                      </Link>
                    </>
                  )}
                  <Link to="/firma">
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Mitt firma</Button>
                  </Link>
                  <Link to="/profil">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                      <User className="h-5 w-5 text-white" />
                    </Button>
                  </Link>
                  {role === 'superadmin' && (
                    <Link to="/admin">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                        <Shield className="h-5 w-5 text-white" />
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white hover:bg-white/10 hover:text-white">
                    <LogOut className="h-5 w-5 text-white" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/logg-inn">
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Logg inn</Button>
                  </Link>
                  <Link to="/registrer">
                    <Button className="bg-white text-primary hover:bg-white/90">Registrer deg</Button>
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
                className="text-white hover:bg-white/10 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden" style={{ backgroundColor: '#220C4D' }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentUser ? (
                <>
                  <Link to="/foresporsler" className="block">
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                      Forespørsler
                    </Button>
                  </Link>
                  {role === 'buyer' && (
                    <>
                      <Link to="/ny-forespørsel" className="block">
                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                          Ny forespørsel
                        </Button>
                      </Link>
                      <Link to="/mine-foresporsler" className="block">
                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                          Mine forespørsler
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link to="/firma" className="block">
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                      Mitt firma
                    </Button>
                  </Link>
                  <Link to="/profil" className="block">
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                      Min profil
                    </Button>
                  </Link>
                  {role === 'superadmin' && (
                    <Link to="/admin" className="block">
                      <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:bg-white/10 hover:text-white" 
                    onClick={handleLogout}
                  >
                    Logg ut
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/logg-inn" className="block">
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 hover:text-white">
                      Logg inn
                    </Button>
                  </Link>
                  <Link to="/registrer" className="block">
                    <Button className="w-full justify-start bg-white text-primary hover:bg-white/90">
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