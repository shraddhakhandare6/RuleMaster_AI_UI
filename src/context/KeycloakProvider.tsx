
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Keycloak from 'keycloak-js';

interface KeycloakContextType {
  keycloak: Keycloak | null;
  initialized: boolean;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

export function useKeycloak() {
  const context = useContext(KeycloakContext);
  if (context === undefined) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }
  return context;
}

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [keycloakInstance, setKeycloakInstance] = useState<Keycloak | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // This code runs only on the client side
    const keycloakConfig = {
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL!,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM!,
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
    };

    if (!keycloakConfig.url || !keycloakConfig.realm || !keycloakConfig.clientId) {
      console.error('Keycloak configuration is missing. Please check your .env file and restart the server.');
      setInitialized(true); // Mark as initialized to not block the app
      return;
    }

    const kc = new Keycloak(keycloakConfig);

    kc.init({ onLoad: 'login-required' })
      .then(authenticated => {
        if (authenticated) {
          setKeycloakInstance(kc);
        }
        setInitialized(true);
      })
      .catch(error => {
        console.error('Keycloak initialization failed:', error);
        setInitialized(true); // Mark as initialized to allow app to render with error
      });
  }, []);
  
  if (!initialized) {
    // You can return a loading spinner or some placeholder here
    return <div className="flex h-screen w-full items-center justify-center">Loading Authentication...</div>;
  }

  return (
    <KeycloakContext.Provider value={{ keycloak: keycloakInstance, initialized }}>
      {children}
    </KeycloakContext.Provider>
  );
}
