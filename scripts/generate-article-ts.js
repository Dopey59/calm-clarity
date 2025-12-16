#!/usr/bin/env node

/**
 * Génération d'articles au format TypeScript
 * AVEC ROTATION AUTOMATIQUE D'IMAGES UNIQUES
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
 * POOL D'IMAGES PAR CATÉGORIE
 * Rotation automatique pour éviter les doublons
 */
const IMAGE_POOLS = {
  anxiete: [
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&h=630&fit=crop', // Eau calme
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop', // Montagne brumeuse
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=630&fit=crop', // Plage zen
    'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200&h=630&fit=crop', // Lac miroir
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=630&fit=crop', // Nature verte
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=630&fit=crop', // Forêt lumineuse
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=630&fit=crop', // Lac montagne
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop', // Montagne neige
    'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=630&fit=crop', // Fleurs zen
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&h=630&fit=crop', // Ciel paisible
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&h=630&fit=crop', // Nature calme
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&h=630&fit=crop', // Feuillage zen
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1200&h=630&fit=crop', // Chemin nature
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=630&fit=crop', // Ciel étoilé
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=630&fit=crop', // Montagne calme
  ],
  stress: [
    'https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&h=630&fit=crop', // Yoga/Équilibre
    'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1200&h=630&fit=crop', // Méditation
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=630&fit=crop', // Bien-être
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop', // Nature apaisante
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=630&fit=crop', // Sérénité
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=630&fit=crop', // Espace zen
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop', // Calme
    'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=1200&h=630&fit=crop', // Détente
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&h=630&fit=crop', // Paix
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&h=630&fit=crop', // Nature
  ]
};

/**
 * Lire les images déjà utilisées
 */
function getUsedImages() {
  const articlesFile = path.join(process.cwd(), 'src/data/articles-generated.ts');
  
  if (!fs.existsSync(articlesFile)) {
    return [];
  }
  
  const content = fs.readFileSync(articlesFile, 'utf8');
  
  // Extraire toutes les URLs d'images
  const imageMatches = content.matchAll(/image: ['"](.+?)['"]/g);
  return Array.from(imageMatches).map(m => m[1]);
}

/**
 * Choisir une image non utilisée dans le pool
 */
function selectUniqueImage(category) {
  const pool = IMAGE_POOLS[category] || IMAGE_POOLS.anxiete;
  const usedImages = getUsedImages();
  
  // Filtrer les images non utilisées
  const availableImages = pool.filter(img => !usedImages.includes(img));
  
  // Si toutes les images ont été utilisées, on recommence le cycle
  const finalPool = availableImages.length > 0 ? availableImages : pool;
  
  // Sélection aléatoire pour plus de variété
  const randomIndex = Math.floor(Math.random() * finalPool.length);
  
  console.log(`🎨 Image sélectionnée: ${randomIndex + 1}/${finalPool.length} disponibles`);
  
  return finalPool[randomIndex];
}

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
  const titleMatches = content.matchAll(/title: ['\"](.+?)['\"]/g);
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
  const idMatches = content.matchAll(/id: ['\"](\\d+)['\"]/g);
  const ids = Array.from(idMatches).map(m => parseInt(m[1]));
  
  return ids.length > 0 ? Math.max(...ids) + 1 : 1;
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
  
  const titleMatch = content.match(/^#\\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Article sans titre';
  
  console.log(`✅ Titre: "${title}"`);
  
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const paragraphs = content.split('\n\n').filter(p => !p.startsWith('#'));
  const excerpt = paragraphs[0]?.substring(0, 200).replace(/['\"]/g, '') || `Article sur ${TOPIC}`;
  
  return { title, slug, excerpt, content };
}

// Créer/mettre à jour le fichier TypeScript
async function updateArticlesFile(article) {
  const articlesFile = path.join(process.cwd(), 'src/data/articles-generated.ts');
  const nextId = getNextId();
  const today = new Date().toISOString().split('T')[0];
  
  // NOUVELLE LOGIQUE: Rotation d'images uniques
  const image = selectUniqueImage(CATEGORY);
  
  // Échapper le contenu pour TypeScript
  const contentEscaped = article.content
    .replace(/\\\\/g, '\\\\\\\\')
    .replace(/`/g, '\\\\`')
    .replace(/\\$/g, '\\\\$');
  
  const titleEscaped = article.title.replace(/'/g, "\\\\'");
  const excerptEscaped = article.excerpt.replace(/'/g, "\\\\'");
  
  const newArticle = `  {
    id: '${nextId}',
    slug: '${article.slug}',
    title: '${titleEscaped}',
    excerpt: '${excerptEscaped}',
    content: \\`${contentEscaped}\\`,
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
 * Migré depuis MDX le 2025-12-14
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
    console.log('🚀 Génération article TypeScript avec rotation d\'images\n');
    
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
