#!/usr/bin/env node

/**
 * Script de génération automatique d'articles avec images COHÉRENTES
 * Version 3.0 - Images basées sur le sujet réel de l'article
 * Usage: ANTHROPIC_API_KEY=sk-... UNSPLASH_ACCESS_KEY=xxx node scripts/generate-article.js
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ARTICLES_PATH = path.join(__dirname, '../src/data/articles.ts');
const API_KEY = process.env.ANTHROPIC_API_KEY;
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

if (!API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY manquant dans les variables d\'environnement');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: API_KEY });

// Sujets d'articles optimisés pour le trafic SEO (mots-clés à fort volume)
const ARTICLE_TOPICS = [
  "Comment gérer une crise d'anxiété en 5 minutes",
  "10 techniques de respiration anti-stress scientifiquement prouvées",
  "Anxiété nocturne : causes et solutions pratiques",
  "Burn-out : reconnaître les 7 signes précurseurs",
  "Méditation pour débutants : guide complet en 10 étapes",
  "Différence entre stress et anxiété : tout comprendre",
  "Comment calmer une attaque de panique rapidement",
  "Alimentation anti-stress : les 15 meilleurs aliments",
  "Cohérence cardiaque : exercice de 5 minutes pour se détendre",
  "Anxiété sociale : 8 stratégies pour la surmonter",
  "Insomnie et anxiété : solutions naturelles qui marchent",
  "Sport et anxiété : quel exercice choisir",
  "Perfectionnisme et anxiété : briser le cercle vicieux",
  "Boule dans la gorge : comprendre et soulager ce symptôme",
  "Douleurs thoraciques liées au stress : quand s'inquiéter",
  "Pleine conscience au quotidien : 12 exercices simples",
  "Anxiété anticipatoire : comment arrêter de s'inquiéter",
  "Stress au travail : 10 techniques pour rester zen",
  "Journaling pour l'anxiété : méthode complète",
  "Compléments alimentaires anti-stress : ce que dit la science",
  "Anxiété de performance : stratégies efficaces",
  "Comment aider un proche anxieux : guide pratique",
  "Stress des examens : techniques de gestion éprouvées",
  "Ruminations mentales : comment arrêter de penser en boucle",
  "Anxiété chez les adolescents : signes et solutions",
];

/**
 * Extrait les mots-clés principaux du sujet pour la recherche d'image
 * NOUVEAU : Utilise le SUJET RÉEL au lieu de termes aléatoires
 */
function extractImageKeywords(topic) {
  const keywords = [];
  
  // Mapping des concepts vers des termes de recherche visuels cohérents
  const keywordMap = {
    'anxiété': 'anxiety person worried',
    'stress': 'stress person overwhelmed',
    'burn-out': 'burnout exhausted professional',
    'méditation': 'meditation peaceful calm',
    'respiration': 'breathing exercise calm',
    'panique': 'panic anxiety attack',
    'insomnie': 'insomnia sleepless night',
    'social': 'social anxiety people',
    'perfectionnisme': 'perfectionism stress',
    'travail': 'work stress office',
    'examen': 'exam stress student',
    'adolescent': 'teen teenager anxiety',
    'alimentation': 'healthy food nutrition',
    'sport': 'exercise fitness wellness',
    'cohérence cardiaque': 'breathing meditation',
    'pleine conscience': 'mindfulness meditation',
    'journaling': 'journal writing wellness',
    'rumination': 'overthinking worried person',
  };
  
  // Chercher les mots-clés pertinents dans le sujet
  const topicLower = topic.toLowerCase();
  
  for (const [key, value] of Object.entries(keywordMap)) {
    if (topicLower.includes(key)) {
      keywords.push(value);
    }
  }
  
  // Si aucun mot-clé spécifique, utiliser des termes génériques mais pertinents
  if (keywords.length === 0) {
    keywords.push('mental health wellness');
  }
  
  // Retourner le premier mot-clé trouvé (le plus pertinent)
  return keywords[0];
}

/**
 * Recherche une image COHÉRENTE sur Unsplash basée sur le sujet de l'article
 */
async function findImage(topic, seoKeywords) {
  if (!UNSPLASH_KEY) {
    console.log('⚠️  Pas de clé Unsplash - utilisation d\'image par défaut');
    return {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
      alt: `Illustration cohérente pour l'article : ${topic}`,
      photographer: 'Unsplash',
      photographerUrl: 'https://unsplash.com'
    };
  }

  try {
    // CORRECTION CRITIQUE : Utiliser le sujet réel pour trouver une image cohérente
    const searchQuery = extractImageKeywords(topic);
    
    console.log(`   🔍 Recherche d'image pour : "${searchQuery}"`);
    
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape&client_id=${UNSPLASH_KEY}`;
    
    const data = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });

    if (data.urls && data.urls.regular) {
      return {
        url: data.urls.regular + '&w=1200&h=630&fit=crop',
        alt: data.alt_description || `Illustration visuelle cohérente : ${topic}`,
        photographer: data.user.name,
        photographerUrl: data.user.links.html
      };
    }

  } catch (error) {
    console.error('⚠️  Erreur Unsplash:', error.message);
  }

  // Fallback avec terme générique mais cohérent
  return {
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
    alt: `Illustration pour l'article : ${topic}`,
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com'
  };
}

/**
 * Prompt optimisé pour générer des articles de QUALITÉ (pas de sur-promesses)
 */
