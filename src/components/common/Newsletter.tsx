import { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NewsletterProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export function Newsletter({ variant = 'default', className }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn("bg-secondary/50 rounded-xl p-5", className)}>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-sm">Newsletter</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Conseils bien-être chaque semaine
        </p>
        {submitted ? (
          <div className="flex items-center gap-2 text-sm text-accent">
            <Check className="h-4 w-4" />
            Merci pour votre inscription !
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-sm h-9"
            />
            <Button type="submit" size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              S'inscrire
            </Button>
          </form>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn("bg-primary/10 rounded-xl p-6", className)}>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Restez informé</h4>
            <p className="text-sm text-muted-foreground">
              Recevez nos meilleurs conseils pour gérer stress et anxiété
            </p>
          </div>
          {submitted ? (
            <div className="flex items-center gap-2 text-accent font-medium">
              <Check className="h-5 w-5" />
              Inscrit !
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="min-w-[200px]"
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-gradient-to-br from-primary/20 to-secondary rounded-2xl p-8 text-center", className)}>
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 mb-4">
        <Mail className="h-7 w-7 text-accent" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Rejoignez notre communauté</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Recevez chaque semaine nos meilleurs conseils et techniques pour mieux gérer votre stress et votre anxiété.
      </p>
      {submitted ? (
        <div className="flex items-center justify-center gap-2 text-accent font-medium">
          <Check className="h-5 w-5" />
          Merci ! Vérifiez votre boîte mail.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            S'inscrire gratuitement
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      )}
      <p className="text-xs text-muted-foreground mt-4">
        Pas de spam. Désinscription possible à tout moment.
      </p>
    </div>
  );
}
