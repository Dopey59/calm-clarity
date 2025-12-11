import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Newsletter } from '@/components/common/Newsletter';
import { AdSlot } from '@/components/common/AdSlot';
import { getArticlesByCategory } from '@/data/articles';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/seo';
import { getCategoryBreadcrumb } from '@/lib/seo-helpers';

const categoryInfo = {
  anxiete: {
    title: 'Anxiété',
    description: 'Découvrez nos articles et conseils pour comprendre, prévenir et gérer l\'anxiété au quotidien. Des techniques pratiques et des informations basées sur la science.',
    metaDescription: 'Conseils et techniques pour gérer l\'anxiété. Exercices de respiration, gestion des crises, TCC et méthodes naturelles pour retrouver la sérénité.',
    keywords: ['anxiété', 'crise d\'anxiété', 'trouble anxieux', 'gestion anxiété', 'relaxation', 'respiration'],
  },
  stress: {
    title: 'Stress',
    description: 'Explorez nos ressources pour réduire le stress et retrouver votre équilibre. Méditation, alimentation, sommeil et bien plus encore.',
    metaDescription: 'Techniques anti-stress éprouvées : méditation, alimentation, exercices et conseils pratiques pour diminuer votre niveau de stress au quotidien.',
    keywords: ['stress', 'gestion du stress', 'anti-stress', 'méditation', 'relaxation', 'burnout'],
  },
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug as 'anxiete' | 'stress' | undefined;

  if (!category || !categoryInfo[category]) {
    return (
      <Layout>
        <div className="container-content py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Catégorie non trouvée</h1>
          <p className="text-muted-foreground mb-8">La catégorie que vous recherchez n'existe pas.</p>
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const info = categoryInfo[category];
  const articles = getArticlesByCategory(category);

  // Génération du breadcrumb schema
  const breadcrumbSchema = getCategoryBreadcrumb(info.title, category);

  // Génération du schema ItemList pour les articles
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${info.title} - CalmeClair`,
    'description': info.description,
    'url': `https://calmeclair.com/categorie/${category}`,
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': articles.map((article, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': `https://calmeclair.com/article/${article.datePublished.substring(0, 4)}/${article.datePublished.substring(5, 7)}/${article.slug}`
      }))
    }
  };

  return (
    <Layout>
      {/* SEO - Nouveau système */}
      <SEO
        title={`${info.title} - Conseils & Techniques`}
        description={info.metaDescription}
        canonical={`https://calmeclair.com/categorie/${category}`}
        ogType="website"
        keywords={info.keywords}
        jsonLd={[breadcrumbSchema, itemListSchema]}
      />

      {/* Breadcrumb */}
      <div className="container-content py-4">
        <Breadcrumb
          items={[
            { label: info.title },
          ]}
        />
      </div>

      {/* Header */}
      <header className="container-content pb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {info.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {info.description}
        </p>
      </header>

      {/* Ad Slot */}
      <div className="container-content pb-8">
        <AdSlot size="leaderboard" />
      </div>

      {/* Articles Grid */}
      <section className="container-content pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <>
              <ArticleCard key={article.id} article={article} />
              {/* Insert ad after 3rd article */}
              {index === 2 && (
                <div key="ad-slot" className="md:col-span-2 lg:col-span-3">
                  <AdSlot size="leaderboard" />
                </div>
              )}
            </>
          ))}
        </div>
        {articles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Aucun article dans cette catégorie pour le moment.</p>
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="container-content pb-16">
        <Newsletter />
      </section>

      {/* Cross-link to other category */}
      <section className="bg-secondary/30 py-12">
        <div className="container-content text-center">
          <h2 className="text-2xl font-bold mb-4">
            Explorez aussi nos articles sur le {category === 'anxiete' ? 'Stress' : 'l\'Anxiété'}
          </h2>
          <p className="text-muted-foreground mb-6">
            Découvrez d'autres ressources pour votre bien-être mental.
          </p>
          <Button asChild>
            <Link to={`/categorie/${category === 'anxiete' ? 'stress' : 'anxiete'}`}>
              Voir les articles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
