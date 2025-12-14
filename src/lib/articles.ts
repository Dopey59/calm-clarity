/**
 * Bibliothèque de chargement des articles depuis l'architecture MDX
 * Compatible avec le système précédent pour migration transparente
 */

import { Article } from '@/types/Article';

/**
 * Charge l'index JSON des articles (pré-généré)
 * Beaucoup plus rapide que de scanner tous les fichiers MDX
 */
export async function getAllArticles(): Promise<Article[]> {
  try {
    // IMPORTANT: Charge depuis /_index.json (dans public/)
    const response = await fetch('/_index.json');
    if (!response.ok) {
      console.warn('Index JSON non trouvé, fallback vers articles.ts');
      // Fallback vers l'ancien système si l'index n'existe pas encore
      const { articles } = await import('@/data/articles');
      return articles;
    }
    const articles = await response.json();
    return articles;
  } catch (error) {
    console.error('Erreur chargement index:', error);
    // Fallback vers l'ancien système
    try {
      const { articles } = await import('@/data/articles');
      return articles;
    } catch (fallbackError) {
      console.error('Erreur fallback:', fallbackError);
      return [];
    }
  }
}

/**
 * Récupère un article par son slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find(article => article.slug === slug) || null;
}

/**
 * Récupère les articles par catégorie
 */
export async function getArticlesByCategory(
  category: 'anxiete' | 'stress'
): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter(article => article.category === category);
}

/**
 * Récupère les articles en vedette
 */
export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter(article => article.featured);
}

/**
 * Récupère les articles récents
 */
export async function getRecentArticles(count: number = 6): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles
    .sort((a, b) => 
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
    )
    .slice(0, count);
}

/**
 * Récupère tous les tags uniques
 */
export async function getAllTags(): Promise<string[]> {
  const articles = await getAllArticles();
  const tags = articles.flatMap(article => article.tags);
  return [...new Set(tags)];
}

/**
 * Recherche d'articles par terme
 */
export async function searchArticles(query: string): Promise<Article[]> {
  const articles = await getAllArticles();
  const lowerQuery = query.toLowerCase();
  
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.excerpt.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Charge le contenu complet d'un article MDX
 * Note: Pour l'instant, le contenu est dans l'index JSON
 * Cette fonction permet une migration future vers chargement dynamique
 */
export async function getArticleContent(slug: string): Promise<string | null> {
  const article = await getArticleBySlug(slug);
  return article?.content || null;
}
