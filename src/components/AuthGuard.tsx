import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRole } from '@/hooks/useRole';
import type { UserRole } from '@/types';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export function AuthGuard({ 
  children, 
  allowedRoles, 
  requireAuth = true 
}: AuthGuardProps) {
  const { currentUser, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Laster...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !currentUser) {
    return <Navigate to="/logg-inn" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/ikke-autorisert" replace />;
  }

  return <>{children}</>;
}