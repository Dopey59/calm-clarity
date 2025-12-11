import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  advertising: boolean;
}

interface CookieConsentContextType {
  preferences: CookiePreferences;
  hasConsented: boolean;
  showBanner: boolean;
  showPreferences: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: Partial<CookiePreferences>) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

const STORAGE_KEY = 'calmeclair_cookie_consent';
const CONSENT_DURATION_DAYS = 395; // ~13 months (CNIL recommendation)

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  advertising: false,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasConsented, setHasConsented] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { preferences: storedPrefs, timestamp } = JSON.parse(stored);
        const expirationDate = new Date(timestamp);
        expirationDate.setDate(expirationDate.getDate() + CONSENT_DURATION_DAYS);
        
        if (new Date() < expirationDate) {
          setPreferences({ ...defaultPreferences, ...storedPrefs });
          setHasConsented(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          setShowBanner(true);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const saveToStorage = (prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString(),
    }));
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      advertising: true,
    };
    setPreferences(allAccepted);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
    saveToStorage(allAccepted);
  };

  const rejectAll = () => {
    const allRejected: CookiePreferences = {
      essential: true,
      analytics: false,
      advertising: false,
    };
    setPreferences(allRejected);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
    saveToStorage(allRejected);
  };

  const savePreferences = (prefs: Partial<CookiePreferences>) => {
    const newPrefs: CookiePreferences = {
      essential: true, // Always true
      analytics: prefs.analytics ?? preferences.analytics,
      advertising: prefs.advertising ?? preferences.advertising,
    };
    setPreferences(newPrefs);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
    saveToStorage(newPrefs);
  };

  const openPreferences = () => {
    setShowPreferences(true);
  };

  const closePreferences = () => {
    setShowPreferences(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        preferences,
        hasConsented,
        showBanner,
        showPreferences,
        acceptAll,
        rejectAll,
        savePreferences,
        openPreferences,
        closePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return context;
}
