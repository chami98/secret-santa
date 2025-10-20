import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types';
import { isValidCompanyEmail } from '../utils/validation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isValidDomain: boolean;
  emailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValidDomain, setIsValidDomain] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        setIsValidDomain(isValidCompanyEmail(firebaseUser.email));
        setEmailVerified(firebaseUser.emailVerified);
      } else {
        setUser(null);
        setIsValidDomain(false);
        setEmailVerified(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      // Validate email domain before creating account
      if (!isValidCompanyEmail(email)) {
        throw new Error('Only @ineight.com email addresses are allowed');
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(result.user, { displayName });
      
      // Send email verification
      await sendEmailVerification(result.user);
      
      alert('Verification email sent! Please check your inbox and verify your email.');
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Validate domain
      if (!isValidCompanyEmail(result.user.email)) {
        await firebaseSignOut(auth);
        throw new Error('Invalid email domain. Only company emails are allowed.');
      }

      // Check if email is verified
      if (!result.user.emailVerified) {
        throw new Error('Please verify your email before signing in. Check your inbox.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    isValidDomain,
    emailVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

