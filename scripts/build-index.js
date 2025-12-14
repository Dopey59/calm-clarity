#!/usr/bin/env node

/**
 * Script de génération de l'index JSON des articles
 * VERSION PRODUCTION - Copie dans public/ pour accessibilité
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');
const INDEX_PATH_CONTENT = path.join(process.cwd(), 'content/_index.json');
const INDEX_PATH_PUBLIC = path.join(process.cwd(), 'public/_index.json');

/**
 * Scanner tous les fichiers MDX
 */
function scanArticles() {
  const articles = [];
  const categories = ['anxiete', 'stress'];
  
  categories.forEach(category => {
    const categoryPath = path.join(ARTICLES_DIR, category);
    
    if (!fs.existsSync(categoryPath)) {
      console.warn(`⚠️  Dossier manquant: ${categoryPath}`);
      return;
    }
    
    const files = fs.readdirSync(categoryPath);
    
    files.forEach(file => {
      if (!file.endsWith('.mdx')) return;
      
      const filePath = path.join(categoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      try {
        const { data } = matter(fileContent);
        
        // Validation des champs obligatoires
        if (!data.id || !data.slug || !data.title) {
          console.warn(`⚠️  Métadonnées incomplètes dans: ${file}`);
          return;
        }
        
        articles.push({
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          category: data.category,
          categoryLabel: data.categoryLabel,
          tags: data.tags || [],
          image: data.image,
          imageAlt: data.imageAlt,
          datePublished: data.datePublished,
          dateModified: data.dateModified,
          readingTime: data.readingTime,
          featured: data.featured || false,
        });
        
      } catch (error) {
        console.error(`❌ Erreur parsing ${file}:`, error.message);
      }
    });
  });
  
  return articles;
}

/**
 * Générer l'index
 */
function generateIndex() {
  console.log('🔍 Scan des articles MDX...\n');
  
  const articles = scanArticles();
  
  // Trier par date de publication (plus récent en premier)
  articles.sort((a, b) => 
    new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );
  
  const indexContent = JSON.stringify(articles, null, 2);
  
  // Sauvegarder dans content/ (pour git)
  fs.writeFileSync(INDEX_PATH_CONTENT, indexContent, 'utf8');
  console.log(`✅ Index sauvegardé: content/_index.json`);
  
  // Sauvegarder dans public/ (pour production)
  if (!fs.existsSync(path.dirname(INDEX_PATH_PUBLIC))) {
    fs.mkdirSync(path.dirname(INDEX_PATH_PUBLIC), { recursive: true });
  }
  fs.writeFileSync(INDEX_PATH_PUBLIC, indexContent, 'utf8');
  console.log(`✅ Index copié: public/_index.json (pour production)`);
  
  console.log('');
  console.log('📊 Statistiques:');
  console.log(`   Total articles: ${articles.length}`);
  console.log(`   Anxiété: ${articles.filter(a => a.category === 'anxiete').length}`);
  console.log(`   Stress: ${articles.filter(a => a.category === 'stress').length}`);
  console.log(`   En vedette: ${articles.filter(a => a.featured).length}`);
  console.log('');
  
  // Générer aussi des stats par tags
  const tagCounts = {};
  articles.forEach(article => {
    article.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  console.log('🏷️  Tags populaires:');
  Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([tag, count]) => {
      console.log(`   ${tag}: ${count}`);
    });
}

// Exécution
try {
  generateIndex();
} catch (error) {
  console.error('');
  console.error('❌ Erreur lors de la génération:');
  console.error(error);
  process.exit(1);
}
