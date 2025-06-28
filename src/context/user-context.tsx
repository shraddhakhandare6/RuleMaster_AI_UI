"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import type { LanguageKey } from '@/lib/translations';

type UserContextType = {
  firstName: string;
  setFirstName: (name: string) => void;
  language: LanguageKey;
  setLanguage: (language: LanguageKey) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [firstName, setFirstName] = useState('Admin');
  const [language, setLanguage] = useState<LanguageKey>('en');

  const logout = () => {
    // This is a placeholder logout function.
    // In a real app, this would handle token invalidation, etc.
    console.log('User logged out');
    // For now, we can just reset the name to a default.
    setFirstName('Admin');
    // Maybe redirect to a login page if one existed.
  };

  return (
    <UserContext.Provider value={{ firstName, setFirstName, language, setLanguage, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
