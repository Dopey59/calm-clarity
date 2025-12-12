#!/usr/bin/env node

/**
 * Script de génération automatique du sitemap.xml
 * Inclut TOUS les articles depuis le fichier articles.ts
 * Usage: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://calmeclair.com';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');
const ARTICLES_PATH = path.join(__dirname, '../src/data/articles.ts');

// Catégories du site
const categories = [
  { slug: 'anxiete', priority: 0.9 },
  { slug: 'stress', priority: 0.9 },
  { slug: 'depression', priority: 0.8 },
  { slug: 'burn-out', priority: 0.8 },
  { slug: 'troubles-sommeil', priority: 0.8 },
  { slug: 'confiance-estime', priority: 0.8 },
];

// Pages du site
const pages = [
  { slug: 'a-propos', priority: 0.5 },
  { slug: 'contact', priority: 0.5 },
  { slug: 'mentions-legales', priority: 0.3 },
  { slug: 'confidentialite', priority: 0.3 },
  { slug: 'dmca', priority: 0.3 },
];

/**
 * Extrait les articles depuis le fichier articles.ts
 */
function extractArticles() {
  try {
    const content = fs.readFileSync(ARTICLES_PATH, 'utf8');
    
    // Regex pour extraire les articles
    const articles = [];
    const articleRegex = /\{\s*id:\s*['"](\d+)['"]\s*,\s*slug:\s*['"]([^'"]+)['"]\s*,[^}]*datePublished:\s*['"]([^'"]+)['"]\s*,[^}]*featured:\s*(true|false)?/g;
    
    let match;
    while ((match = articleRegex.exec(content)) !== null) {
      const [, id, slug, datePublished, featured] = match;
      articles.push({
        id,
        slug,
        datePublished,
        featured: featured === 'true'
      });
    }
    
    console.log(`✅ ${articles.length} articles extraits`);
    return articles;
  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction des articles:', error);
    return [];
  }
}

/**
 * Génère une entrée URL pour le sitemap
 */
function generateUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Formate une date au format ISO (YYYY-MM-DD)
 */
function formatDate(date) {
  if (!date) date = new Date();
  if (typeof date === 'string') date = new Date(date);
  return date.toISOString().split('T')[0];
}

/**
 * Génère le sitemap complet
 */
function generateSitemap() {
  const now = formatDate();
  let urls = [];

  // Page d'accueil
  urls.push(generateUrlEntry(
    `${SITE_URL}/`,
    now,
    'daily',
    '1.0'
  ));

  // Pages catégories
  categories.forEach(cat => {
    urls.push(generateUrlEntry(
      `${SITE_URL}/categorie/${cat.slug}`,
      now,
      'weekly',
      cat.priority
    ));
  });

  // Articles dynamiques
  const articles = extractArticles();
  articles.forEach(article => {
    const date = new Date(article.datePublished);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Articles featured ont une priorité plus élevée
    const priority = article.featured ? '0.9' : '0.8';
    
    urls.push(generateUrlEntry(
      `${SITE_URL}/article/${year}/${month}/${article.slug}`,
      formatDate(article.datePublished),
      'monthly',
      priority
    ));
  });

  // Pages du site
  pages.forEach(page => {
    urls.push(generateUrlEntry(
      `${SITE_URL}/${page.slug}`,
      now,
      'yearly',
      page.priority
    ));
  });

  // Génération du XML final
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

${urls.join('\n\n')}

</urlset>`;

  return xml;
}

/**
 * Écrit le sitemap dans le fichier
 */
function writeSitemap() {
  try {
    const sitemap = generateSitemap();
    
    // Créer le dossier public s'il n'existe pas
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
    
    // Compter le nombre d'URLs
    const urlCount = (sitemap.match(/<url>/g) || []).length;
    
    console.log('✅ Sitemap généré avec succès:', OUTPUT_PATH);
    console.log(`📍 ${SITE_URL}/sitemap.xml`);
    console.log(`📊 ${urlCount} URLs indexées`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
    process.exit(1);
  }
}

// Exécution
writeSitemap();
