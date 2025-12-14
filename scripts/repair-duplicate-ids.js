#!/usr/bin/env node

/**
 * Script de réparation des IDs dupliqués
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function repairDuplicateIds() {
  console.log('🔧 Réparation des IDs dupliqués\n');
  
  const categories = ['anxiete', 'stress'];
  const articlesById = new Map();
  const duplicates = new Map();
  
  // Scanner tous les articles
  categories.forEach(category => {
    const categoryPath = path.join(process.cwd(), 'content/articles', category);
    if (!fs.existsSync(categoryPath)) return;
    
    const files = fs.readdirSync(categoryPath);
    
    files.forEach(file => {
      if (!file.endsWith('.mdx')) return;
      
      const filePath = path.join(categoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      try {
        const { data, content } = matter(fileContent);
        const id = data.id;
        
        if (!articlesById.has(id)) {
          articlesById.set(id, []);
        }
        
        articlesById.get(id).push({
          path: filePath,
          file,
          data,
          content
        });
      } catch (error) {
        console.error(`❌ Erreur parsing ${file}:`, error.message);
      }
    });
  });
  
  // Identifier les doublons
  let maxId = 0;
  articlesById.forEach((articles, id) => {
    const numId = parseInt(id);
    if (!isNaN(numId) && numId > maxId) {
      maxId = numId;
    }
    
    if (articles.length > 1) {
      console.log(`⚠️  ID "${id}" utilisé par ${articles.length} articles:`);
      articles.forEach(a => console.log(`   - ${a.file}`));
      duplicates.set(id, articles);
    }
  });
  
  if (duplicates.size === 0) {
    console.log('✅ Aucun doublon détecté!');
    return;
  }
  
  console.log(`\n🔢 ID maximum actuel: ${maxId}\n`);
  
  // Réattribuer des IDs uniques
  let nextId = maxId + 1;
  let fixed = 0;
  
  duplicates.forEach((articles, oldId) => {
    // Garder le premier article avec son ID actuel
    const [first, ...rest] = articles;
    console.log(`✅ ID "${oldId}" conservé pour: ${first.file}`);
    
    // Réattribuer de nouveaux IDs aux autres
    rest.forEach(article => {
      const newId = nextId++;
      console.log(`🔄 ID "${oldId}" → "${newId}" pour: ${article.file}`);
      
      // Mettre à jour le frontmatter
      article.data.id = String(newId);
      
      const newFrontmatter = matter.stringify(article.content, article.data);
      fs.writeFileSync(article.path, newFrontmatter, 'utf8');
      
      fixed++;
    });
  });
  
  console.log(`\n✅ ${fixed} articles réparés!`);
  console.log('🔄 Exécutez maintenant: npm run build-index');
}

try {
  repairDuplicateIds();
} catch (error) {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
}
