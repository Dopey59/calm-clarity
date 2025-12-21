#!/usr/bin/env node

/**
 * Génération d'articles - Architecture SEO-optimale
 * 
 * Crée automatiquement :
 * - 1 fichier par article
 * - Dans le bon dossier de catégorie
 * - Nom de fichier = slug
 * - Rotation d'images uniques
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

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

/**
 * Scanner tous les articles existants
 */
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
      
      // Extraire slug depuis le nom de fichier
      slugs.push(file.replace('.ts', ''));
      
      // Extraire titre
      const titleMatch = content.match(/title: ['"](.+?)['"]/);
      if (titleMatch) {
        titles.push(titleMatch[1].toLowerCase());
      }
      
      // Extraire image
      const imageMatch = content.match(/image: ['"](.+?)['"]/);
      if (imageMatch) {
        images.push(imageMatch[1]);
      }
      
      // Extraire ID
      const idMatch = content.match(/id: ['"](\\d+)['"]/);
      if (idMatch) {
        maxId = Math.max(maxId, parseInt(idMatch[1]));
      }
    });
  });
  
  return { titles, images, slugs, nextId: maxId + 1 };
}

/**
 * Sélectionner une image unique
 */
function selectUniqueImage(category, usedImages) {
  const pool = IMAGE_POOLS[category] || IMAGE_POOLS.anxiete;
  const availableImages = pool.filter(img => !usedImages.includes(img));
  const finalPool = availableImages.length > 0 ? availableImages : pool;
  const randomIndex = Math.floor(Math.random() * finalPool.length);
  
  console.log(`🎨 Image: ${randomIndex + 1}/${finalPool.length} disponibles`);
  
  return finalPool[randomIndex];
}

/**
 * Générer l'article via Claude
 */
async function generateArticle(existingTitles) {
  console.log(`📝 Génération article: ${TOPIC}`);
  console.log(`🔍 ${existingTitles.length} articles existants\n`);
  
  const existingList = existingTitles.slice(0, 50).map(t => `- ${t}`).join('\n');
  
  const prompt = `Tu es un RÉDACTEUR MÉDICAL SEO SENIOR spécialisé en santé mentale.

Tu respectes STRICTEMENT :
- Les standards médicaux français (HAS, INSERM)
- Les critères E-E-A-T de Google (Expertise, Experience, Authoritativeness, Trustworthiness)
- Les exigences YMYL (Your Money Your Life) pour contenus santé

SUJET: "${TOPIC}"

SUJETS DÉJÀ TRAITÉS :
${existingList}

═══════════════════════════════════════════════════════════════
🚨 RÈGLES ANTI-HALLUCINATION (NON-NÉGOCIABLES)
═══════════════════════════════════════════════════════════════

1. ❌ ZÉRO affirmation médicale non vérifiable
2. ❌ ZÉRO statistique sans URL institutionnelle
3. ❌ ZÉRO "Selon l'Inserm" sans https://inserm.fr/...
4. ❌ ZÉRO "Une étude montre" (trop vague = INTERDIT)
5. ❌ ZÉRO nom de chercheur, médecin, ou expert
6. ❌ ZÉRO promesse thérapeutique ("guérir", "éliminer")
7. ❌ ZÉRO diagnostic implicite

Si tu ne peux PAS vérifier une information → NE L'ÉCRIS PAS.

═══════════════════════════════════════════════════════════════
✅ SOURCES AUTORISÉES UNIQUEMENT (avec URL complète)
═══════════════════════════════════════════════════════════════

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

═══════════════════════════════════════════════════════════════
📋 FORMAT OBLIGATOIRE - STANDARD E-E-A-T
═══════════════════════════════════════════════════════════════

Pour CHAQUE affirmation médicale :

❌ MAUVAIS :
"Le stress chronique augmente de 30% le risque cardiovasculaire."
"Selon l'Inserm, les TCC sont efficaces."
"Une étude de 2024 montre que..."

✅ BON :
"Selon l'Inserm (https://www.inserm.fr/dossier/stress/, 2023), 
le stress chronique est associé à un risque cardiovasculaire accru. 
Les mécanismes exacts restent à l'étude."

Formulation PRUDENTE requise :
- "peut contribuer à..." (pas "cause")
- "est associé à..." (pas "provoque")
- "selon certaines études..." (pas "il est prouvé")
- "pourrait aider à..." (pas "guérit")

═══════════════════════════════════════════════════════════════
🎯 STRUCTURE ARTICLE (2000-2500 mots)
═══════════════════════════════════════════════════════════════

# [Titre H1 - Accrocheur + SEO + Question utilisateur]

[Introduction 150-200 mots]
- Contexte empathique
- Prévalence (SI source disponible avec URL)
- Annonce du contenu
- AUCUNE stat sans source

## Comprendre ${TOPIC} : Définition Médicale

[Basé UNIQUEMENT sur définition HAS/Inserm avec URL]

Exemple :
"Selon la Haute Autorité de Santé (HAS, 
https://www.has-sante.fr/..., 2022), le trouble anxieux 
généralisé se caractérise par..."

## Reconnaître les Manifestations

### Symptômes Physiques
[Liste factuelle - sources médicales]
- [Symptôme] (Inserm, URL, année)

### Symptômes Psychologiques
[Idem - pas d'invention]

### ⚠️ Quand S'Inquiéter (Signaux d'Alerte)
[Critères basés sur recommandations HAS]

## Comprendre les Causes (Facteurs de Risque)

[UNIQUEMENT facteurs validés scientifiquement]

**LANGAGE PRUDENT obligatoire :**
- "Les facteurs de risque incluent..." ✅
- "Peut être lié à..." ✅
- "Le stress CAUSE l'anxiété" ❌

## Solutions et Accompagnement

### Approches Validées Scientifiquement

**Psychothérapies :**
[UNIQUEMENT celles recommandées par HAS]
"La HAS (URL, année) recommande en première intention..."

**Attention :** Ne JAMAIS promettre de guérison.
Formulation : "peut contribuer à améliorer..." ✅

### Stratégies de Gestion au Quotidien

[Techniques avec niveau de preuve]
- Respiration : (niveau de preuve faible à modéré)
- Exercice physique : (niveau de preuve élevé, Inserm, URL)

### 🏥 Quand Consulter un Professionnel (OBLIGATOIRE)

**Section NON-NÉGOCIABLE :**

"Il est recommandé de consulter un professionnel de santé si :
- Les symptômes persistent plus de [X semaines] (selon HAS)
- Ils perturbent significativement votre vie quotidienne
- Vous ressentez une détresse importante

**Professionnels consultables :**
- Médecin traitant (premier recours)
- Psychiatre (diagnostic et traitement médicamenteux si nécessaire)
- Psychologue (psychothérapie)

**En cas de crise ou d'urgence :**
- **3114** : Numéro national de prévention du suicide (gratuit, 24h/24)
- **15** : SAMU (urgences médicales)
- **114** : Numéro d'urgence pour personnes sourdes/malentendantes (par SMS)"

## Ce Qui Ne Fonctionne PAS (Transparence)

[Mentionner approches non validées scientifiquement]
"À ce jour, aucune étude scientifique robuste ne valide..."

Cela renforce la crédibilité E-E-A-T.

## Questions Fréquemment Posées (FAQ)

[5-8 questions]

**Format :**
### [Question exacte que les gens se posent]

[Réponse factuelle avec sources]
- Commence par répondre directement
- Ajoute contexte si nécessaire
- Source avec URL
- Langage prudent

Exemple :
### Le stress peut-il causer des maladies physiques ?

Le stress chronique est associé à divers troubles de santé. 
Selon l'Inserm (...URL..., 2023), il peut contribuer à 
l'hypertension et aux troubles cardiovasculaires. Cependant, 
la relation de causalité directe reste complexe et nécessite 
davantage de recherches.

## Limites de l'Article (Transparence Éditoriale)

**Section RECOMMANDÉE pour E-E-A-T :**

"Cet article a été rédigé à des fins d'information générale. 
Il ne remplace pas un avis médical personnalisé. Chaque 
situation est unique et nécessite une évaluation individuelle 
par un professionnel de santé."

## Sources Scientifiques

**LISTE OBLIGATOIRE en fin d'article :**

### Institutions de Santé
1. [Titre exact de la page] - Inserm - https://... - Année
2. [Titre exact] - HAS - https://... - Année
3. [Titre exact] - Santé publique France - https://... - Année

### Études Scientifiques (si applicable)
1. [Auteurs]. [Titre]. [Journal]. Année. PMID: [numéro]. https://pubmed.ncbi.nlm.nih.gov/...

*Dernière mise à jour des sources : [Date du jour]*

═══════════════════════════════════════════════════════════════
⛔ INTERDICTIONS ABSOLUES E-E-A-T
═══════════════════════════════════════════════════════════════

PROMESSES THÉRAPEUTIQUES :
❌ "Ce traitement guérit..."
❌ "Élimine définitivement..."
❌ "Permet de se débarrasser de..."
✅ "Peut contribuer à améliorer..."
✅ "Est reconnu comme efficace pour..."

DIAGNOSTICS IMPLICITES :
❌ "Si vous avez ces symptômes, vous souffrez de..."
✅ "Ces symptômes peuvent indiquer... Consultez un professionnel."

CAUSALITÉ SIMPLISTE :
❌ "Le stress cause l'anxiété"
❌ "X provoque Y"
✅ "Le stress est associé à..."
✅ "Peut contribuer au développement de..."

AFFIRMATIONS CATÉGORIQUES :
❌ "Toutes les études montrent..."
❌ "Il est scientifiquement prouvé..."
❌ "Les experts sont unanimes..."
✅ "Selon le consensus actuel..."
✅ "Les données disponibles suggèrent..."

SOURCES VAGUES :
❌ "Une étude montre..."
❌ "Des recherches récentes..."
❌ "Selon les experts..."
❌ "D'après le Dr. X..." (nom de personne)

CHIFFRES SANS SOURCE :
❌ Tout pourcentage sans URL institutionnelle
❌ Toute statistique sans référence précise

═══════════════════════════════════════════════════════════════
🎯 MÉTHODE DE VÉRIFICATION INTERNE
═══════════════════════════════════════════════════════════════

Avant de finaliser l'article, vérifie :

□ Chaque stat a une URL institutionnelle
□ Chaque "selon X" a une URL
□ AUCUN "une étude montre"
□ AUCUN nom de chercheur/médecin
□ AUCUNE promesse de guérison
□ Langage prudent utilisé ("peut", "associé à")
□ Section "Quand consulter" présente
□ Numéros urgence (3114, 15, 114) présents
□ Liste sources complète en fin
□ Limites de l'article mentionnées

Si UNE SEULE case non cochée → RECOMMENCE.

═══════════════════════════════════════════════════════════════
✅ ENRICHISSEMENTS SEO E-E-A-T
═══════════════════════════════════════════════════════════════

VOCABULAIRE MÉDICAL PRÉCIS :
- "Trouble anxieux généralisé" > "anxiété"
- "Psychothérapie cognitivo-comportementale" > "TCC"
- "Professionnel de santé" > "médecin"

SIGNAUX DE CONFIANCE :
- Dates de sources récentes (< 3 ans idéalement)
- Mentions d'institutions reconnues
- Transparence sur limites
- Appel à consultation professionnelle

MOTS-CLÉS SECONDAIRES (à intégrer naturellement) :
- [Insère 5-8 variations du mot-clé principal]
- Questions longue traîne
- Termes médicaux associés

═══════════════════════════════════════════════════════════════
⚠️ AVERTISSEMENT ÉTHIQUE FINAL
═══════════════════════════════════════════════════════════════

Cet article sera lu par des personnes en SOUFFRANCE RÉELLE.

Une information FAUSSE ou TROMPEUSE peut :
- Retarder une prise en charge médicale nécessaire
- Aggraver des symptômes
- Créer de faux espoirs
- Induire des comportements à risque

LA RIGUEUR SCIENTIFIQUE N'EST PAS NÉGOCIABLE.
LA PRUDENCE MÉDICALE EST UNE OBLIGATION ÉTHIQUE.

Si tu n'as PAS de source institutionnelle vérifiable :
→ NE L'ÉCRIS PAS.

Si une affirmation ne fait PAS consensus médical :
→ Reformule avec prudence explicite OU supprime.

═══════════════════════════════════════════════════════════════

IMPORTANT: Génère UNIQUEMENT le contenu Markdown final.
Pas de frontmatter, pas de méta-commentaires sur ton processus.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [{ role: 'user', content: prompt }]
  });

  const content = message.content[0].text;
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Article sans titre';
  
  console.log(`✅ Titre: "${title}"`);
  
  // Générer le slug
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const paragraphs = content.split('\n\n').filter(p => !p.startsWith('#'));
  const excerpt = paragraphs[0]?.substring(0, 200).replace(/['"'"]/g, '') || `Article sur ${TOPIC}`;
  
  return { title, slug, excerpt, content };
}

/**
 * Créer le fichier de l'article
 */
function createArticleFile(article, nextId, image, existingSlugs) {
  const articlesDir = path.join(process.cwd(), 'src/content/articles');
  const categoryDir = path.join(articlesDir, CATEGORY);
  const today = new Date().toISOString().split('T')[0];
  
  // Vérifier que le dossier existe
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
    console.log(`📁 Dossier créé: ${categoryDir}`);
  }
  
  // Gérer les slugs en double
  let finalSlug = article.slug;
  let counter = 1;
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${article.slug}-${counter}`;
    counter++;
  }
  
  if (finalSlug !== article.slug) {
    console.log(`⚠️  Slug dupliqué, renommé: ${finalSlug}`);
  }
  
  // Chemin du fichier
  const filename = `${finalSlug}.ts`;
  const filepath = path.join(categoryDir, filename);
  
  // Échapper le contenu
  const contentEscaped = article.content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
  
  const titleEscaped = article.title.replace(/'/g, "\\'");
  const excerptEscaped = article.excerpt.replace(/'/g, "\\'");
  
  // Contenu du fichier
  const fileContent = `import { Article } from '@/types/Article';

/**
 * ${article.title}
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
  readingTime: 10,
  featured: true,
};
`;
  
  // Écrire le fichier
  fs.writeFileSync(filepath, fileContent, 'utf8');
  
  console.log(`✅ Fichier créé: ${CATEGORY}/${filename}`);
  console.log(`   ID: ${nextId}`);
  console.log(`   Slug: ${finalSlug}`);
  
  return { filepath, finalSlug };
}

/**
 * Main
 */
async function main() {
  try {
    console.log('🚀 GÉNÉRATION ARTICLE (Architecture SEO)\n');
    
    // 1. Scanner les articles existants
    console.log('📊 Scan des articles existants...');
    const { titles, images, slugs, nextId } = scanAllArticles();
    console.log(`   - ${titles.length} articles trouvés`);
    console.log(`   - Prochain ID: ${nextId}\n`);
    
    // 2. Générer l'article
    const article = await generateArticle(titles);
    
    // 3. Sélectionner une image unique
    const image = selectUniqueImage(CATEGORY, images);
    
    // 4. Créer le fichier
    const { filepath, finalSlug } = createArticleFile(article, nextId, image, slugs);
    
    console.log('\n🎉 ARTICLE GÉNÉRÉ AVEC SUCCÈS !');
    console.log(`\n📄 Fichier: ${filepath}`);
    console.log(`🔗 URL: /articles/${CATEGORY}/${finalSlug}`);
    console.log('\n✨ Aucune action supplémentaire requise !');
    console.log('   L\'index détecte automatiquement le nouveau fichier.');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
