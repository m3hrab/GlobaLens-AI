'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';
import { getStoredUser, clearAuthData, isAuthenticated } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = getStoredUser();
    const authenticated = isAuthenticated();
    
    if (authenticated && storedUser) {
      setUser(storedUser);
    }
    
    setIsLoading(false);
  }, []);

  const logout = () => {
    clearAuthData();
    setUser(null);
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
