#!/usr/bin/env node

/**
 * Script de génération automatique d'articles avec images COHÉRENTES
 * Version 4.0 - Alternance intelligente stress/anxiété selon l'heure
 * - 9h (matin) → Articles STRESS (travail, quotidien)
 * - 15h (après-midi) → Articles ANXIÉTÉ (émotionnel, personnel)
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

// Sujets STRESS - Pour publication le matin (9h)
// Thématiques : travail, quotidien, performance, gestion du temps
const STRESS_TOPICS = [
  "10 techniques de respiration anti-stress scientifiquement prouvées",
  "Burn-out : reconnaître les 7 signes précurseurs",
  "Alimentation anti-stress : les 15 meilleurs aliments",
  "Cohérence cardiaque : exercice de 5 minutes pour se détendre",
  "Douleurs thoraciques liées au stress : quand s'inquiéter",
  "Pleine conscience au quotidien : 12 exercices simples",
  "Stress au travail : 10 techniques pour rester zen",
  "Compléments alimentaires anti-stress : ce que dit la science",
  "Stress des examens : techniques de gestion éprouvées",
  "Gestion du stress professionnel : guide pratique",
  "Stress chronique : reconnaître les symptômes d'alerte",
  "Techniques de relaxation rapide pour situations stressantes",
  "Sport et stress : quel exercice pour se détendre",
  "Stress et sommeil : comment mieux dormir",
  "Boule dans la gorge : comprendre ce symptôme de stress"
];

// Sujets ANXIÉTÉ - Pour publication l'après-midi (15h)
// Thématiques : émotions, relations, anxiété sociale, troubles anxieux
const ANXIETY_TOPICS = [
  "Comment gérer une crise d'anxiété en 5 minutes",
  "Anxiété nocturne : causes et solutions pratiques",
  "Méditation pour débutants : guide complet en 10 étapes",
  "Différence entre stress et anxiété : tout comprendre",
  "Comment calmer une attaque de panique rapidement",
  "Anxiété sociale : 8 stratégies pour la surmonter",
  "Insomnie et anxiété : solutions naturelles qui marchent",
  "Sport et anxiété : quel exercice choisir",
  "Perfectionnisme et anxiété : briser le cercle vicieux",
  "Anxiété anticipatoire : comment arrêter de s'inquiéter",
  "Journaling pour l'anxiété : méthode complète",
  "Anxiété de performance : stratégies efficaces",
  "Comment aider un proche anxieux : guide pratique",
  "Ruminations mentales : comment arrêter de penser en boucle",
  "Anxiété chez les adolescents : signes et solutions"
];

/**
 * Détermine la catégorie selon l'heure de publication
 * 9h Paris (8h UTC hiver / 7h UTC été) → STRESS
 * 15h Paris (14h UTC hiver / 13h UTC été) → ANXIÉTÉ
 */
function determineCategory() {
  const now = new Date();
  const hour = now.getUTCHours();
  
  // Plage matin : 6h-10h UTC (couvre 7h-8h UTC)
  if (hour >= 6 && hour < 10) {
    return { category: 'stress', topics: STRESS_TOPICS, label: 'STRESS (matin - travail/quotidien)' };
  }
  
  // Plage après-midi : 12h-16h UTC (couvre 13h-14h UTC)
  if (hour >= 12 && hour < 16) {
    return { category: 'anxiete', topics: ANXIETY_TOPICS, label: 'ANXIÉTÉ (après-midi - émotionnel/personnel)' };
  }
  
  // Fallback pour tests manuels : alterner selon les minutes
  const isEven = now.getMinutes() % 2 === 0;
  if (isEven) {
    return { category: 'stress', topics: STRESS_TOPICS, label: 'STRESS (test manuel)' };
  } else {
    return { category: 'anxiete', topics: ANXIETY_TOPICS, label: 'ANXIÉTÉ (test manuel)' };
  }
}

/**
 * Extrait les mots-clés principaux du sujet pour la recherche d'image
 */
function extractImageKeywords(topic) {
  const keywords = [];
  
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
  
  const topicLower = topic.toLowerCase();
  
  for (const [key, value] of Object.entries(keywordMap)) {
    if (topicLower.includes(key)) {
      keywords.push(value);
    }
  }
  
  if (keywords.length === 0) {
    keywords.push('mental health wellness');
  }
  
  return keywords[0];
}

/**
 * Recherche une image COHÉRENTE sur Unsplash
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

  return {
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
    alt: `Illustration pour l'article : ${topic}`,
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com'
  };
}

/**
 * Prompt avec catégorie FORCÉE pour garantir l'alternance
 */
function getArticlePrompt(topic, forcedCategory) {
  return `Tu es un expert en rédaction de contenu santé/bien-être pour CalmeClair.

CONTRAINTE CRITIQUE - CATÉGORIE IMPOSÉE :
- Tu DOIS utiliser la catégorie "${forcedCategory}" (obligatoire)
- Ne change PAS cette catégorie, même si le sujet pourrait être dans l'autre

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

Génère un article complet sur : "${topic}"

Format JSON attendu :
{
  "title": "Titre SEO optimisé (60 caractères max)",
  "excerpt": "Meta description engageante (155 caractères max)",
  "content": "Contenu complet en Markdown",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "${forcedCategory}",
  "readingTime": 10,
  "seoKeywords": ["mot-clé principal", "variation 1", "variation 2"]
}`;
}

/**
 * Génère un nouvel article via l'API Claude
 */
async function generateArticle(topic, forcedCategory) {
  console.log(`🤖 Génération de l'article : "${topic}"`);
  console.log(`📂 Catégorie forcée : "${forcedCategory}"`);
  
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      temperature: 1,
      messages: [
        {
          role: 'user',
          content: getArticlePrompt(topic, forcedCategory)
        }
      ],
    });

    const content = message.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Impossible d\'extraire le JSON de la réponse');
    }
    
    const articleData = JSON.parse(jsonMatch[0]);
    
    // Vérification de sécurité : forcer la catégorie si Claude l'a changée
    if (articleData.category !== forcedCategory) {
      console.log(`⚠️  Catégorie corrigée : ${articleData.category} → ${forcedCategory}`);
      articleData.category = forcedCategory;
    }
    
    console.log(`✅ Article généré : "${articleData.title}"`);
    console.log(`✅ Catégorie confirmée : "${articleData.category}"`);
    
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
 * Fonction principale avec alternance intelligente
 */
async function main() {
  try {
    // Déterminer la catégorie selon l'heure
    const { category, topics, label } = determineCategory();
    
    // Sélectionner un sujet aléatoire dans la catégorie appropriée
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    console.log('🚀 Démarrage de la génération automatique\n');
    console.log(`🕐 Heure UTC : ${new Date().toISOString()}`);
    console.log(`📂 Catégorie sélectionnée : ${label}`);
    console.log(`📝 Sujet : "${topic}"\n`);
    
    const articleData = await generateArticle(topic, category);
    const { id, slug, imageUrl } = await addArticleToFile(articleData, topic);
    
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    console.log('\n✅ ✅ ✅ SUCCÈS ! ✅ ✅ ✅');
    console.log(`📝 Nouvel article créé :`);
    console.log(`   - ID: ${id}`);
    console.log(`   - Titre: ${articleData.title}`);
    console.log(`   - Catégorie: ${articleData.category}`);
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
