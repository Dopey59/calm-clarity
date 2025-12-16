import { Article } from './articles'; // ← Correction ici
import { articles as manualArticles } from './articles';
import { generatedArticles } from './articles-generated';

/**
 * Tous les articles (manuels + générés)
 */
export const allArticles: Article[] = [
  ...generatedArticles,
  ...manualArticles,
].sort((a, b) => 
  new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
);

export type { Article };