import { Article } from './articles';
import { articles as manualArticles } from './articles';
import { generatedArticles } from '@/content/articles';

/**
 * Tous les articles (manuels + générés)
 * Architecture SEO-optimale : 1 fichier par article
 */
export const allArticles: Article[] = [
  ...generatedArticles,
  ...manualArticles,
].sort((a, b) => 
  new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
);

export type { Article };
