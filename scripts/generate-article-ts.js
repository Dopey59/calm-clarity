#!/usr/bin/env node

/**
 * Génération d'articles au format TypeScript
 * SIMPLE, FIABLE, SANS COMPLICATIONS
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CATEGORY = process.env.CATEGORY || 'stress';
const TOPIC = process.env.TOPIC || 'stress';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Lire les articles existants
 */
function getExistingArticles() {
  const articlesFile = path.join(process.cwd(), 'src/data/articles-generated.ts');
  
  if (!fs.existsSync(articlesFile)) {
    return [];
  }
  
  const content = fs.readFileSync(articlesFile, 'utf8');
  
  // Extraire les titres existants
  const titleMatches = content.matchAll(/title: ['"](.+?)['"]/g);
  return Array.from(titleMatches).map(m => m[1].toLowerCase());
}

/**
 * Trouver le prochain ID
 */
function getNextId() {
  const articlesFile = path.join(process.cwd(), 'src/data/articles-generated.ts');
  
  if (!fs.existsSync(articlesFile)) {
    return 1;
  }
  
  const content = fs.readFileSync(articlesFile, 'utf8');
  const idMatches = content.matchAll(/id: ['"](\d+)['"]/g);
  const ids = Array.from(idMatches).map(m => parseInt(m[1]));
  
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

// Rechercher une image Unsplash
async function searchUnsplashImage(query) {
  if (!UNSPLASH_ACCESS_KEY) {
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop';
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` }
    });

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return `https://images.unsplash.com/photo-${data.results[0].id}?w=1200&h=630&fit=crop`;
    }
    
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop';
  } catch (error) {
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop';
  }
}

// Générer l'article
async function generateArticle() {
  console.log(`📝 Génération d'un article sur: ${TOPIC}`);
  
  const existingTitles = getExistingArticles();
  console.log(`\n🔍 ${existingTitles.length} articles existants détectés`);
  
  const existingList = existingTitles.map(t => `- ${t}`).join('\n');
  
  const prompt = `Tu es un expert en rédaction d'articles sur la santé mentale pour CalmeClair.

Rédige un article original sur "${TOPIC}".

SUJETS DÉJÀ TRAITÉS (à éviter) :
${existingList}

Critères :
- Titre accrocheur et SEO-friendly (UNIQUE)
- 2000-2500 mots
- Structure avec H2/H3
- Solutions pratiques
- Section FAQ (5-8 questions)
- Sources scientifiques

IMPORTANT: Génère UNIQUEMENT le contenu Markdown. Pas de frontmatter.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = message.content[0].text;
  
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Article sans titre';
  
  console.log(`✅ Titre: "${title}"`);
  
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const paragraphs = content.split('\n\n').filter(p => !p.startsWith('#'));
  const excerpt = paragraphs[0]?.substring(0, 200).replace(/['"]/g, '') || `Article sur ${TOPIC}`;
  
  return { title, slug, excerpt, content };
}

// Créer/mettre à jour le fichier TypeScript
async function updateArticlesFile(article) {
  const articlesFile = path.join(process.cwd(), 'src/data/articles-generated.ts');
  const nextId = getNextId();
  const today = new Date().toISOString().split('T')[0];
  const image = await searchUnsplashImage(`${TOPIC} mental health wellness`);
  
  // Échapper le contenu pour TypeScript
  const contentEscaped = article.content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  
  const titleEscaped = article.title.replace(/'/g, "\\'");
  const excerptEscaped = article.excerpt.replace(/'/g, "\\'");
  
  const newArticle = `  {
    id: '${nextId}',
    slug: '${article.slug}',
    title: '${titleEscaped}',
    excerpt: '${excerptEscaped}',
    content: \`${contentEscaped}\`,
    category: '${CATEGORY}' as const,
    categoryLabel: '${CATEGORY === 'anxiete' ? 'Anxiété' : 'Stress'}',
    tags: ['${TOPIC}', 'bien-être', 'santé mentale'],
    image: '${image}',
    imageAlt: 'Illustration pour article : ${titleEscaped}',
    datePublished: '${today}',
    dateModified: '${today}',
    readingTime: 10,
    featured: true,
  }`;
  
  if (fs.existsSync(articlesFile)) {
    // Ajouter au fichier existant
    let content = fs.readFileSync(articlesFile, 'utf8');
    
    // Trouver la fin du tableau
    const lastBracket = content.lastIndexOf('];');
    if (lastBracket === -1) {
      throw new Error('Format invalide du fichier articles-generated.ts');
    }
    
    // Insérer le nouvel article
    content = content.slice(0, lastBracket) + `,\n${newArticle}\n];`;
    
    fs.writeFileSync(articlesFile, content, 'utf8');
  } else {
    // Créer le fichier
    const fileContent = `import { Article } from '@/types/Article';

/**
 * Articles générés automatiquement
 * NE PAS MODIFIER MANUELLEMENT
 */

export const generatedArticles: Article[] = [
${newArticle}
];
`;
    
    fs.writeFileSync(articlesFile, fileContent, 'utf8');
  }
  
  console.log(`✅ Article ajouté à articles-generated.ts (ID: ${nextId})`);
  
  return nextId;
}

// Main
async function main() {
  try {
    console.log('🚀 Génération article TypeScript\n');
    
    const article = await generateArticle();
    const id = await updateArticlesFile(article);
    
    console.log('\n🎉 Article généré avec succès !');
    console.log(`   ID: ${id}`);
    console.log(`   Slug: ${article.slug}`);
    
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  }
}

main();
