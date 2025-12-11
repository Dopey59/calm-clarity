/**
 * Helper pour générer le schema BreadcrumbList JSON-LD
 * Utilisé pour améliorer le SEO des fils d'Ariane
 */

interface BreadcrumbItem {
  name: string;
  href: string;
}

/**
 * Génère le JSON-LD BreadcrumbList selon le standard schema.org
 * @param items - Tableau des éléments du fil d'Ariane
 * @returns JSON-LD au format Schema.org
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.href,
    })),
  };
}

/**
 * Génère le breadcrumb pour la page d'accueil
 */
export function getHomeBreadcrumb() {
  return generateBreadcrumbSchema([
    { name: 'Accueil', href: 'https://calmeclair.com/' },
  ]);
}

/**
 * Génère le breadcrumb pour une page catégorie
 */
export function getCategoryBreadcrumb(categoryName: string, categorySlug: string) {
  return generateBreadcrumbSchema([
    { name: 'Accueil', href: 'https://calmeclair.com/' },
    { name: categoryName, href: `https://calmeclair.com/categorie/${categorySlug}` },
  ]);
}

/**
 * Génère le breadcrumb pour un article
 */
export function getArticleBreadcrumb(
  categoryName: string,
  categorySlug: string,
  articleTitle: string,
  articleSlug: string,
  publishedAt: string
) {
  const date = new Date(publishedAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return generateBreadcrumbSchema([
    { name: 'Accueil', href: 'https://calmeclair.com/' },
    { name: categoryName, href: `https://calmeclair.com/categorie/${categorySlug}` },
    { 
      name: articleTitle, 
      href: `https://calmeclair.com/article/${year}/${month}/${articleSlug}` 
    },
  ]);
}

/**
 * Génère le schema Article complet pour les pages d'articles
 */
export function generateArticleSchema(article: {
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: string;
  imageUrl?: string;
  slug: string;
}) {
  const date = new Date(article.publishedAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const articleUrl = `https://calmeclair.com/article/${year}/${month}/${article.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.excerpt,
    'image': article.imageUrl || 'https://calmeclair.com/images/og-image.jpg',
    'datePublished': new Date(article.publishedAt).toISOString(),
    'dateModified': article.updatedAt 
      ? new Date(article.updatedAt).toISOString() 
      : new Date(article.publishedAt).toISOString(),
    'author': {
      '@type': 'Person',
      'name': article.author,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'CalmeClair',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://calmeclair.com/images/logo.png',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    'articleSection': article.category,
  };
}

/**
 * Génère le schema WebSite pour la page d'accueil
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'CalmeClair',
    'url': 'https://calmeclair.com',
    'description': 'Ressources et conseils pour gérer le stress, l\'anxiété et améliorer votre santé mentale',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://calmeclair.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Génère le schema Organization pour le site
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'CalmeClair',
    'url': 'https://calmeclair.com',
    'logo': 'https://calmeclair.com/images/logo.png',
    'sameAs': [
      // Ajoutez vos réseaux sociaux ici
      // 'https://twitter.com/calmeclair',
      // 'https://facebook.com/calmeclair',
    ],
  };
}
