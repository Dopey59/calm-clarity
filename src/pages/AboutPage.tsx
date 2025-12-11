import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Newsletter } from '@/components/common/Newsletter';
import { Heart, Target, Users, BookOpen, Shield, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <Layout>
      <title>À propos de CalmeClair | Notre Mission</title>
      <meta name="description" content="Découvrez la mission de CalmeClair : rendre les techniques de gestion du stress et de l'anxiété accessibles à tous grâce à des contenus fiables et pratiques." />

      {/* Breadcrumb */}
      <div className="container-content py-4">
        <Breadcrumb items={[{ label: 'À propos' }]} />
      </div>

      {/* Header */}
      <header className="container-content pb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
          Notre mission : votre <span className="text-primary">sérénité</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          CalmeClair est né d'une conviction simple : chacun mérite d'avoir accès à des techniques efficaces pour mieux gérer son stress et son anxiété.
        </p>
      </header>

      {/* Values */}
      <section className="container-content pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-xl shadow-soft">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Accessibilité</h3>
            <p className="text-muted-foreground text-sm">
              Des techniques expliquées simplement, pour que chacun puisse les appliquer immédiatement dans son quotidien.
            </p>
          </div>
          <div className="p-6 bg-card rounded-xl shadow-soft">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Fiabilité</h3>
            <p className="text-muted-foreground text-sm">
              Chaque article est basé sur des recherches scientifiques et des sources vérifiées, avec références citées.
            </p>
          </div>
          <div className="p-6 bg-card rounded-xl shadow-soft">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Bienveillance</h3>
            <p className="text-muted-foreground text-sm">
              Nous abordons la santé mentale sans stigmatisation, avec empathie et respect pour le parcours de chacun.
            </p>
          </div>
        </div>
      </section>

      {/* What we cover */}
      <section className="bg-secondary/30 py-16">
        <div className="container-content">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary" />
            Ce que nous couvrons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Anxiété</h3>
              <ul className="space-y-2">
                {[
                  'Comprendre les mécanismes de l\'anxiété',
                  'Techniques de gestion des crises',
                  'Anxiété sociale et professionnelle',
                  'Exercices de respiration et ancrage',
                  'Approches cognitivo-comportementales',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Stress</h3>
              <ul className="space-y-2">
                {[
                  'Méditation et pleine conscience',
                  'Alimentation et bien-être mental',
                  'Sommeil et récupération',
                  'Gestion du stress au travail',
                  'Techniques de relaxation',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section id="methodologie" className="container-content py-16 scroll-mt-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Sources & Méthodologie
        </h2>
        <div className="prose max-w-none">
          <p className="text-muted-foreground mb-4">
            Chez CalmeClair, nous nous engageons à fournir des informations fiables et vérifiées. Voici notre approche :
          </p>
          
          <h3 className="text-lg font-semibold mt-8 mb-3">Nos sources</h3>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>• Publications scientifiques peer-reviewed (PubMed, PsycINFO)</li>
            <li>• Recommandations d'organisations de santé reconnues (OMS, HAS)</li>
            <li>• Ouvrages de référence en psychologie et neurosciences</li>
            <li>• Expertise de professionnels de santé mentale</li>
          </ul>

          <h3 className="text-lg font-semibold mt-8 mb-3">Utilisation de l'IA</h3>
          <p className="text-muted-foreground mb-4">
            Certains de nos articles sont rédigés avec l'assistance de l'intelligence artificielle. Cependant, chaque contenu est systématiquement :
          </p>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>• Révisé par notre équipe éditoriale</li>
            <li>• Vérifié par rapport aux sources scientifiques</li>
            <li>• Enrichi avec des références vérifiables</li>
            <li>• Mis à jour régulièrement</li>
          </ul>

          <h3 className="text-lg font-semibold mt-8 mb-3">Avertissement</h3>
          <p className="text-muted-foreground">
            Les informations fournies sur CalmeClair sont à but éducatif et informatif uniquement. Elles ne remplacent en aucun cas un avis médical professionnel, un diagnosticique ou un traitement. Si vous souffrez de troubles anxieux ou de stress chronique, nous vous encourageons à consulter un professionnel de santé qualifié.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="bg-card py-16">
        <div className="container-content text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 mb-6">
            <Users className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">L'équipe CalmeClair</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            CalmeClair est un projet éditorial indépendant, porté par une équipe passionnée par la vulgarisation de la santé mentale et le bien-être psychologique.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-content py-16">
        <Newsletter />
      </section>
    </Layout>
  );
}
