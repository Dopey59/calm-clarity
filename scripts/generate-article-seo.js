#!/usr/bin/env node

/**
 * Génération d'articles - Architecture SEO-optimale
 * 
 * Crée automatiquement :
 * - 1 fichier par article
 * - Dans le bon dossier de catégorie
 * - Nom de fichier = slug
 * - Rotation d'images uniques
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

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POOL D'IMAGES PAR CATÉGORIE
 */
const IMAGE_POOLS = {
  anxiete: [
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=630&fit=crop',
  ],
  stress: [
    'https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&h=630&fit=crop',
  ]
};

/**
 * Scanner tous les articles existants
 */
function scanAllArticles() {
  const articlesDir = path.join(process.cwd(), 'src/content/articles');
  const categories = ['anxiete', 'stress'];
  
  const titles = [];
  const images = [];
  const slugs = [];
  let maxId = 0;
  
  categories.forEach(category => {
    const categoryDir = path.join(articlesDir, category);
    
    if (!fs.existsSync(categoryDir)) {
      return;
    }
    
    const files = fs.readdirSync(categoryDir)
      .filter(f => f.endsWith('.ts') && f !== 'index.ts');
    
    files.forEach(file => {
      const content = fs.readFileSync(path.join(categoryDir, file), 'utf8');
      
      // Extraire slug depuis le nom de fichier
      slugs.push(file.replace('.ts', ''));
      
      // Extraire titre
      const titleMatch = content.match(/title: ['\"](.+?)['\"]/);
      if (titleMatch) {
        titles.push(titleMatch[1].toLowerCase());
      }
      
      // Extraire image
      const imageMatch = content.match(/image: ['\"](.+?)['\"]/);
      if (imageMatch) {
        images.push(imageMatch[1]);
      }
      
      // Extraire ID
      const idMatch = content.match(/id: ['\"](\d+)['\"]/);
      if (idMatch) {
        maxId = Math.max(maxId, parseInt(idMatch[1]));
      }
    });
  });
  
  return { titles, images, slugs, nextId: maxId + 1 };
}

/**
 * Sélectionner une image unique
 */
function selectUniqueImage(category, usedImages) {
  const pool = IMAGE_POOLS[category] || IMAGE_POOLS.anxiete;
  const availableImages = pool.filter(img => !usedImages.includes(img));
  const finalPool = availableImages.length > 0 ? availableImages : pool;
  const randomIndex = Math.floor(Math.random() * finalPool.length);
  
  console.log(`🎨 Image: ${randomIndex + 1}/${finalPool.length} disponibles`);
  
  return finalPool[randomIndex];
}

/**
 * Générer l'article via Claude
 */
async function generateArticle(existingTitles) {
  console.log(`📝 Génération article: ${TOPIC}`);
  console.log(`🔍 ${existingTitles.length} articles existants\n`);
  
  const existingList = existingTitles.slice(0, 50).map(t => `- ${t}`).join('\n');
  
  const prompt = `Tu es un expert en rédaction d'articles sur la santé mentale pour CalmeClair.

Rédige un article original sur "${TOPIC}".

SUJETS DÉJÀ TRAITÉS (à éviter, liste partielle) :
${existingList}

Critères :
- Titre accrocheur et SEO-friendly (UNIQUE)
- 2000-2500 mots
- Structure avec H2/H3
- Solutions pratiques
- Section FAQ (5-8 questions)
- Sources scientifiques françaises

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
  
  // Générer le slug
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const paragraphs = content.split('\n\n').filter(p => !p.startsWith('#'));
  const excerpt = paragraphs[0]?.substring(0, 200).replace(/['\"\"]/g, '') || `Article sur ${TOPIC}`;
  
  return { title, slug, excerpt, content };
}

/**
 * Créer le fichier de l'article
 */
function createArticleFile(article, nextId, image, existingSlugs) {
  const articlesDir = path.join(process.cwd(), 'src/content/articles');
  const categoryDir = path.join(articlesDir, CATEGORY);
  const today = new Date().toISOString().split('T')[0];
  
  // Vérifier que le dossier existe
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
    console.log(`📁 Dossier créé: ${categoryDir}`);
  }
  
  // Gérer les slugs en double
  let finalSlug = article.slug;
  let counter = 1;
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${article.slug}-${counter}`;
    counter++;
  }
  
  if (finalSlug !== article.slug) {
    console.log(`⚠️  Slug dupliqué, renommé: ${finalSlug}`);
  }
  
  // Chemin du fichier
  const filename = `${finalSlug}.ts`;
  const filepath = path.join(categoryDir, filename);
  
  // Échapper le contenu
  const contentEscaped = article.content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  
  const titleEscaped = article.title.replace(/'/g, "\\'");
  const excerptEscaped = article.excerpt.replace(/'/g, "\\'");
  
  // Contenu du fichier
  const fileContent = `import { Article } from '@/types/Article';

/**
 * ${article.title}
 * Catégorie: ${CATEGORY}
 * Généré le: ${today}
 */

export const article: Article = {
  id: '${nextId}',
  slug: '${finalSlug}',
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
};
`;
  
  // Écrire le fichier
  fs.writeFileSync(filepath, fileContent, 'utf8');
  
  console.log(`✅ Fichier créé: ${CATEGORY}/${filename}`);
  console.log(`   ID: ${nextId}`);
  console.log(`   Slug: ${finalSlug}`);
  
  return { filepath, finalSlug };
}

/**
 * Main
 */
async function main() {
  try {
    console.log('🚀 GÉNÉRATION ARTICLE (Architecture SEO)\n');
    
    // 1. Scanner les articles existants
    console.log('📊 Scan des articles existants...');
    const { titles, images, slugs, nextId } = scanAllArticles();
    console.log(`   - ${titles.length} articles trouvés`);
    console.log(`   - Prochain ID: ${nextId}\n`);
    
    // 2. Générer l'article
    const article = await generateArticle(titles);
    
    // 3. Sélectionner une image unique
    const image = selectUniqueImage(CATEGORY, images);
    
    // 4. Créer le fichier
    const { filepath, finalSlug } = createArticleFile(article, nextId, image, slugs);
    
    console.log('\n🎉 ARTICLE GÉNÉRÉ AVEC SUCCÈS !');
    console.log(`\n📄 Fichier: ${filepath}`);
    console.log(`🔗 URL: /articles/${CATEGORY}/${finalSlug}`);
    console.log('\n✨ Aucune action supplémentaire requise !');
    console.log('   L\'index détecte automatiquement le nouveau fichier.');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
