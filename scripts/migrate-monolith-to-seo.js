#!/usr/bin/env node

/**
 * Migration du fichier monolithique vers structure SEO
 * Divise articles-generated.ts en fichiers individuels
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 MIGRATION ARTICLES → STRUCTURE SEO\n');

async function migrate() {
  const oldFile = path.join(process.cwd(), 'src/data/articles-generated.ts');
  const newDir = path.join(process.cwd(), 'src/content/articles');
  
  // Vérifier que le fichier source existe
  if (!fs.existsSync(oldFile)) {
    console.log('⚠️  Fichier source introuvable - migration déjà effectuée ?');
    return;
  }
  
  const content = fs.readFileSync(oldFile, 'utf8');
  console.log('✓ Fichier source lu\n');
  
  // Parser les articles
  const articlesMatch = content.match(/export const generatedArticles: Article\[\] = \[([\s\S]*?)\];/);
  if (!articlesMatch) {
    console.error('❌ Format du fichier invalide');
    process.exit(1);
  }
  
  // Extraire les blocs individuels
  const articlesText = articlesMatch[1];
  const articleBlocks = [];
  let currentBlock = '';
  let braceCount = 0;
  let inArticle = false;
  
  for (let i = 0; i < articlesText.length; i++) {
    const char = articlesText[i];
    
    if (char === '{') {
      if (!inArticle) {
        inArticle = true;
        currentBlock = '{';
      } else {
        currentBlock += char;
      }
      braceCount++;
    } else if (char === '}') {
      currentBlock += char;
      braceCount--;
      
      if (braceCount === 0 && inArticle) {
        articleBlocks.push(currentBlock.trim());
        currentBlock = '';
        inArticle = false;
      }
    } else if (inArticle) {
      currentBlock += char;
    }
  }
  
  console.log(`✓ ${articleBlocks.length} articles extraits\n`);
  
  // Créer les fichiers individuels
  const stats = { anxiete: 0, stress: 0 };
  
  console.log('📝 Création des fichiers individuels:\n');
  
  articleBlocks.forEach((block, index) => {
    const slugMatch = block.match(/slug: ['\"](.+?)['\"]/);\n    const categoryMatch = block.match(/category: ['\"](.+?)['\"]/);\n    \n    if (!slugMatch) {\n      console.warn(`⚠️  Article ${index + 1}: pas de slug, ignoré`);\n      return;\n    }\n    \n    const slug = slugMatch[1];\n    const category = categoryMatch ? categoryMatch[1] : 'anxiete';\n    \n    // Créer le dossier de catégorie si nécessaire\n    const categoryDir = path.join(newDir, category);\n    if (!fs.existsSync(categoryDir)) {\n      fs.mkdirSync(categoryDir, { recursive: true });\n    }\n    \n    // Créer le fichier\n    const filepath = path.join(categoryDir, `${slug}.ts`);\n    const fileContent = `import { Article } from '@/types/Article';\n\n/**\n * Article: ${slug}\n */\n\nexport const article: Article = ${block};\n`;\n    \n    fs.writeFileSync(filepath, fileContent, 'utf8');\n    stats[category]++;\n    console.log(`  ✓ ${category}/${slug}.ts`);\n  });\n  \n  console.log(`\n✅ Migration terminée:`);\n  console.log(`   - Anxiété: ${stats.anxiete} articles`);\n  console.log(`   - Stress: ${stats.stress} articles`);\n  console.log(`   - Total: ${stats.anxiete + stats.stress} fichiers créés`);\n  \n  // Renommer l'ancien fichier en backup\n  const backupFile = oldFile + '.migrated';\n  fs.renameSync(oldFile, backupFile);\n  console.log(`\n💾 Ancien fichier sauvegardé: ${backupFile}`);\n}\n\nmigrate().catch(err => {\n  console.error('❌ Erreur:', err);\n  process.exit(1);\n});\n