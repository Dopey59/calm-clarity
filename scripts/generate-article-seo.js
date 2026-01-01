#!/usr/bin/env node

/**
 * Génération d'articles - Architecture SEO Pilier/Satellite
 * 
 * V2 - Gestion intelligente :
 * - Articles PILIERS (3000-5000 mots)
 * - Articles SATELLITES (2000-2500 mots)
 * - Évite cannibalisation keywords
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CATEGORY = process.env.CATEGORY || 'stress';
const TOPIC = process.env.TOPIC || 'stress';
const ARTICLE_TYPE = process.env.ARTICLE_TYPE || 'satellite';
const WORD_COUNT = process.env.WORD_COUNT || '2000-2500';
const PILIER_PARENT = process.env.PILIER_PARENT || '';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

console.log(`Configuration:`);
console.log(`   Type: ${ARTICLE_TYPE}`);
console.log(`   Longueur: ${WORD_COUNT} mots`);
if (PILIER_PARENT) {
  console.log(`   Pilier parent: ${PILIER_PARENT}`);
}

/**
 * POOL D'IMAGES PAR CATÉGORIE
 */
const IMAGE_POOLS = {
  anxiete: [
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=630&fit=crop',
  ],
  stress: [
    'https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&h=630&fit=crop',
  ]
};

