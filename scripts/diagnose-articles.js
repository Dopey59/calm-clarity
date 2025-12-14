#!/usr/bin/env node

/**
 * Script de diagnostic - Identifie les articles sans contenu
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

console.log('🔍 Diagnostic des articles...\n');

const categories = ['anxiete', 'stress'];
const articlesWithoutContent = [];
const articlesWithContent = [];

categories.forEach(category => {
  const categoryPath = path.join(ARTICLES_DIR, category);
  
  if (!fs.existsSync(categoryPath)) return;
  
  const files = fs.readdirSync(categoryPath);
  
  files.forEach(file => {
    if (!file.endsWith('.mdx')) return;
    
    const filePath = path.join(categoryPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    try {
      const { data, content } = matter(fileContent);
      
      if (!content || content.trim().length === 0) {
        articlesWithoutContent.push({
          file,
          path: `content/articles/${category}/${file}`,
          size: fs.statSync(filePath).size
        });
      } else {
        articlesWithContent.push({
          file,
          contentLength: content.trim().length
        });
      }
      
    } catch (error) {
      articlesWithoutContent.push({
        file,
        path: `content/articles/${category}/${file}`,
        error: error.message
      });
    }
  });
});

console.log('✅ Articles AVEC contenu:');
articlesWithContent.forEach(a => {
  console.log(`   ${a.file} (${a.contentLength} caractères)`);
});

console.log('\n❌ Articles SANS contenu:');
if (articlesWithoutContent.length === 0) {
  console.log('   Aucun !');
} else {
  articlesWithoutContent.forEach(a => {
    console.log(`   ${a.file} (${a.size} bytes)`);
    if (a.error) console.log(`      Erreur: ${a.error}`);
  });
  
  console.log('\n🗑️  Fichiers à supprimer:');
  articlesWithoutContent.forEach(a => {
    console.log(`   git rm ${a.path}`);
  });
}

console.log(`\n📊 Total: ${articlesWithContent.length} OK, ${articlesWithoutContent.length} À SUPPRIMER`);
