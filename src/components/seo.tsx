import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogImageAlt?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  jsonLd?: object | object[];
}

const DEFAULT_OG_IMAGE = 'https://calmeclair.com/images/og-image.jpg';
const SITE_NAME = 'CalmeClair';
const TWITTER_HANDLE = '@calmeclair'; // À adapter

export function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = 'CalmeClair - Santé Mentale & Bien-être',
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  articleSection,
  keywords = [],
  noindex = false,
  nofollow = false,
  jsonLd,
}: SEOProps) {
  // Titre complet avec le nom du site
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  
  // URL canonique
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Robots meta
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  return (
    <Helmet>
      {/* Titre */}
      <title>{fullTitle}</title>
      
      {/* Meta tags de base */}
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      {/* Open Graph - Article specific */}
      {ogType === 'article' && (
        <>
          {articlePublishedTime && (
            <meta property="article:published_time" content={articlePublishedTime} />
          )}
          {articleModifiedTime && (
            <meta property="article:modified_time" content={articleModifiedTime} />
          )}
          {articleAuthor && (
            <meta property="article:author" content={articleAuthor} />
          )}
          {articleSection && (
            <meta property="article:section" content={articleSection} />
          )}
        </>
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
}

// Hook helper pour générer des métadonnées d'article
export function useArticleSEO(article: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  imageUrl?: string;
  keywords?: string[];
}) {
  const publishDate = new Date(article.publishedAt).toISOString();
  const updateDate = article.updatedAt 
    ? new Date(article.updatedAt).toISOString() 
    : publishDate;

  const year = new Date(article.publishedAt).getFullYear();
  const month = String(new Date(article.publishedAt).getMonth() + 1).padStart(2, '0');
  const canonical = `https://calmeclair.com/article/${year}/${month}/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    canonical,
    ogType: 'article' as const,
    ogImage: article.imageUrl || DEFAULT_OG_IMAGE,
    articlePublishedTime: publishDate,
    articleModifiedTime: updateDate,
    articleSection: article.category,
    keywords: article.keywords || [],
  };
}