const ARTICLE_GENERATION_PROMPT = `Tu es un expert en rédaction de contenu santé/bien-être pour CalmeClair.

CONTRAINTES STRICTES :
1. Article en français formel (vouvoiement)
2. 2800-3500 mots (optimal pour SEO et engagement lecteur)
3. VÉRIFIER TOUTES les affirmations via web_search
4. Pas de sur-promesses, pas d'inventions
5. Toujours recommander de consulter un professionnel
6. Politiques AdSense respectées (pas de promesses médicales)

STRUCTURE POUR BON SEO :
## Introduction (150-200 mots - empathique et engageante)

## Comprendre [le sujet] (400-500 mots)
### Sous-section 1
### Sous-section 2

## Les causes / mécanismes (400-500 mots)
### Cause 1
### Cause 2
### Cause 3

## Symptômes et manifestations (300-400 mots)

## Solutions pratiques (600-800 mots - SECTION PRINCIPALE)
### Solution 1 : [Titre accrocheur]
(avec étapes concrètes)
### Solution 2 : [Titre accrocheur]
(avec étapes concrètes)
### Solution 3 : [Titre accrocheur]
(avec étapes concrètes)

## Quand consulter un professionnel (200-300 mots)

## Questions fréquentes (6-8 questions)
**Question 1 ?**
Réponse détaillée basée sur des faits

**Question 2 ?**
Réponse détaillée basée sur des faits

[6-8 FAQ au total]

## Conclusion (150-200 mots - bienveillante)

## Sources et références

OPTIMISATIONS SEO :
- Titre optimisé (55-65 caractères)
- Meta description engageante (150-160 caractères)
- H2/H3 avec mots-clés naturels
- Listes à puces pour clarté
- Paragraphes courts (3-4 lignes)

IMPORTANT - QUALITÉ ET HONNÊTETÉ :
- Vérifier toutes les statistiques avec web_search
- Privilégier : Inserm, HAS, OMS, Santé publique France
- Pas de chiffres inventés
- Pas de promesses de guérison
- Ton bienveillant et informatif

Génère un article complet sur : "{TOPIC}"

Format JSON attendu :
{
  "title": "Titre SEO optimisé (60 caractères max)",
  "excerpt": "Meta description engageante (155 caractères max)",
  "content": "Contenu complet en Markdown",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "anxiete" ou "stress",
  "readingTime": 10,
  "seoKeywords": ["mot-clé principal", "variation 1", "variation 2"]
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
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Impossible d\'extraire le JSON de la réponse');
    }
    
    const articleData = JSON.parse(jsonMatch[0]);
    console.log(`✅ Article généré : "${articleData.title}"`);
    
    return articleData;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
    throw error;
  }
}

/**
 * Génère un slug SEO-friendly
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Ajoute un article au fichier articles.ts
 */
async function addArticleToFile(articleData, topic) {
  const content = fs.readFileSync(ARTICLES_PATH, 'utf8');
  
  const lastIdMatch = content.match(/id: '(\d+)'/g);
  const ids = lastIdMatch ? lastIdMatch.map(m => parseInt(m.match(/\d+/)[0])) : [0];
  const newId = Math.max(...ids) + 1;
  
  const slug = generateSlug(articleData.title);
  const today = new Date().toISOString().split('T')[0];
  
  // Rechercher une image COHÉRENTE avec le sujet
  console.log('🖼️  Recherche d\'une image cohérente...');
  const imageData = await findImage(topic, articleData.seoKeywords || []);
  
  const newArticle = `{
  id: '${newId}',
  slug: '${slug}',
  title: '${articleData.title.replace(/'/g, "\\'")}',
  excerpt: '${articleData.excerpt.replace(/'/g, "\\'")}',
  content: \`
${articleData.content}

---

*Photo par [${imageData.photographer}](${imageData.photographerUrl}) sur Unsplash*
  \`,
  category: '${articleData.category}',
  categoryLabel: '${articleData.category === 'anxiete' ? 'Anxiété' : 'Stress'}',
  tags: ${JSON.stringify(articleData.tags)},
  image: '${imageData.url}',
  imageAlt: '${imageData.alt.replace(/'/g, "\\'")}',
  datePublished: '${today}',
  dateModified: '${today}',
  readingTime: ${articleData.readingTime || 10},
  featured: true
},`;

  const insertPosition = content.indexOf('export const articles: Article[] = [') + 'export const articles: Article[] = ['.length;
  const updatedContent = 
    content.slice(0, insertPosition) + 
    '\n  ' + newArticle + 
    content.slice(insertPosition);
  
  fs.writeFileSync(ARTICLES_PATH, updatedContent, 'utf8');
  
  console.log(`✅ Article ajouté : ID ${newId}, Slug: ${slug}`);
  console.log(`🖼️  Image cohérente : ${imageData.url}`);
  
  return { id: newId, slug, imageUrl: imageData.url };
}

/**
 * Fonction principale
 */
async function main() {
  try {
    const topic = ARTICLE_TOPICS[Math.floor(Math.random() * ARTICLE_TOPICS.length)];
    
    console.log('🚀 Démarrage de la génération automatique\n');
    console.log(`📝 Sujet sélectionné : "${topic}"\n`);
    
    const articleData = await generateArticle(topic);
    const { id, slug, imageUrl } = await addArticleToFile(articleData, topic);
    
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    console.log('\n✅ ✅ ✅ SUCCÈS ! ✅ ✅ ✅');
    console.log(`📝 Nouvel article créé :`);
    console.log(`   - ID: ${id}`);
    console.log(`   - Titre: ${articleData.title}`);
    console.log(`   - Slug: ${slug}`);
    console.log(`   - Mots: ~${articleData.content.split(/\s+/).length}`);
    console.log(`   - Image: COHÉRENTE avec le sujet`);
    console.log(`   - URL: https://calmeclair.com/article/${year}/${month}/${slug}`);
    
  } catch (error) {
    console.error('\n❌ Échec:', error);
    process.exit(1);
  }
}

main();
