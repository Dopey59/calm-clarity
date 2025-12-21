import { Article } from '@/types/Article';

/**
 * Auto-découverte des articles via Vite glob
 * Charge automatiquement tous les fichiers .ts dans anxiete/ et stress/
 */

// Import automatique de tous les articles
const anxieteModules = import.meta.glob('./anxiete/*.ts', { eager: true });
const stressModules = import.meta.glob('./stress/*.ts', { eager: true });

/**
 * Extraire les articles depuis les modules importés
 */
function extractArticles(modules: Record<string, any>): Article[] {
  return Object.values(modules)
    .map((module: any) => module.article)
    .filter(Boolean);
}

const anxieteArticles = extractArticles(anxieteModules);
const stressArticles = extractArticles(stressModules);

/**
 * Tous les articles générés (détection automatique)
 */
export const generatedArticles: Article[] = [
  ...anxieteArticles,
  ...stressArticles,
];

/**
 * Statistiques
 */
export const articleStats = {
  anxiete: anxieteArticles.length,
  stress: stressArticles.length,
  total: generatedArticles.length,
};
