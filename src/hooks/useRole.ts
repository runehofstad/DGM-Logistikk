import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import type { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

export function useRole() {
  const { currentUser } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setRole(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', currentUser.uid),
      (snapshot) => {
        if (snapshot.exists()) {
          setRole(snapshot.data().role as UserRole);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Feil ved henting av brukerrolle:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return { role, loading };
}