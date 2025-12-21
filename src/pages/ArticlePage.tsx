import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Newsletter } from '@/components/common/Newsletter';
import { AdSlot } from '@/components/common/AdSlot';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { TableOfContents } from '@/components/articles/TableOfContents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { SEO, useArticleSEO } from '@/components/seo';
import { getArticleBreadcrumb, generateArticleSchema } from '@/lib/seo-helpers';
import { CriticalDisclaimer } from '@/components/common/CriticalDisclaimer';
import { getArticleBySlug, getArticlesByCategory } from '@/lib/articles';
import { Article } from '@/data/all-articles';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function parseMarkdownToHtml(content: string): string {
  let html = content;
  
  // Headers with IDs
  html = html.replace(/^### (.+)$/gm, (_, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h3 id="${id}">${text}</h3>`;
  });
  html = html.replace(/^## (.+)$/gm, (_, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h2 id="${id}">${text}</h2>`;
  });
  
  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;
  
  // Clean up
  html = html.replace(/<p><h/g, '<h');
  html = html.replace(/<\/h(\d)><\/p>/g, '</h$1>');
  html = html.replace(/<p><ul>/g, '<ul>');
  html = html.replace(/<\/ul><\/p>/g, '</ul>');
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  return html;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <Layout>
        <div className="container-content py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-8">L'article que vous recherchez n'existe pas.</p>
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedArticles = getArticlesByCategory(article.category)
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  const categoryUrl = `/categorie/${article.category}`;
  const year = article.datePublished.substring(0, 4);
  const month = article.datePublished.substring(5, 7);
  const articleUrl = `/article/${year}/${month}/${article.slug}`;

  // Utilisation du hook pour générer les métadonnées SEO
  const seoProps = useArticleSEO({
    title: article.title,
    excerpt: article.excerpt,
    slug: article.slug,
    publishedAt: article.datePublished,
    updatedAt: article.dateModified,
    category: article.categoryLabel,
    imageUrl: article.image ? `https://calmeclair.com${article.image}` : undefined,
    keywords: article.tags,
  });

  // Génération des schemas JSON-LD
  const breadcrumbSchema = getArticleBreadcrumb(
    article.categoryLabel,
    article.category,
    article.title,
    article.slug,
    article.datePublished
  );

  const articleSchema = generateArticleSchema({
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    publishedAt: article.datePublished,
    updatedAt: article.dateModified,
    author: 'CalmeClair',
    category: article.categoryLabel,
    imageUrl: article.image ? `https://calmeclair.com${article.image}` : undefined,
    slug: article.slug,
  });

  return (
    <Layout>
      {/* SEO - Nouveau système */}
      <SEO
        {...seoProps}
        jsonLd={[breadcrumbSchema, articleSchema]}
      />

      <article>
        {/* Breadcrumb */}
        <div className="container-content py-4">
          <Breadcrumb
            items={[
              { label: article.categoryLabel, href: categoryUrl },
              { label: article.title },
            ]}
          />
        </div>

        {/* Header */}
        <header className="container-content pb-8">
          <div className="max-w-3xl">
            <Link 
              to={categoryUrl}
              className="inline-block"
            >
              <Badge variant="secondary" className="mb-4 hover:bg-secondary/80">
                {article.categoryLabel}
              </Badge>
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {article.excerpt}
            </p>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>CalmeClair</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.datePublished}>
                  {formatDate(article.datePublished)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min de lecture</span>
              </div>
            </div>
            {article.dateModified !== article.datePublished && (
              <p className="text-xs text-muted-foreground mt-2">
                Mis à jour le {formatDate(article.dateModified)}
              </p>
            )}
          </div>
        </header>

        {/* Featured Image */}
        <div className="container-content pb-8">
          <div className="aspect-[21/9] overflow-hidden rounded-2xl">
            <img
              src={article.image}
              alt={article.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
            {/* Main Content */}
            <div className="min-w-0">
              {/* Table of Contents - Mobile */}
              <div className="lg:hidden mb-8 p-4 bg-secondary/30 rounded-xl">
                <TableOfContents content={article.content} />
              </div>

              {/* Article Content */}
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(article.content) }}
              />

              {/* Newsletter CTA */}
              <div className="my-10">
                <Newsletter variant="inline" />
              </div>

              {/* AI Disclaimer */}
              <div className="my-8 p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Note de transparence :</strong> Cet article a été rédigé avec l'aide de l'intelligence artificielle puis révisé et validé par l'équipe éditoriale de CalmeClair. Les informations présentées sont basées sur des sources scientifiques citées et ne remplacent pas un avis médical professionnel.
                </p>
              </div>
              <CriticalDisclaimer />

              {/* Author Block */}
              <Separator className="my-8" />
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-soft">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-xl font-bold text-accent">C</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">CalmeClair</h4>
                  <p className="text-sm text-muted-foreground">
                    CalmeClair est votre ressource de confiance pour comprendre et gérer le stress et l'anxiété. Notre mission est de rendre les techniques de bien-être mental accessibles à tous.
                  </p>
                </div>
              </div>

              {/* Share & Tags */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 space-y-6">
                {/* Table of Contents */}
                <div className="p-4 bg-card rounded-xl shadow-soft border border-border/50">
                  <TableOfContents content={article.content} />
                </div>
                {/* Ad Slot */}
                <AdSlot size="rectangle" />
                {/* Newsletter */}
                <Newsletter variant="compact" />
              </div>
            </aside>
          </div>
        </div>

        {/* Ad Slot */}
        <div className="container-content py-8">
          <AdSlot size="leaderboard" />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-secondary/30 py-12 mt-12">
            <div className="container-content">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Articles similaires
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}
