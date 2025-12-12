#!/usr/bin/env node

/**
 * Script de génération automatique d'articles via l'API Claude
 * Usage: ANTHROPIC_API_KEY=sk-... node scripts/generate-article.js
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ARTICLES_PATH = path.join(__dirname, '../src/data/articles.ts');
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY manquant dans les variables d\'environnement');
  process.exit(1);
}

const anthropic = new Anthropic({
  apiKey: API_KEY,
});

// Sujets d'articles à rotation (pool de 50+ sujets)
const ARTICLE_TOPICS = [
  "Comment reconnaître et gérer une attaque de panique",
  "Techniques de méditation pour débutants anxieux",
  "L'impact du sommeil sur l'anxiété",
  "Alimentation anti-stress : ce que dit la science",
  "Différence entre anxiété normale et trouble anxieux",
  "Exercices de respiration pour calmer le stress au travail",
  "Comment gérer l'anxiété sociale au quotidien",
  "Le lien entre perfectionnisme et anxiété",
  "Anxiété nocturne : pourquoi et comment la gérer",
  "Cohérence cardiaque : guide pratique",
  "Comment aider un proche anxieux",
  "Burn-out : les signes précurseurs à ne pas ignorer",
  "L'anxiété chez les adolescents",
  "Compléments alimentaires et stress : que dit la recherche",
  "Sport et anxiété : quel exercice choisir",
  "Journaling pour gérer ses émotions",
  "Anxiété de performance : stratégies efficaces",
  "Comment gérer le stress des examens",
  "Pleine conscience au quotidien",
  "L'anxiété anticipatoire : comprendre et surmonter",
];

/**
 * Prompt optimisé pour générer des articles de qualité
 */
const ARTICLE_GENERATION_PROMPT = `Tu es un expert en rédaction de contenu sur la santé mentale pour CalmeClair, une plateforme française de bien-être mental.

CONTRAINTES STRICTES :
1. Ton article DOIT être en français formel (vouvoiement)
2. Ton article DOIT contenir entre 2500-3500 mots
3. Ton article DOIT être basé sur des sources scientifiques vérifiables
4. Tu DOIS utiliser le web search pour vérifier TOUTES tes affirmations factuelles
5. Ton article DOIT inclure une section "Questions fréquentes" avec 5 questions minimum

STRUCTURE OBLIGATOIRE :
## Introduction (engageante et empathique)
## Comprendre [le sujet]
## Les causes / mécanismes
## Symptômes ou manifestations
## Solutions pratiques (avec étapes concrètes)
## Quand consulter un professionnel
## Questions fréquentes
## Sources et références

STYLE :
- Ton bienveillant et rassurant
- Exemples concrets
- Pas de jargon médical sans explication
- Tableaux comparatifs si pertinent
- Listes à puces pour les conseils pratiques

IMPORTANT - SOURCES :
- Privilégier : Inserm, Santé publique France, OMS, HAS, études peer-reviewed
- Éviter : blogs personnels, forums, sites commerciaux
- TOUJOURS vérifier avec web_search avant d'affirmer des statistiques

Génère un article complet sur : "{TOPIC}"

Format de réponse attendu en JSON :
{
  "title": "Titre optimisé SEO (60-70 caractères)",
  "excerpt": "Description engageante (150-160 caractères)",
  "content": "Contenu complet en Markdown",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "anxiete" ou "stress",
  "readingTime": 8
}`;

/**
 * Génère un nouvel article via l'API Claude
 */
async function generateArticle(topic) {
  console.log(`🤖 Génération de l'article : "${topic}"`);
  
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      temperature: 1,
      messages: [
        {
          role: 'user',
          content: ARTICLE_GENERATION_PROMPT.replace('{TOPIC}', topic)
        }
      ],
    });

    const content = message.content[0].text;
    
    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Impossible d\'extraire le JSON de la réponse');
    }
    
    const articleData = JSON.parse(jsonMatch[0]);
    
    console.log(`✅ Article généré : "${articleData.title}"`);
    return articleData;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération de l\'article:', error);
    throw error;
  }
}

/**
 * Génère un slug SEO-friendly depuis un titre
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garder uniquement lettres, chiffres, espaces, tirets
    .trim()
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/-+/g, '-'); // Éviter les tirets multiples
}

/**
 * Ajoute un article au fichier articles.ts
 */
function addArticleToFile(articleData) {
  const content = fs.readFileSync(ARTICLES_PATH, 'utf8');
  
  // Générer le nouvel ID
  const lastIdMatch = content.match(/id: '(\d+)'/g);
  const ids = lastIdMatch ? lastIdMatch.map(m => parseInt(m.match(/\d+/)[0])) : [0];
  const newId = Math.max(...ids) + 1;
  
  // Générer le slug
  const slug = generateSlug(articleData.title);
  
  // Date du jour
  const today = new Date().toISOString().split('T')[0];
  
  // Image par défaut (à personnaliser)
  const imageUrl = `https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop`;
  
  // Construire le nouvel article
  const newArticle = `{
  id: '${newId}',
  slug: '${slug}',
  title: '${articleData.title.replace(/'/g, "\\'")}',
  excerpt: '${articleData.excerpt.replace(/'/g, "\\'")}',
  content: \`
${articleData.content}
  \`,
  category: '${articleData.category}',
  categoryLabel: '${articleData.category === 'anxiete' ? 'Anxiété' : 'Stress'}',
  tags: ${JSON.stringify(articleData.tags)},
  image: '${imageUrl}',
  imageAlt: 'Illustration de l\\'article : ${articleData.title.replace(/'/g, "\\'")}',
  datePublished: '${today}',
  dateModified: '${today}',
  readingTime: ${articleData.readingTime || 8},
  featured: true
},`;

  // Insérer le nouvel article après "export const articles: Article[] = ["
  const insertPosition = content.indexOf('export const articles: Article[] = [') + 'export const articles: Article[] = ['.length;
  const updatedContent = 
    content.slice(0, insertPosition) + 
    '\n  ' + newArticle + 
    content.slice(insertPosition);
  
  fs.writeFileSync(ARTICLES_PATH, updatedContent, 'utf8');
  
  console.log(`✅ Article ajouté au fichier : ID ${newId}, Slug: ${slug}`);
  return { id: newId, slug };
}

/**
 * Fonction principale
 */
async function main() {
  try {
    // Choisir un sujet aléatoire
    const topic = ARTICLE_TOPICS[Math.floor(Math.random() * ARTICLE_TOPICS.length)];
    
    console.log('🚀 Démarrage de la génération d\'article automatique\n');
    
    // Générer l'article
    const articleData = await generateArticle(topic);
    
    // Ajouter au fichier
    const { id, slug } = addArticleToFile(articleData);
    
    console.log('\n✅ ✅ ✅ SUCCÈS ! ✅ ✅ ✅');
    console.log(`📝 Nouvel article créé :`);
    console.log(`   - ID: ${id}`);
    console.log(`   - Titre: ${articleData.title}`);
    console.log(`   - Slug: ${slug}`);
    console.log(`   - URL: https://calmeclair.com/article/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${slug}`);
    
  } catch (error) {
    console.error('\n❌ Échec de la génération:', error);
    process.exit(1);
  }
}

// Exécution
main();
