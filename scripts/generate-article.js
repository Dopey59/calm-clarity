#!/usr/bin/env node

/**
 * Script de génération automatique d'articles avec images
 * Version 2.0 - Optimisé pour Google AdSense
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

// Sujets d'articles optimisés pour le trafic SEO
const ARTICLE_TOPICS = [
  // Mots-clés à fort volume de recherche
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
 * Recherche une image sur Unsplash en fonction du sujet
 */
async function findImage(topic, keywords) {
  if (!UNSPLASH_KEY) {
    console.log('⚠️  Pas de clé Unsplash - utilisation d\'image par défaut');
    return {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
      alt: `Illustration de l'article : ${topic}`,
      photographer: 'Unsplash',
      photographerUrl: 'https://unsplash.com'
    };
  }

  try {
    // Mots-clés de recherche optimisés
    const searchTerms = ['meditation', 'wellness', 'mental health', 'calm', 'mindfulness', 'stress relief'];
    const query = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_KEY}`;
    
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
        alt: data.alt_description || `Illustration de l'article : ${topic}`,
        photographer: data.user.name,
        photographerUrl: data.user.links.html
      };
    }

  } catch (error) {
    console.error('⚠️  Erreur Unsplash:', error.message);
  }

  // Fallback
  return {
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
    alt: `Illustration de l'article : ${topic}`,
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com'
  };
}

/**
 * Prompt optimisé pour générer des articles AdSense-friendly
 */
const ARTICLE_GENERATION_PROMPT = `Tu es un expert en rédaction de contenu santé/bien-être pour CalmeClair, optimisé pour Google AdSense.

CONTRAINTES STRICTES :
1. Article en français formel (vouvoiement)
2. 2800-3500 mots (optimal pour SEO et temps de lecture = plus de vues de pubs)
3. Sources scientifiques vérifiées via web_search
4. Structure optimale pour AdSense (sections courtes, espaces pour les pubs)
5. Mots-clés SEO naturellement intégrés
6. AUCUN contenu qui viole les politiques AdSense (pas de promesses médicales non vérifiées)

STRUCTURE OPTIMISÉE POUR ADSENSE :
## Introduction (150-200 mots - accrocheuse)
[Espace pub natif après intro]

## Comprendre [le sujet] (400-500 mots)
### Sous-section 1
### Sous-section 2
[Espace pub après cette section]

## Les causes principales (400-500 mots)
### Cause 1
### Cause 2
### Cause 3
[Espace pub]

## Symptômes et manifestations (300-400 mots)
[Espace pub]

## Solutions pratiques (600-800 mots - SECTION PRINCIPALE)
### Solution 1 : [Titre accrocheur]
### Solution 2 : [Titre accrocheur]
### Solution 3 : [Titre accrocheur]
### Solution 4 : [Titre accrocheur]
[Espace pub]

## Quand consulter un professionnel (200-300 mots)
[Espace pub]

## Questions fréquentes (6-8 questions)
**Question 1 ?**
Réponse détaillée

**Question 2 ?**
Réponse détaillée

[Continuer avec 6-8 FAQ au total]
[Espace pub final]

## Conclusion (150-200 mots - Call to action doux)

## Sources et références

OPTIMISATIONS SEO :
- Titre avec mot-clé principal (55-65 caractères)
- Meta description engageante (150-160 caractères)
- H2/H3 avec variations du mot-clé
- Listes à puces (meilleur engagement)
- Paragraphes courts (3-4 lignes max)
- Tableaux comparatifs si pertinent

MOTS-CLÉS À INTÉGRER NATURELLEMENT :
- Principal : celui du titre
- Secondaires : variations et synonymes
- Longue traîne : questions spécifiques

IMPORTANT - POLITIQUE ADSENSE :
- Pas de promesses de guérison
- Toujours recommander de consulter un professionnel
- Sources médicales fiables uniquement
- Ton bienveillant et informatif (pas alarmiste)

SOURCES AUTORISÉES :
- Inserm, HAS, OMS, Santé publique France
- Études peer-reviewed
- Sites .gouv.fr pour la France
- ÉVITER : blogs personnels, forums, sites commerciaux

Génère un article complet sur : "{TOPIC}"

Format JSON attendu :
{
  "title": "Titre SEO optimisé (60 caractères max)",
  "excerpt": "Meta description engageante (155 caractères max)",
  "content": "Contenu complet en Markdown avec ## pour H2 et ### pour H3",
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
async function addArticleToFile(articleData) {
  const content = fs.readFileSync(ARTICLES_PATH, 'utf8');
  
  // Générer le nouvel ID
  const lastIdMatch = content.match(/id: '(\d+)'/g);
  const ids = lastIdMatch ? lastIdMatch.map(m => parseInt(m.match(/\d+/)[0])) : [0];
  const newId = Math.max(...ids) + 1;
  
  const slug = generateSlug(articleData.title);
  const today = new Date().toISOString().split('T')[0];
  
  // Rechercher une image appropriée
  console.log('🖼️  Recherche d\'une image...');
  const imageData = await findImage(articleData.title, articleData.seoKeywords || []);
  
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
  console.log(`🖼️  Image : ${imageData.url}`);
  
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
    const { id, slug, imageUrl } = await addArticleToFile(articleData);
    
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    console.log('\n✅ ✅ ✅ SUCCÈS ! ✅ ✅ ✅');
    console.log(`📝 Nouvel article créé :`);
    console.log(`   - ID: ${id}`);
    console.log(`   - Titre: ${articleData.title}`);
    console.log(`   - Slug: ${slug}`);
    console.log(`   - Mots: ~${articleData.content.split(/\s+/).length}`);
    console.log(`   - Image: ${imageUrl}`);
    console.log(`   - URL: https://calmeclair.com/article/${year}/${month}/${slug}`);
    
  } catch (error) {
    console.error('\n❌ Échec:', error);
    process.exit(1);
  }
}

main();
