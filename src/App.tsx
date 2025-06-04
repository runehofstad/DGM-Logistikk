import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { Layout } from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';

// Pages
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Requests } from '@/pages/Requests';
import { NewRequest } from '@/pages/NewRequest';
import { CompanyPage } from '@/pages/Company';
import { Profile } from '@/pages/Profile';
import { Admin } from '@/pages/Admin';
import { Unauthorized } from '@/pages/Unauthorized';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="logg-inn" element={<Login />} />
            <Route path="registrer" element={<Register />} />
            <Route path="foresporsler" element={<Requests />} />
            <Route path="ikke-autorisert" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route
              path="ny-forespørsel"
              element={
                <AuthGuard allowedRoles={['buyer']}>
                  <NewRequest />
                </AuthGuard>
              }
            />
            <Route
              path="firma"
              element={
                <AuthGuard>
                  <CompanyPage />
                </AuthGuard>
              }
            />
            <Route
              path="profil"
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              }
            />
            <Route
              path="admin"
              element={
                <AuthGuard allowedRoles={['superadmin']}>
                  <Admin />
                </AuthGuard>
              }
            />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
