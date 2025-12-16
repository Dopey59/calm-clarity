import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Brain } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Newsletter } from '@/components/common/Newsletter';
import { AdSlot } from '@/components/common/AdSlot';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getFeaturedArticles, getArticlesByCategory, getRecentArticles } from '@/lib/articles';
import { SEO } from '@/components/seo';
import { generateWebsiteSchema, generateOrganizationSchema, getHomeBreadcrumb } from '@/lib/seo-helpers';

const Index = () => {
  const featuredArticles = getFeaturedArticles();
  const anxietyArticles = getArticlesByCategory('anxiete').slice(0, 3);
  const stressArticles = getArticlesByCategory('stress').slice(0, 3);
  const recentArticles = getRecentArticles(4);

  // Génération des schemas JSON-LD
  const jsonLdSchemas = [
    generateWebsiteSchema(),
    generateOrganizationSchema(),
    getHomeBreadcrumb(),
  ];

  return (
    <Layout>
      {/* SEO Meta - Nouveau système */}
      <SEO
        title="CalmeClair - Conseils & Techniques pour Gérer Stress et Anxiété"
        description="Découvrez des techniques éprouvées et conseils d'experts pour mieux gérer votre stress et anxiété au quotidien. Articles, exercices et ressources gratuites."
        canonical="https://calmeclair.com/"
        ogType="website"
        keywords={[
          'stress',
          'anxiété',
          'santé mentale',
          'bien-être',
          'gestion du stress',
          'techniques de relaxation',
          'méditation',
          'anxiété au quotidien',
        ]}
        jsonLd={jsonLdSchemas}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[url('/images/hero-home.jpg')] bg-cover bg-center opacity-5" />
        <div className="container-content relative py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="secondary" className="mb-4 animate-fade-up">
              <Sparkles className="h-3 w-3 mr-1" />
              Votre bien-être mental compte
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-up text-balance">
              Retrouvez la <span className="text-primary">sérénité</span> au quotidien
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up animation-delay-100">
              Des techniques éprouvées et des conseils pratiques pour mieux gérer votre stress et votre anxiété. Parce que votre équilibre mental mérite toute l'attention.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up animation-delay-200">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/categorie/anxiete">
                  <Brain className="mr-2 h-5 w-5" />
                  Explorer Anxiété
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/categorie/stress">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explorer Stress
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticles[0] && (
        <section className="container-content py-12">
          <ArticleCard article={featuredArticles[0]} variant="featured" />
        </section>
      )}

      {/* Ad Slot */}
      <div className="container-content py-6">
        <AdSlot size="leaderboard" />
      </div>

      {/* Recent Articles Grid */}
      <section className="container-content py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Articles récents</h2>
          <Link 
            to="/categorie/anxiete" 
            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
          >
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentArticles.slice(0, 4).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="container-content py-12">
        <Newsletter />
      </section>

      {/* Anxiety Section */}
      <section className="bg-secondary/30 py-16">
        <div className="container-content">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge variant="outline" className="mb-2 border-primary/50 text-primary">Anxiété</Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Comprendre et gérer l'anxiété</h2>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link to="/categorie/anxiete">
                Tous les articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {anxietyArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link to="/categorie/anxiete">
                Voir tous les articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ad Slot */}
      <div className="container-content py-6">
        <AdSlot size="rectangle" className="max-w-sm mx-auto" />
      </div>

      {/* Stress Section */}
      <section className="py-16">
        <div className="container-content">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge variant="outline" className="mb-2 border-accent/50 text-accent">Stress</Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Techniques anti-stress</h2>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link to="/categorie/stress">
                Tous les articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stressArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link to="/categorie/stress">
                Voir tous les articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-b from-background to-primary/5 py-16">
        <div className="container-content text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à retrouver votre calme ?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Explorez nos ressources gratuites et commencez votre parcours vers un meilleur équilibre mental dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/a-propos">
                Découvrir notre mission
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
