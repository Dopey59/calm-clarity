import { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

// ========================================
// TODO: Pour activer EmailJS :
// 1. Installer : npm install @emailjs/browser
// 2. Décommenter l'import ci-dessous
// 3. Configurer vos identifiants EmailJS
// ========================================
// import emailjs from '@emailjs/browser';
//
// const EMAILJS_SERVICE_ID = 'your_service_id';
// const EMAILJS_TEMPLATE_ID = 'your_template_id';
// const EMAILJS_PUBLIC_KEY = 'your_public_key';
// ========================================

const emailSchema = z.string().email({ message: "Email invalide" });

type Status = 'idle' | 'loading' | 'success' | 'error';

export function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setErrorMessage(result.error.errors[0].message);
      return;
    }

    setStatus('loading');

    // ========================================
    // TODO: Décommenter pour activer EmailJS
    // ========================================
    // try {
    //   await emailjs.send(
    //     EMAILJS_SERVICE_ID,
    //     EMAILJS_TEMPLATE_ID,
    //     { subscriber_email: email },
    //     EMAILJS_PUBLIC_KEY
    //   );
    //   setStatus('success');
    //   setEmail('');
    // } catch (error) {
    //   console.error('EmailJS error:', error);
    //   setStatus('error');
    //   setErrorMessage('Une erreur est survenue. Réessayez plus tard.');
    // }
    // ========================================

    // Simulation temporaire (à supprimer après intégration EmailJS)
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-sm text-primary">
        <CheckCircle className="h-4 w-4" />
        <span>Merci pour votre inscription !</span>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
        <Mail className="h-4 w-4 text-primary" />
        Newsletter
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        Conseils bien-être chaque semaine
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage('');
              if (status === 'error') setStatus('idle');
            }}
            className="h-9 text-sm bg-background/50"
            disabled={status === 'loading'}
          />
          <Button
            type="submit"
            size="sm"
            className="h-9 px-3"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'OK'
            )}
          </Button>
        </div>
        {(errorMessage || status === 'error') && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errorMessage || 'Une erreur est survenue'}
          </p>
        )}
      </form>
    </div>
  );
}
