#!/usr/bin/env node

/**
 * Génération automatique d'articles au format MDX
 * Adapté pour la nouvelle architecture
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Configuration
const CATEGORY = process.env.CATEGORY || 'stress';
const TOPIC = process.env.TOPIC || 'stress';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
      return `https://images.unsplash.com/${photo.id}?w=1200&h=630&fit=crop`;
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
  
  const prompt = `Tu es un expert en rédaction d'articles sur la santé mentale pour CalmeClair.

Rédige un article original, détaillé et scientifiquement fondé sur un sujet lié à "${TOPIC}".

Critères obligatoires:
- Titre accrocheur et SEO-friendly
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
  
  // Créer le slug
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Extraire l'excerpt
  const paragraphs = content.split('\n\n').filter(p => !p.startsWith('#'));
  const excerpt = paragraphs[0]?.substring(0, 200) || 'Article sur ' + TOPIC;
  
  return {
    title,
    slug,
    excerpt,
    content,
  };
}

// Créer le fichier MDX
async function createMDXFile(article) {
  // Rechercher une image pertinente
  const imageQuery = `${TOPIC} mental health wellness calm`;
  const image = await searchUnsplashImage(imageQuery);
  
  // Générer l'ID unique
  const categoryDir = path.join('content/articles', CATEGORY);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  const allFiles = fs.readdirSync(categoryDir);
  const nextId = allFiles.length + 1;
  
  // Générer les métadonnées
  const today = new Date().toISOString().split('T')[0];
  
  const frontmatter = `---
id: "${nextId}"
slug: "${article.slug}"
title: "${article.title}"
excerpt: "${article.excerpt}"
category: "${CATEGORY}"
categoryLabel: "${CATEGORY === 'anxiete' ? 'Anxiété' : 'Stress'}"
tags: ["${TOPIC}", "bien-être", "santé mentale"]
image: "${image}"
imageAlt: "Illustration pour l'article : ${article.title}"
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
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  }
}

main();
