/**
 * Helper pour générer les schemas JSON-LD avancés pour le SEO
 * Incluant BreadcrumbList, Article, FAQPage, HowTo, WebSite, Organization
 */

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface HowToStep {
  name: string;
  text: string;
  image?: string;
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

  // Estimation du temps de lecture (250 mots/minute)
  const wordCount = article.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 250);

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
      'url': 'https://calmeclair.com/a-propos'
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
    'wordCount': wordCount,
    'timeRequired': `PT${readingTime}M`,
    'inLanguage': 'fr-FR',
  };
}

/**
 * Génère le schema FAQPage pour les sections FAQ
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}

/**
 * Génère le schema HowTo pour les guides pratiques
 */
export function generateHowToSchema(data: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // Format: PT30M pour 30 minutes
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': data.name,
    'description': data.description,
    'image': data.imageUrl || 'https://calmeclair.com/images/og-image.jpg',
    'totalTime': data.totalTime || 'PT10M',
    'step': data.steps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step.name,
      'text': step.text,
      'image': step.image
    }))
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
    'inLanguage': 'fr-FR',
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
    'description': 'Plateforme de bien-être mental et de gestion du stress',
    'sameAs': [
      // Ajoutez vos réseaux sociaux ici
      // 'https://twitter.com/calmeclair',
      // 'https://facebook.com/calmeclair',
    ],
  };
}

/**
 * Génère le schema MedicalWebPage pour les articles de santé
 */
export function generateMedicalWebPageSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    'name': article.title,
    'description': article.description,
    'url': article.url,
    'datePublished': new Date(article.datePublished).toISOString(),
    'dateModified': article.dateModified 
      ? new Date(article.dateModified).toISOString() 
      : new Date(article.datePublished).toISOString(),
    'about': {
      '@type': 'MedicalCondition',
      'name': 'Stress et Anxiété'
    },
    'specialty': {
      '@type': 'MedicalSpecialty',
      'name': 'Psychiatrie'
    },
    'inLanguage': 'fr-FR',
  };
}

/**
 * Extrait automatiquement les questions FAQ d'un contenu markdown
 * Cherche les patterns "**Question:**" ou titres commençant par des mots interrogatifs
 */
export function extractFAQsFromContent(content: string): FAQItem[] {
  const faqs: FAQItem[] = [];
  
  // Pattern 1: Questions en gras suivies de réponses
  const boldQuestionPattern = /\*\*([^*]+\?)\*\*\s*\n([^\n]+(?:\n(?!\*\*)[^\n]+)*)/g;
  let match;
  
  while ((match = boldQuestionPattern.exec(content)) !== null) {
    faqs.push({
      question: match[1].trim(),
      answer: match[2].trim()
    });
  }
  
  // Pattern 2: Titres de niveau 3 avec "?" suivis du paragraphe suivant
  const h3QuestionPattern = /### ([^#\n]+\?)\n\n([^\n]+(?:\n(?!###)[^\n]+)*)/g;
  
  while ((match = h3QuestionPattern.exec(content)) !== null) {
    if (!faqs.find(f => f.question === match[1].trim())) {
      faqs.push({
        question: match[1].trim(),
        answer: match[2].trim()
      });
    }
  }
  
  return faqs;
}
