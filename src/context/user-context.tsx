"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { LanguageKey } from '@/lib/translations';
import { useKeycloak } from './KeycloakProvider';

type UserContextType = {
  firstName: string;
  setFirstName: (name: string) => void;
  language: LanguageKey;
  setLanguage: (language: LanguageKey) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { keycloak, initialized } = useKeycloak();
  const [firstName, setFirstName] = useState('User');
  const [language, setLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (initialized && keycloak?.authenticated) {
      keycloak.loadUserProfile().then((profile) => {
        setFirstName(profile.firstName || 'User');
      });
    }
  }, [initialized, keycloak]);
  
  const logout = () => {
    keycloak?.logout({ redirectUri: window.location.origin });
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
