import { useState } from 'react';
import { Cookie, Settings, X, Shield, BarChart3, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

export function CookieConsentBanner() {
  const {
    preferences,
    showBanner,
    showPreferences,
    acceptAll,
    rejectAll,
    savePreferences,
    openPreferences,
    closePreferences,
  } = useCookieConsent();

  const [tempPrefs, setTempPrefs] = useState({
    analytics: preferences.analytics,
    advertising: preferences.advertising,
  });

  const handleOpenPreferences = () => {
    setTempPrefs({
      analytics: preferences.analytics,
      advertising: preferences.advertising,
    });
    openPreferences();
  };

  const handleSavePreferences = () => {
    savePreferences(tempPrefs);
  };

  if (!showBanner && !showPreferences) return null;

  return (
    <>
      {/* Banner */}
      {showBanner && !showPreferences && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border shadow-lg animate-in slide-in-from-bottom-4 duration-300">
          <div className="container-content">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">
                    Nous utilisons des cookies
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pour améliorer votre expérience, analyser le trafic et afficher des publicités personnalisées.{' '}
                    <Link to="/confidentialite" className="text-primary hover:underline">
                      En savoir plus
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectAll}
                  className="flex-1 lg:flex-none"
                >
                  Refuser
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenPreferences}
                  className="flex-1 lg:flex-none"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Personnaliser
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="flex-1 lg:flex-none"
                >
                  Tout accepter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <Dialog open={showPreferences} onOpenChange={(open) => !open && closePreferences()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              Préférences des cookies
            </DialogTitle>
            <DialogDescription>
              Personnalisez vos préférences de cookies. Les cookies essentiels ne peuvent pas être désactivés.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Essential Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Cookies essentiels</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Nécessaires au fonctionnement du site. Ils permettent la navigation et l'accès aux fonctions de base.
                  </p>
                </div>
              </div>
              <Switch checked disabled className="data-[state=checked]:bg-primary" />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Cookies analytiques</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Nous aident à comprendre comment vous utilisez le site (Google Analytics). Aucune donnée personnelle n'est partagée.
                  </p>
                </div>
              </div>
              <Switch
                checked={tempPrefs.analytics}
                onCheckedChange={(checked) => setTempPrefs((p) => ({ ...p, analytics: checked }))}
              />
            </div>

            {/* Advertising Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <Megaphone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Cookies publicitaires</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Permettent d'afficher des publicités pertinentes (Google AdSense). Ces cookies peuvent suivre votre navigation sur d'autres sites.
                  </p>
                </div>
              </div>
              <Switch
                checked={tempPrefs.advertising}
                onCheckedChange={(checked) => setTempPrefs((p) => ({ ...p, advertising: checked }))}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button variant="outline" onClick={rejectAll} className="flex-1">
              Tout refuser
            </Button>
            <Button onClick={handleSavePreferences} className="flex-1">
              Enregistrer mes choix
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2">
            <Link to="/confidentialite" className="hover:underline" onClick={closePreferences}>
              Politique de confidentialité
            </Link>
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
