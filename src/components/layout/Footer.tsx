import { Link } from 'react-router-dom';
import { Heart, Cookie } from 'lucide-react';
import { FooterNewsletter } from '@/components/common/FooterNewsletter';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const footerLinks = {
  navigation: [
    { name: 'Accueil', href: '/' },
    { name: 'Anxiété', href: '/categorie/anxiete' },
    { name: 'Stress', href: '/categorie/stress' },
  ],
  resources: [
    { name: 'À propos', href: '/a-propos' },
    { name: 'Contact', href: '/contact' },
    { name: 'Sources & Méthodologie', href: '/a-propos#methodologie' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/mentions-legales' },
    { name: 'Confidentialité', href: '/confidentialite' },
    { name: 'DMCA', href: '/dmca' },
  ],
};

export function Footer() {
  const { openPreferences } = useCookieConsent();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-content py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <span className="text-base font-bold text-accent">C</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Calme<span className="text-primary">Clair</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Votre ressource de confiance pour comprendre et gérer le stress et l'anxiété au quotidien.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">Ressources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <FooterNewsletter />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} CalmeClair</p>
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={openPreferences}
              className="hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <Cookie className="h-3.5 w-3.5" />
              Gérer mes cookies
            </button>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Fait avec <Heart className="h-3.5 w-3.5 text-primary fill-primary" /> pour votre bien-être
          </p>
        </div>
      </div>
    </footer>
  );
}
