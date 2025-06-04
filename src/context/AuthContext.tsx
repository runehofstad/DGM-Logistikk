import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  PhoneAuthProvider,
  multiFactor,
  RecaptchaVerifier
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/config';
import type { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  enable2FA: (phoneNumber: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData({ uid: user.uid, ...userDoc.data() } as User);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      email,
      fullName,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const enable2FA = async (phoneNumber: string) => {
    if (!currentUser) throw new Error('Ingen bruker innlogget');
    
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible'
    });
    
    const phoneAuthProvider = new PhoneAuthProvider(auth);
    const phoneInfoOptions = {
      phoneNumber,
      session: await multiFactor(currentUser).getSession()
    };
    
    const verificationId = await phoneAuthProvider.verifyPhoneNumber(
      phoneInfoOptions,
      recaptchaVerifier
    );
    
    return verificationId;
  };

  const value = {
    currentUser,
    userData,
    loading,
    signIn,
    signUp,
    logout,
    enable2FA
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}