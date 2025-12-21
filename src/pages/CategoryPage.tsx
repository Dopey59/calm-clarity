import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Newsletter } from '@/components/common/Newsletter';
import { AdSlot } from '@/components/common/AdSlot';
import { getArticlesByCategory } from '@/lib/articles';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/seo';
import { getCategoryBreadcrumb } from '@/lib/seo-helpers';

const ARTICLES_PER_PAGE = 12;

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
  const [currentPage, setCurrentPage] = useState(1);

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
  const allArticles = getArticlesByCategory(category);
  
  // Pagination
  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const currentArticles = allArticles.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      'itemListElement': allArticles.map((article, index) => ({
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
        <p className="text-lg text-muted-foreground max-w-2xl mb-6">
          {info.description}
        </p>
        
        {/* Bouton Voir Tous les Articles */}
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/articles">
              Voir tous les articles
            </Link>
          </Button>
        </div>
      </header>

      {/* Ad Slot */}
      <div className="container-content pb-8">
        <AdSlot size="leaderboard" />
      </div>

      {/* Pagination Info */}
      {totalPages > 1 && (
        <div className="container-content pb-6">
          <p className="text-sm text-muted-foreground">
            Affichage de {startIndex + 1} à {Math.min(endIndex, allArticles.length)} sur {allArticles.length} articles
            • Page {currentPage} sur {totalPages}
          </p>
        </div>
      )}

      {/* Articles Grid */}
      <section className="container-content pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentArticles.map((article, index) => (
            <>
              <ArticleCard key={article.id} article={article} />
              {/* Insert ad after 6th article */}
              {index === 5 && (
                <div key="ad-slot" className="md:col-span-2 lg:col-span-3">
                  <AdSlot size="leaderboard" />
                </div>
              )}
            </>
          ))}
        </div>
        {allArticles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Aucun article dans cette catégorie pour le moment.</p>
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <section className="container-content pb-16">
          <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </Button>
                  {currentPage > 4 && <span className="px-2">...</span>}
                </>
              )}

              {/* Pages around current */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return page >= currentPage - 2 && page <= currentPage + 2;
                })
                .map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}

              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Page info */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Page {currentPage} sur {totalPages}
          </p>
        </section>
      )}

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
