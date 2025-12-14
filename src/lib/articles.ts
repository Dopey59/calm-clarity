/**
 * Bibliothèque de chargement des articles
 * VERSION TYPESCRIPT - Simple et fiable
 */

import { Article } from '@/types/Article';
import { allArticles } from '@/data/all-articles';

/**
 * Charge tous les articles
 */
export async function getAllArticles(): Promise<Article[]> {
  return allArticles;
}

/**
 * Récupère un article par son slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return allArticles.find(article => article.slug === slug) || null;
}

/**
 * Récupère les articles par catégorie
 */
export async function getArticlesByCategory(
  category: 'anxiete' | 'stress'
): Promise<Article[]> {
  return allArticles.filter(article => article.category === category);
}

/**
 * Récupère les articles en vedette
 */
export async function getFeaturedArticles(): Promise<Article[]> {
  return allArticles.filter(article => article.featured);
}

/**
 * Récupère les articles récents
 */
export async function getRecentArticles(count: number = 6): Promise<Article[]> {
  return allArticles.slice(0, count);
}

/**
 * Récupère tous les tags uniques
 */
export async function getAllTags(): Promise<string[]> {
  const tags = allArticles.flatMap(article => article.tags);
  return [...new Set(tags)];
}

/**
 * Recherche d'articles par terme
 */
export async function searchArticles(query: string): Promise<Article[]> {
  const lowerQuery = query.toLowerCase();
  
  return allArticles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.excerpt.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Charge le contenu complet d'un article
 */
export async function getArticleContent(slug: string): Promise<string | null> {
  const article = await getArticleBySlug(slug);
  return article?.content || null;
}
