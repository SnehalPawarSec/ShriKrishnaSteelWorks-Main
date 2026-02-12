import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: (User & { isAdmin?: boolean }) | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { isAdmin?: boolean }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Enhance Firebase user with any locally stored metadata (e.g. custom displayName, admin flag)
        const storedUserRaw = localStorage.getItem('user');
        let isAdmin = false;
        let displayName = authUser.displayName;

        if (storedUserRaw) {
          try {
            const storedUser = JSON.parse(storedUserRaw);
            isAdmin = !!storedUser.isAdmin;
            // Prefer the name we explicitly stored during signup/login (if present)
            if (storedUser.displayName) {
              displayName = storedUser.displayName;
            }
          } catch (e) {
            console.error('Failed to parse stored user from localStorage:', e);
          }
        }

        setUser({ ...authUser, isAdmin, displayName });
      } else {
        // Check if admin user is in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.isAdmin) {
            setUser(userData as User & { isAdmin: boolean });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      // Remove admin user from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.isAdmin) {
          localStorage.removeItem('user');
          setUser(null);
          return;
        }
      }
      // Regular Firebase logout
      await signOut(auth);
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

