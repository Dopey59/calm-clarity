#!/usr/bin/env node

/**
 * Génération automatique d'articles au format MDX
 * VERSION CORRIGÉE avec IDs uniques basés sur MAX + 1
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CATEGORY = process.env.CATEGORY || 'stress';
const TOPIC = process.env.TOPIC || 'stress';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Trouver le prochain ID unique (MAX + 1)
 * CORRECTION: Au lieu de compter les fichiers, on trouve le MAX des IDs existants
 */
function getNextId() {
  const categories = ['anxiete', 'stress'];
  let maxId = 0;
  
  categories.forEach(category => {
    const categoryPath = path.join(process.cwd(), 'content/articles', category);
    if (!fs.existsSync(categoryPath)) return;
    
    const files = fs.readdirSync(categoryPath);
    files.forEach(file => {
      if (!file.endsWith('.mdx')) return;
      
      const filePath = path.join(categoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      try {
        const { data } = matter(fileContent);
        const id = parseInt(data.id);
        if (!isNaN(id) && id > maxId) {
          maxId = id;
        }
      } catch (error) {
        // Ignorer les fichiers mal formés
      }
    });
  });
  
  return maxId + 1;
}

/**
 * Lister tous les sujets déjà traités
 */
function getExistingTopics() {
  const topics = [];
  const categories = ['anxiete', 'stress'];
  
  categories.forEach(category => {
    const categoryPath = path.join(process.cwd(), 'content/articles', category);
    
    if (!fs.existsSync(categoryPath)) return;
    
    const files = fs.readdirSync(categoryPath);
    
    files.forEach(file => {
      if (!file.endsWith('.mdx')) return;
      
      const filePath = path.join(categoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      try {
        const { data } = matter(fileContent);
        if (data.title) {
          topics.push(data.title.toLowerCase());
        }
      } catch (error) {
        // Ignorer les fichiers mal formés
      }
    });
  });
  
  return topics;
}

// Rechercher une image Unsplash
async function searchUnsplashImage(query) {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('⚠️  UNSPLASH_ACCESS_KEY manquant, utilisation image par défaut');
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop';
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      return `https://images.unsplash.com/photo-${photo.id}?w=1200&h=630&fit=crop`;
    }
    
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop';
  } catch (error) {
    console.error('Erreur recherche Unsplash:', error);
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop';
  }
}

