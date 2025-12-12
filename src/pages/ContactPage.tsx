import { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout>
      <title>Contact | CalmeClair</title>
      <meta name="description" content="Contactez l'équipe CalmeClair. Questions, suggestions ou partenariats - nous sommes à votre écoute." />

      {/* Breadcrumb */}
      <div className="container-content py-4">
        <Breadcrumb items={[{ label: 'Contact' }]} />
      </div>

      {/* Header */}
      <header className="container-content pb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Contactez-nous
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Une question, une suggestion ou simplement envie de nous écrire ? Nous sommes à votre écoute.
        </p>
      </header>

      {/* Contact Form */}
      <section className="container-content pb-16">
        <div className="max-w-xl">
          {submitted ? (
            <div className="p-8 bg-primary/10 rounded-2xl text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/20 mb-4">
                <Check className="h-7 w-7 text-accent" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Message envoyé !</h2>
              <p className="text-muted-foreground">
                Merci pour votre message. Nous vous répondrons dans les meilleurs délais.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Objet de votre message"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Votre message..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <Send className="mr-2 h-5 w-5" />
                Envoyer le message
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Alternative contact */}
      <section className="bg-secondary/30 py-12">
        <div className="container-content">
          <div className="flex items-center gap-4 p-6 bg-card rounded-xl shadow-soft max-w-xl">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Email direct</h3>
              <p className="text-sm text-muted-foreground">
                Vous pouvez également nous écrire directement à{' '}
                <a href="mailto:contact@calmeclair.com" className="text-primary hover:underline">
                  contact@calmeclair.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
