#!/usr/bin/env node

/**
 * Script de migration : articles.ts → fichiers MDX individuels
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'content/articles';

// Créer les dossiers
function createDirectories() {
  const dirs = [
    OUTPUT_DIR,
    path.join(OUTPUT_DIR, 'anxiete'),
    path.join(OUTPUT_DIR, 'stress'),
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Dossier créé: ${dir}`);
    }
  });
}

// Convertir un article en MDX
function articleToMDX(article) {
  const frontmatter = `---
id: "${article.id}"
slug: "${article.slug}"
title: "${article.title}"
excerpt: "${article.excerpt}"
category: "${article.category}"
categoryLabel: "${article.categoryLabel}"
tags: [${article.tags.map(t => `"${t}"`).join(', ')}]
image: "${article.image}"
imageAlt: "${article.imageAlt}"
datePublished: "${article.datePublished}"
dateModified: "${article.dateModified}"
readingTime: ${article.readingTime}
featured: ${article.featured || false}
---

${article.content}
`;
  
  return frontmatter;
}

// Sauvegarder un article en MDX
function saveArticle(article) {
  const mdxContent = articleToMDX(article);
  const filename = `${article.slug}.mdx`;
  const filepath = path.join(OUTPUT_DIR, article.category, filename);
  
  fs.writeFileSync(filepath, mdxContent, 'utf8');
  
  console.log(`✅ ${article.category}/${filename}`);
}

// Générer l'index JSON
function generateIndex(articles) {
  const index = articles.map(article => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    categoryLabel: article.categoryLabel,
    tags: article.tags,
    image: article.image,
    imageAlt: article.imageAlt,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    readingTime: article.readingTime,
    featured: article.featured,
  }));
  
  const indexPath = path.join(OUTPUT_DIR, '_index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
  
  console.log(`\n✅ Index généré: ${indexPath}`);
}

// Migration - les articles seront injectés par le workflow
async function migrate(articles) {
  console.log('🚀 Migration vers architecture MDX\n');
  
  try {
    createDirectories();
    console.log('');
    
    console.log('📝 Conversion en MDX...\n');
    articles.forEach(article => saveArticle(article));
    
    generateIndex(articles);
    
    console.log('');
    console.log('🎉 Migration terminée !');
    console.log(`   ${articles.length} articles migrés`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

module.exports = { migrate, createDirectories, saveArticle, generateIndex };

// Si exécuté directement
if (require.main === module) {
  console.log('Ce script doit être utilisé avec les données d\'articles');
  console.log('Voir le workflow GitHub Actions pour l\'exécution automatique');
}