// Générer l'article via Claude
async function generateArticle() {
  console.log(`📝 Génération d'un article sur: ${TOPIC}`);
  
  // Récupérer les sujets déjà traités
  const existingTopics = getExistingTopics();
  console.log(`\n🔍 ${existingTopics.length} articles existants détectés`);
  
  const existingTopicsList = existingTopics.map(t => `- ${t}`).join('\n');
  
  const prompt = `Tu es un expert en rédaction d'articles sur la santé mentale pour CalmeClair.

Rédige un article original, détaillé et scientifiquement fondé sur un sujet lié à "${TOPIC}".

RÈGLE ABSOLUE - ANTI-DUPLICATION :
Les sujets suivants ont DÉJÀ été traités. Tu DOIS choisir un sujet TOTALEMENT DIFFÉRENT :

${existingTopicsList}

Tu DOIS impérativement :
1. Éviter COMPLÈTEMENT ces sujets déjà traités
2. Choisir un angle nouveau et original
3. Traiter un aspect spécifique non couvert

Critères obligatoires:
- Titre accrocheur et SEO-friendly (UNIQUE, jamais traité)
- Introduction empathique
- Contenu structuré avec H2/H3
- Solutions pratiques et concrètes
- Section FAQ (5-8 questions)
- Conclusion encourageante
- Sources scientifiques citées

L'article doit faire environ 2000-2500 mots et suivre les standards YMYL de Google.

IMPORTANT: Génère UNIQUEMENT le contenu Markdown (titre, sections, paragraphes). Pas de frontmatter YAML.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const content = message.content[0].text;
  
  // Extraire le titre
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Article sans titre';
  
  // Vérifier la duplication du titre
  const titleLower = title.toLowerCase();
  const isDuplicate = existingTopics.some(existing => {
    const similarity = calculateSimilarity(titleLower, existing);
    return similarity > 0.6; // 60% de similarité = duplication
  });
  
  if (isDuplicate) {
    console.warn('⚠️  Titre trop similaire détecté, régénération...');
    throw new Error('DUPLICATE_TITLE');
  }
  
  console.log(`✅ Titre unique validé: "${title}"`);
  
  // Créer le slug
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Extraire l'excerpt (sans apostrophes problématiques)
  const paragraphs = content.split('\n\n').filter(p => !p.startsWith('#'));
  let excerpt = paragraphs[0]?.substring(0, 200) || `Article sur ${TOPIC}`;
  
  // Nettoyer l'excerpt pour YAML
  excerpt = excerpt
    .replace(/"/g, '') // Supprimer les guillemets doubles
    .replace(/'/g, '') // Supprimer les apostrophes
    .replace(/\n/g, ' ') // Supprimer les retours à la ligne
    .trim();
  
  return {
    title,
    slug,
    excerpt,
    content,
  };
}

/**
 * Calculer la similarité entre deux chaînes (Levenshtein simplifié)
 */
function calculateSimilarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshtein(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshtein(s1, s2) {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// Créer le fichier MDX
async function createMDXFile(article) {
  // Rechercher une image pertinente
  const imageQuery = `${TOPIC} mental health wellness calm`;
  const image = await searchUnsplashImage(imageQuery);
  
  // Générer l'ID unique BASÉ SUR LE MAX
  const nextId = getNextId();
  console.log(`🔢 Nouvel ID unique: ${nextId}`);
  
  // Créer le dossier si nécessaire
  const categoryDir = path.join(process.cwd(), 'content/articles', CATEGORY);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  // Générer les métadonnées
  const today = new Date().toISOString().split('T')[0];
  
  // IMPORTANT: Nettoyer le titre pour YAML (enlever apostrophes et guillemets)
  const titleClean = article.title.replace(/'/g, '').replace(/"/g, '');
  const excerptClean = article.excerpt.replace(/'/g, '').replace(/"/g, '');
  
  const frontmatter = `---
id: "${nextId}"
slug: "${article.slug}"
title: "${titleClean}"
excerpt: "${excerptClean}"
category: "${CATEGORY}"
categoryLabel: "${CATEGORY === 'anxiete' ? 'Anxiété' : 'Stress'}"
tags: ["${TOPIC}", "bien-être", "santé mentale"]
image: "${image}"
imageAlt: "Illustration pour article : ${titleClean}"
datePublished: "${today}"
dateModified: "${today}"
readingTime: 10
featured: true
---

${article.content}
`;

  // Sauvegarder le fichier
  const filename = `${article.slug}.mdx`;
  const filepath = path.join(categoryDir, filename);
  
  fs.writeFileSync(filepath, frontmatter, 'utf8');
  
  console.log(`✅ Article sauvegardé: ${filepath}`);
  
  return {
    filepath,
    filename,
  };
}

// Exécution principale
async function main() {
  try {
    console.log('🚀 Démarrage génération article MDX\n');
    
    // Générer l'article
    const article = await generateArticle();
    console.log(`\n📄 Article généré: "${article.title}"`);
    console.log(`   Slug: ${article.slug}`);
    
    // Créer le fichier MDX
    const result = await createMDXFile(article);
    
    console.log('\n🎉 Génération terminée avec succès !');
    console.log(`   Fichier: ${result.filename}`);
    
  } catch (error) {
    if (error.message === 'DUPLICATE_TITLE') {
      console.error('\n❌ Titre dupliqué détecté. Veuillez relancer le workflow.');
      process.exit(1);
    }
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  }
}

main();
