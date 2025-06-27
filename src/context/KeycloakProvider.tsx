
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Keycloak from 'keycloak-js';
import { AlertTriangle } from 'lucide-react';

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
  const [initError, setInitError] = useState<Error | null>(null);

  useEffect(() => {
    // This code runs only on the client side
    const keycloakConfig = {
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
    };

    if (!keycloakConfig.url || !keycloakConfig.realm || !keycloakConfig.clientId) {
        const error = new Error('Keycloak configuration is missing. Please check your .env file, ensure it is populated, and restart the server.');
        console.error(error.message);
        setInitError(error);
        setInitialized(true);
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
        const detailedError = new Error("Failed to connect to Keycloak. Please ensure your Keycloak server is running and accessible. Also, check that the 'Valid Redirect URIs' in your Keycloak client settings includes your application's URL (e.g., http://localhost:9002/*).");
        setInitError(detailedError);
        setInitialized(true);
      });
  }, []);
  
  if (!initialized) {
    return <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">Loading Authentication...</div>;
  }
  
  if (initError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground p-8">
            <div className="max-w-md w-full text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-headline font-semibold text-destructive mb-2">Authentication Error</h1>
                <p className="text-muted-foreground">{initError.message}</p>
            </div>
        </div>
      )
  }

  return (
    <KeycloakContext.Provider value={{ keycloak: keycloakInstance, initialized }}>
      {children}
    </KeycloakContext.Provider>
  );
}
