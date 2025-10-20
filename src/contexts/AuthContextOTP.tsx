import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  isSignInWithEmailLink,
} from 'firebase/auth';
import { auth, appConfig } from '../config/firebase';
import { User } from '../types';
import { isValidCompanyEmail } from '../utils/validation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  isValidDomain: boolean;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        setIsValidDomain(isValidCompanyEmail(firebaseUser.email));
      } else {
        setUser(null);
        setIsValidDomain(false);
      }
      setLoading(false);
    });

    // Check if user is signing in with email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Get email from localStorage
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device
        email = window.prompt('Please provide your email for confirmation');
      }
      
      if (email && isValidCompanyEmail(email)) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            // Redirect will happen via onAuthStateChanged
          })
          .catch((error) => {
            console.error('Error signing in with email link:', error);
          });
      }
    }

    return unsubscribe;
  }, []);

  const sendOTP = async (email: string) => {
    try {
      // Validate email domain before sending OTP
      if (!isValidCompanyEmail(email)) {
        throw new Error(`Only @${appConfig.allowedDomain} email addresses are allowed`);
      }

      const actionCodeSettings = {
        url: `${appConfig.appUrl}`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save email to localStorage to complete sign-in
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const verifyOTP = async (email: string) => {
    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        throw new Error('Invalid sign-in link');
      }

      // Validate domain
      if (!isValidCompanyEmail(email)) {
        throw new Error(`Invalid email domain. Only @${appConfig.allowedDomain} emails are allowed.`);
      }

      await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
    } catch (error) {
      console.error('Error verifying OTP:', error);
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
    sendOTP,
    verifyOTP,
    signOut,
    isValidDomain,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

