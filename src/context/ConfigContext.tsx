import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export interface PackageConfig {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string;
  whatsappMessage: string;
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;
  themeColor: string;
  heroImage: string;
  featuredArtTitle: string;
  featuredArtTag: string;
  contactLabel1: string;
  contactLink1: string;
  contactLabel2: string;
  contactLink2: string;
  contactLabel3: string;
  contactLink3: string;
  service1Title: string; // Deprecated, keep for backward compatibility
  service1Price: string;
  service1Desc: string;
  service1Features: string;
  service2Title: string;
  service2Price: string;
  service2Desc: string;
  service2Features: string;
  service3Title: string;
  service3Price: string;
  service3Desc: string;
  service3Features: string;
  packages?: PackageConfig[];
  galleryCategories: string[];
}

const defaultConfig: SiteConfig = {
  heroTitle: "Ethereal Portraits\nCollection",
  heroSubtitle: "We transform your memories into museum-grade digital paintings. Every stroke is hand-painted with precision.",
  whatsappNumber: "+1234567890",
  themeColor: "orange",
  heroImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  featuredArtTitle: "\"Ethereal Dreams\"",
  featuredArtTag: "Featured Art",
  contactLabel1: "+1234567890",
  contactLink1: "https://wa.me/1234567890",
  contactLabel2: "@zellouis.art",
  contactLink2: "https://instagram.com/zellouis.art",
  contactLabel3: "lynk.id/zellouis",
  contactLink3: "https://lynk.id/zellouis",
  service1Title: 'Custom Portraits',
  service1Price: 'From $150',
  service1Desc: 'Transform your photos into stunning digital paintings with a highly stylized, cinematic feel.',
  service1Features: 'High-res digital file\n1 Character\nSimple background\n2 revision rounds',
  service2Title: 'Concept & Character Design',
  service2Price: 'From $250',
  service2Desc: 'Bring your original characters and novel concepts to vivid reality with detailed full-body illustrations.',
  service2Features: 'High-res digital file\nIterative sketches\nComplex details\nProps included',
  service3Title: 'Environment & Splash Art',
  service3Price: 'From $400',
  service3Desc: 'Breathtaking full-scale scenes for games, novel covers, or professional branding needs.',
  service3Features: 'Commercial rights option\nComplex architecture/nature\nDynamic lighting\nSource files',
  packages: [
    {
      id: "pkg-1",
      title: "Custom Portraits",
      price: "From $150",
      description: "Transform your photos into stunning digital paintings with a highly stylized, cinematic feel.",
      features: "High-res digital file\n1 Character\nSimple background\n2 revision rounds",
      whatsappMessage: "Hello! I'm interested in the Custom Portraits package."
    },
    {
      id: "pkg-2",
      title: "Concept & Character Design",
      price: "From $250",
      description: "Bring your original characters and novel concepts to vivid reality with detailed full-body illustrations.",
      features: "High-res digital file\nIterative sketches\nComplex details\nProps included",
      whatsappMessage: "Hello! I'm interested in the Concept & Character Design package."
    },
    {
      id: "pkg-3",
      title: "Environment & Splash Art",
      price: "From $400",
      description: "Breathtaking full-scale scenes for games, novel covers, or professional branding needs.",
      features: "Commercial rights option\nComplex architecture/nature\nDynamic lighting\nSource files",
      whatsappMessage: "Hello! I'm interested in the Environment & Splash Art package."
    }
  ],
  galleryCategories: ['Portraits', 'Fantasy', 'Concept Art']
};

const ConfigContext = createContext<SiteConfig>(defaultConfig);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const mergedConfig = { ...defaultConfig };
        for (const key in data) {
          if (data[key]) {
            (mergedConfig as any)[key] = data[key];
          }
        }
        setConfig(mergedConfig as SiteConfig);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'site/config');
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0c0c0e] flex items-center justify-center z-50">
        <div className="w-8 h-8 relative">
          <div className="absolute inset-0 border-2 border-zinc-800 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
