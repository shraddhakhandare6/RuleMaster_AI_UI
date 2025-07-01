"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import type { LanguageKey } from '@/lib/translations';

type UserContextType = {
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  language: LanguageKey;
  setLanguage: (language: LanguageKey) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [firstName, setFirstName] = useState('Shraddha');
  const [lastName, setLastName] = useState('User');
  const [email, setEmail] = useState('admin@rulewise.app');
  const [language, setLanguage] = useState<LanguageKey>('en');

  return (
    <UserContext.Provider value={{ 
      firstName, setFirstName, 
      lastName, setLastName,
      email, setEmail,
      language, setLanguage 
    }}>
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