function scanAllArticles() {
  const articlesDir = path.join(process.cwd(), 'src/content/articles');
  const categories = ['anxiete', 'stress'];
  
  const titles = [];
  const images = [];
  const slugs = [];
  let maxId = 0;
  
  categories.forEach(category => {
    const categoryDir = path.join(articlesDir, category);
    
    if (!fs.existsSync(categoryDir)) {
      return;
    }
    
    const files = fs.readdirSync(categoryDir)
      .filter(f => f.endsWith('.ts') && f !== 'index.ts');
    
    files.forEach(file => {
      const content = fs.readFileSync(path.join(categoryDir, file), 'utf8');
      slugs.push(file.replace('.ts', ''));
      
      const titleMatch = content.match(/title: ['\"](.+?)['\"]/)
      if (titleMatch) titles.push(titleMatch[1].toLowerCase());
      
      const imageMatch = content.match(/image: ['\"](.+?)['\"]/)
      if (imageMatch) images.push(imageMatch[1]);
      
      const idMatch = content.match(/id: ['\"](\\d+)['\"]/)
      if (idMatch) maxId = Math.max(maxId, parseInt(idMatch[1]));
    });
  });
  
  return { titles, images, slugs, nextId: maxId + 1 };
}

function selectUniqueImage(category, usedImages) {
  const pool = IMAGE_POOLS[category] || IMAGE_POOLS.anxiete;
  const availableImages = pool.filter(img => !usedImages.includes(img));
  const finalPool = availableImages.length > 0 ? availableImages : pool;
  const randomIndex = Math.floor(Math.random() * finalPool.length);
  
  console.log(`Image: ${randomIndex + 1}/${finalPool.length} disponibles`);
  
  return finalPool[randomIndex];
}

/**
 * Tronque intelligemment un texte à la fin d'une phrase complète
 */
function smartTruncate(text, maxLength = 300) {
  if (!text || text.length <= maxLength) return text;
  
  // Trouver la dernière phrase complète avant maxLength
  const truncated = text.substring(0, maxLength);
  const lastPeriod = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('! '),
    truncated.lastIndexOf('? ')
  );
  
  // Si on trouve un point avant maxLength, tronquer là
  if (lastPeriod > maxLength * 0.6) {  // Au moins 60% du texte
    return text.substring(0, lastPeriod + 1).trim();
  }
  
  // Sinon, trouver le dernier espace pour ne pas couper un mot
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? text.substring(0, lastSpace) + '...' : truncated + '...';
}

async function generateArticle(existingTitles) {
  console.log(`Generation article ${ARTICLE_TYPE}: ${TOPIC}`);
  console.log(`Recherche ${existingTitles.length} articles existants\n`);
  
  const existingList = existingTitles.slice(0, 50).map(t => `- ${t}`).join('\n');
  
  // Prompt de base anti-hallucination (inchangé)
  const baseRules = `Tu es un RÉDACTEUR MÉDICAL SEO SENIOR spécialisé en santé mentale.

Tu respectes STRICTEMENT :
- Les standards médicaux français (HAS, INSERM)
- Les critères E-E-A-T de Google (Expertise, Experience, Authoritativeness, Trustworthiness)
- Les exigences YMYL (Your Money Your Life) pour contenus santé

SUJET PRÉCIS: "${TOPIC}"
TYPE D'ARTICLE: ${ARTICLE_TYPE}
LONGUEUR CIBLE: ${WORD_COUNT} mots

SUJETS DÉJÀ TRAITÉS (à différencier) :
${existingList}

===============================================================
RÈGLES ANTI-HALLUCINATION (NON-NÉGOCIABLES)
===============================================================

1. ZÉRO affirmation médicale non vérifiable
2. ZÉRO statistique sans URL institutionnelle
3. ZÉRO "Selon l'Inserm" sans https://inserm.fr/...
4. ZÉRO "Une étude montre" (trop vague = INTERDIT)
5. ZÉRO nom de chercheur, médecin, ou expert
6. ZÉRO promesse thérapeutique ("guérir", "éliminer")
7. ZÉRO diagnostic implicite

Si tu ne peux PAS vérifier une information → NE L'ÉCRIS PAS.

===============================================================
SOURCES AUTORISÉES UNIQUEMENT (avec URL complète)
===============================================================

FRANCE :
- Inserm: https://www.inserm.fr/dossier/[sujet]/
- HAS: https://www.has-sante.fr/jcms/[référence]
- Santé publique France: https://www.santepubliquefrance.fr/
- Ameli: https://www.ameli.fr/assure/sante/themes/[sujet]

INTERNATIONAL (si français non disponible) :
- OMS/WHO: https://www.who.int/fr/
- PubMed: https://pubmed.ncbi.nlm.nih.gov/[PMID]
- Cochrane Library: https://www.cochranelibrary.com/

AUCUNE autre source acceptée.

===============================================================
FORMAT OBLIGATOIRE - STANDARD E-E-A-T
===============================================================

Pour CHAQUE affirmation médicale :

MAUVAIS :
"Le stress chronique augmente de 30% le risque cardiovasculaire."
"Selon l'Inserm, les TCC sont efficaces."
"Une étude de 2024 montre que..."

BON :
"Selon l'Inserm (https://www.inserm.fr/dossier/stress/, 2023), 
le stress chronique est associé à un risque cardiovasculaire accru. 
Les mécanismes exacts restent à l'étude."

Formulation PRUDENTE requise :
- "peut contribuer à..." (pas "cause")
- "est associé à..." (pas "provoque")
- "selon certaines études..." (pas "il est prouvé")
- "pourrait aider à..." (pas "guérit")`;

  // Structure spécifique selon le type
  const pilierStructure = `
===============================================================
ARTICLE PILIER - ${WORD_COUNT} MOTS
===============================================================

OBJECTIF : Article de RÉFÉRENCE exhaustif sur "${TOPIC}"

STRUCTURE DÉTAILLÉE OBLIGATOIRE :

# [Titre H1 - Accrocheur + Keyword exact + Promesse]

[Introduction 250-350 mots]
- Contexte large et empathique
- Prévalence (avec URL Inserm/SPF)
- Impact vie quotidienne
- Promesse de valeur (ce que le lecteur va apprendre)
- Annonce du plan détaillé

## Comprendre ${TOPIC} : Définition Complète

[400-600 mots - Définition HAS/Inserm avec URL]
- Définition médicale officielle (HAS, URL)
- Critères diagnostiques
- Différences avec concepts proches
- Données épidémiologiques (Inserm, URL)

## Manifestations et Symptômes Détaillés

[500-700 mots]

### Symptômes Physiques
[Liste complète avec sources]

### Symptômes Psychologiques
[Liste complète avec sources]

### Symptômes Comportementaux
[Impact concret]

### Signaux d'Alerte
[Quand s'inquiéter - critères HAS]

## Causes et Facteurs de Risque

[500-700 mots]

### Facteurs Biologiques
[Mécanismes avec sources Inserm]

### Facteurs Psychologiques
[Validés scientifiquement]

### Facteurs Environnementaux
[Contexte social/professionnel]

### Interactions Multifactorielles
[Approche holistique]

## Solutions et Accompagnement

[700-900 mots]

### Approches Médicales Validées
**Psychothérapies :**
- TCC (HAS, URL)
- Autres approches recommandées
- Niveau de preuve pour chaque

**Traitements :**
- Approches reconnues HAS
- Jamais de promesse guérison

### Stratégies de Gestion au Quotidien
[Techniques avec niveau de preuve]
- Respiration (niveau preuve)
- Activité physique (Inserm, URL)
- Sommeil
- Alimentation
- Gestion stress

### Quand Consulter un Professionnel

**Section NON-NÉGOCIABLE :**

"Il est recommandé de consulter si :
- Symptômes persistent >X semaines
- Impact significatif vie quotidienne
- Détresse importante

**Professionnels :**
- Médecin traitant (1er recours)
- Psychiatre (diagnostic/médication)
- Psychologue (psychothérapie)

**Urgences :**
- **3114** : Prévention suicide (24h/24)
- **15** : SAMU
- **114** : Sourds/malentendants (SMS)"

## Évolution et Pronostic

[300-400 mots]
- Évolution typique
- Facteurs bon/mauvais pronostic
- Transparence variabilité individuelle

## Ce Qui Ne Fonctionne PAS

[200-300 mots - Transparence]
"À ce jour, aucune étude robuste ne valide..."

## Questions Fréquentes (FAQ)

[800-1200 mots - 8-12 questions]

### [Question 1 précise]
[Réponse directe + contexte + source URL]

[Répéter pour 8-12 questions]

## Ressources et Soutien

[200-300 mots]
- Associations reconnues
- Lignes d'écoute
- Sites fiables

## Limites de l'Article

[150-200 mots]
"Article à visée informative. Ne remplace pas avis médical personnalisé..."

## Sources Scientifiques

[200-300 mots]
### Institutions
1. [Titre] - Inserm - URL - Année
2. [Titre] - HAS - URL - Année
[...]

*Dernière mise à jour : [Date]*

**TOTAL REQUIS : ${WORD_COUNT} mots**`;

  const satelliteStructure = `
===============================================================
ARTICLE SATELLITE - ${WORD_COUNT} MOTS
===============================================================

OBJECTIF : Approfondir UN aspect spécifique lié à "${PILIER_PARENT}"

STRUCTURE CIBLÉE OBLIGATOIRE :

# [Titre H1 Spécifique - Keyword exact + Angle unique]

[Introduction 150-200 mots]
- Contexte de cet aspect particulier
- Lien avec concept général "${PILIER_PARENT}"
- Promesse spécifique
- Valeur ajoutée de cet article

## Comprendre ${TOPIC} en Détail

[300-400 mots]
- Définition précise de CET aspect
- Lien avec "${PILIER_PARENT}"
- Particularités et spécificités
- Prévalence si données disponibles (URL)

## Manifestations Spécifiques

[300-400 mots]
Focus UNIQUEMENT sur les manifestations propres à cet aspect
- Signes distinctifs
- Comment les reconnaître
- Différences avec forme générale

## Facteurs Spécifiques

[200-300 mots]
Causes/déclencheurs propres à cet aspect
- Facteurs de risque particuliers
- Situations typiques
- Populations concernées

## Solutions Adaptées

[400-600 mots]
Approches spécifiques pour CET aspect

### Adaptations Thérapeutiques
[Approches HAS adaptées]

### Stratégies Ciblées
[Techniques spécifiques avec niveau preuve]

### Quand Consulter

**Section NON-NÉGOCIABLE :**
[Critères spécifiques + numéros 3114/15/114]

## Questions Fréquentes

[300-500 mots - 5-7 questions ciblées]

### [Question spécifique 1]
[Réponse directe + source]

[Répéter pour 5-7 questions]

## Aller Plus Loin

[100-150 mots]
"Pour une vue d'ensemble de ${PILIER_PARENT}, consultez notre article complet [lien interne si existe]"

## Limites de l'Article

[100-150 mots]
Disclaimer standard

## Sources Scientifiques

[150-200 mots]
Liste URLs + dates

**TOTAL REQUIS : ${WORD_COUNT} mots**`;

  const structurePrompt = ARTICLE_TYPE === 'pilier' ? pilierStructure : satelliteStructure;

  const endRules = `
===============================================================
INTERDICTIONS ABSOLUES (Rappel)
===============================================================

PROMESSES : "guérit" "élimine" ✅ "peut contribuer"
CAUSALITÉ : "cause" "provoque" ✅ "est associé à"
SOURCES : "une étude" "Dr. X" ✅ "Inserm (URL, année)"
STATS : "42% des" sans URL ✅ Toute stat a URL

===============================================================
AVERTISSEMENT ÉTHIQUE
===============================================================

Personnes en SOUFFRANCE RÉELLE liront cet article.

Information FAUSSE = Risque réel :
- Retard prise en charge
- Aggravation symptômes
- Faux espoirs
- Comportements à risque

RIGUEUR SCIENTIFIQUE = NON-NÉGOCIABLE
PRUDENCE MÉDICALE = OBLIGATION ÉTHIQUE

Pas de source vérifiable → NE L'ÉCRIS PAS.

===============================================================

IMPORTANT: Génère UNIQUEMENT le contenu Markdown final.
Pas de frontmatter, pas de méta-commentaires.`;

  const fullPrompt = baseRules + structurePrompt + endRules;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [{ role: 'user', content: fullPrompt }]
  });

  const content = message.content[0].text;
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Article sans titre';
  
  console.log(`Titre: "${title}"`);
  
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const paragraphs = content.split('\n\n').filter(p => !p.startsWith('#'));
  const firstParagraph = paragraphs[0] || `Article sur ${TOPIC}`;
  const excerpt = smartTruncate(firstParagraph, 300).replace(/['"''"]/g, '');
  
  return { title, slug, excerpt, content };
}

function createArticleFile(article, nextId, image, existingSlugs) {
  const articlesDir = path.join(process.cwd(), 'src/content/articles');
  const categoryDir = path.join(articlesDir, CATEGORY);
  const today = new Date().toISOString().split('T')[0];
  
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
    console.log(`Dossier cree: ${categoryDir}`);
  }
  
  let finalSlug = article.slug;
  let counter = 1;
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${article.slug}-${counter}`;
    counter++;
  }
  
  if (finalSlug !== article.slug) {
    console.log(`Slug duplique, renomme: ${finalSlug}`);
  }
  
  const filename = `${finalSlug}.ts`;
  const filepath = path.join(categoryDir, filename);
  
  const contentEscaped = article.content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  
  const titleEscaped = article.title.replace(/'/g, "\\'");
  const excerptEscaped = article.excerpt.replace(/'/g, "\\'");
  
  const fileContent = `import { Article } from '@/types/Article';

/**
 * ${article.title}
 * Type: ${ARTICLE_TYPE}
 * Catégorie: ${CATEGORY}
 * Généré le: ${today}
 */

export const article: Article = {
  id: '${nextId}',
  slug: '${finalSlug}',
  title: '${titleEscaped}',
  excerpt: '${excerptEscaped}',
  content: \`${contentEscaped}\`,
  category: '${CATEGORY}' as const,
  categoryLabel: '${CATEGORY === 'anxiete' ? 'Anxiété' : 'Stress'}',
  tags: ['${TOPIC}', 'bien-être', 'santé mentale'],
  image: '${image}',
  imageAlt: 'Illustration pour article : ${titleEscaped}',
  datePublished: '${today}',
  dateModified: '${today}',
  readingTime: ${ARTICLE_TYPE === 'pilier' ? 15 : 10},
  featured: ${ARTICLE_TYPE === 'pilier' ? 'true' : 'false'},
};
`;
  
  fs.writeFileSync(filepath, fileContent, 'utf8');
  
  console.log(`Fichier cree: ${CATEGORY}/${filename}`);
  console.log(`   ID: ${nextId}`);
  console.log(`   Type: ${ARTICLE_TYPE}`);
  console.log(`   Slug: ${finalSlug}`);
  
  return { filepath, finalSlug };
}

async function main() {
  try {
    console.log('GENERATION ARTICLE INTELLIGENTE\n');
    
    console.log('Scan des articles existants...');
    const { titles, images, slugs, nextId } = scanAllArticles();
    console.log(`   - ${titles.length} articles trouves`);
    console.log(`   - Prochain ID: ${nextId}\n`);
    
    const article = await generateArticle(titles);
    const image = selectUniqueImage(CATEGORY, images);
    const { filepath, finalSlug } = createArticleFile(article, nextId, image, slugs);
    
    console.log('\nARTICLE GENERE AVEC SUCCES !');
    console.log(`\nFichier: ${filepath}`);
    console.log(`URL: /articles/${CATEGORY}/${finalSlug}`);
    console.log(`Type: ${ARTICLE_TYPE} (${WORD_COUNT} mots)`);
    
  } catch (error) {
    console.error('\nERREUR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
