import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Newsletter } from '@/components/common/Newsletter';
import { AdSlot } from '@/components/common/AdSlot';
import { getAllArticles } from '@/lib/articles';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/seo';

const ARTICLES_PER_PAGE = 12;

export default function AllArticlesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Récupérer TOUS les articles (stress + anxiété)
  const allArticles = getAllArticles();
  
  // Calcul pagination
  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const currentArticles = allArticles.slice(startIndex, endIndex);
  
  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Accueil',
        'item': 'https://calmeclair.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Tous les Articles',
        'item': 'https://calmeclair.com/articles'
      }
    ]
  };
  
  // ItemList schema pour SEO
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Tous les Articles - CalmeClair',
    'description': 'Découvrez tous nos articles sur la gestion du stress et de l\'anxiété',
    'url': 'https://calmeclair.com/articles',
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': allArticles.length,
      'itemListElement': currentArticles.map((article, index) => ({
        '@type': 'ListItem',
        'position': startIndex + index + 1,
        'url': `https://calmeclair.com/article/${article.datePublished.substring(0, 4)}/${article.datePublished.substring(5, 7)}/${article.slug}`
      }))
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      {/* SEO */}
      <SEO
        title="Tous les Articles - Stress & Anxiété"
        description={`Découvrez nos ${allArticles.length} articles sur la gestion du stress et de l'anxiété. Conseils pratiques, techniques éprouvées et informations scientifiques pour votre bien-être mental.`}
        canonical="https://calmeclair.com/articles"
        ogType="website"
        keywords={['articles stress', 'articles anxiété', 'bien-être mental', 'santé mentale', 'conseils psychologie']}
        jsonLd={[breadcrumbSchema, itemListSchema]}
      />

      {/* Breadcrumb */}
      <div className="container-content py-4">
        <Breadcrumb
          items={[
            { label: 'Tous les Articles' },
          ]}
        />
      </div>

      {/* Header */}
      <header className="container-content pb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Tous les Articles
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-6">
          Explorez notre bibliothèque complète de {allArticles.length} articles sur la gestion du stress et de l'anxiété.
        </p>
        
        {/* Filtres par catégorie */}
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/categorie/stress">
              Stress uniquement
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/categorie/anxiete">
              Anxiété uniquement
            </Link>
          </Button>
        </div>
      </header>

      {/* Ad Slot */}
      <div className="container-content pb-8">
        <AdSlot size="leaderboard" />
      </div>

      {/* Pagination Info */}
      <div className="container-content pb-6">
        <p className="text-sm text-muted-foreground">
          Affichage de {startIndex + 1} à {Math.min(endIndex, allArticles.length)} sur {allArticles.length} articles
          {totalPages > 1 && ` • Page ${currentPage} sur ${totalPages}`}
        </p>
      </div>

      {/* Articles Grid */}
      <section className="container-content pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentArticles.map((article, index) => (
            <>
              <ArticleCard key={article.id} article={article} />
              {/* Insert ad after every 6 articles */}
              {index === 5 && (
                <div key="ad-slot-1" className="md:col-span-2 lg:col-span-3">
                  <AdSlot size="leaderboard" />
                </div>
              )}
            </>
          ))}
        </div>
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
                  // Show current page and 2 pages on each side
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

      {/* Categories CTA */}
      <section className="bg-secondary/30 py-12">
        <div className="container-content">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Explorer par Catégorie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link 
              to="/categorie/stress"
              className="group p-6 bg-background rounded-lg border border-border hover:border-primary transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Stress
              </h3>
              <p className="text-muted-foreground">
                Techniques et conseils pour gérer le stress au quotidien
              </p>
            </Link>
            <Link 
              to="/categorie/anxiete"
              className="group p-6 bg-background rounded-lg border border-border hover:border-primary transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Anxiété
              </h3>
              <p className="text-muted-foreground">
                Comprendre et surmonter l'anxiété avec des méthodes éprouvées
              </p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}