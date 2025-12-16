/**
 * Bibliothèque de chargement des articles
 * VERSION TYPESCRIPT - Simple et fiable
 */

import { Article } from '@/data/all-articles';
import { allArticles } from '@/data/all-articles';

/**
 * Charge tous les articles
 */
export function getAllArticles(): Article[] {
  return allArticles;
}

/**
 * Récupère un article par son slug
 */
export function getArticleBySlug(slug: string): Article | null {
  return allArticles.find(article => article.slug === slug) || null;
}

/**
 * Récupère les articles par catégorie
 */
export function getArticlesByCategory(
  category: 'anxiete' | 'stress'
): Article[] {
  return allArticles.filter(article => article.category === category);
}

/**
 * Récupère les articles en vedette
 */
export function getFeaturedArticles(): Article[] {
  return allArticles.filter(article => article.featured);
}

/**
 * Récupère les articles récents
 */
export function getRecentArticles(count: number = 6): Article[] {
  return allArticles.slice(0, count);
}

/**
 * Récupère tous les tags uniques
 */
export function getAllTags(): string[] {
  const tags = allArticles.flatMap(article => article.tags);
  return [...new Set(tags)];
}

/**
 * Recherche d'articles par terme
 */
export function searchArticles(query: string): Article[] {
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
export function getArticleContent(slug: string): string | null {
  const article = getArticleBySlug(slug);
  return article?.content || null;
}