#!/usr/bin/env node

/**
 * Script de génération automatique du sitemap.xml
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

// Import des articles depuis votre fichier de données
// Adaptez ce chemin selon votre structure
// import { articles } from '../src/data/articles.js';

// Catégories du site
const categories = [
  { slug: 'anxiete', priority: 0.9 },
  { slug: 'stress', priority: 0.9 },
  { slug: 'depression', priority: 0.9 },
  { slug: 'burn-out', priority: 0.9 },
  { slug: 'troubles-sommeil', priority: 0.9 },
  { slug: 'confiance-estime', priority: 0.9 },
];

// Pages légales
const legalPages = [
  { slug: 'mentions-legales', priority: 0.3 },
  { slug: 'politique-confidentialite', priority: 0.3 },
  { slug: 'cgu', priority: 0.3 },
];

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

  // Articles
  // Décommentez et adaptez cette section une fois que vous avez importé les articles
  /*
  articles.forEach(article => {
    const date = new Date(article.publishedAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    urls.push(generateUrlEntry(
      `${SITE_URL}/article/${year}/${month}/${article.slug}`,
      formatDate(date),
      'monthly',
      '0.8'
    ));
  });
  */

  // Pages légales
  legalPages.forEach(page => {
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
    console.log('✅ Sitemap généré avec succès:', OUTPUT_PATH);
    console.log(`📍 ${SITE_URL}/sitemap.xml`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
    process.exit(1);
  }
}

// Exécution
writeSitemap();