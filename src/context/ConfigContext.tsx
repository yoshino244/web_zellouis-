import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;
  themeColor: string;
}

const defaultConfig: SiteConfig = {
  heroTitle: "Ethereal Portraits\nCollection",
  heroSubtitle: "We transform your memories into museum-grade digital paintings. Every stroke is hand-painted with precision.",
  whatsappNumber: "+1234567890",
  themeColor: "orange"
};

const ConfigContext = createContext<SiteConfig>(defaultConfig);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(docSnap.data() as SiteConfig);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'site/config');
    });

    return () => unsub();
  }, []);

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
