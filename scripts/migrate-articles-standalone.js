import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Démarrage migration vers MDX...\n');

// Lire le fichier articles.ts
const articlesContent = fs.readFileSync('src/data/articles.ts', 'utf8');

// Extraire le tableau d'articles
const articlesMatch = articlesContent.match(/export const articles[^=]*=\s*\[([\s\S]*)\];/);

if (!articlesMatch) {
  console.log('❌ Impossible de trouver les articles');
  process.exit(1);
}

const articlesText = articlesMatch[1];

// Créer les dossiers
['content/articles/anxiete', 'content/articles/stress'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Split par les séparateurs d'objets
const articleBlocks = articlesText.split(/},\s*{/);

const articles = [];

articleBlocks.forEach((block) => {
  block = block.trim();
  if (!block.startsWith('{')) block = '{' + block;
  if (!block.endsWith('}')) block = block + '}';
  
  const extract = (field) => {
    const regex = new RegExp(field + ':\\s*[\'"`]([\\s\\S]*?)[\'"`]', 's');
    const match = block.match(regex);
    if (!match) return '';
    return match[1].replace(/\\n/g, '\n').replace(/\\'/g, "'");
  };
  
  const extractArray = (field) => {
    const regex = new RegExp(field + ':\\s*\\[([^\\]]+)\\]');
    const match = block.match(regex);
    if (!match) return [];
    return match[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean);
  };
  
  const extractNumber = (field) => {
    const regex = new RegExp(field + ':\\s*(\\d+)');
    const match = block.match(regex);
    return match ? parseInt(match[1]) : 0;
  };
  
  const extractBoolean = (field) => {
    const regex = new RegExp(field + ':\\s*(true|false)');
    const match = block.match(regex);
    return match ? match[1] === 'true' : false;
  };
  
  const extractContent = () => {
    const match = block.match(/content:\s*`([\s\S]*?)`[,\s]*(?:datePublished|$)/);
    return match ? match[1] : '';
  };
  
  const article = {
    id: extract('id'),
    slug: extract('slug'),
    title: extract('title'),
    excerpt: extract('excerpt'),
    content: extractContent(),
    category: extract('category'),
    categoryLabel: extract('categoryLabel'),
    tags: extractArray('tags'),
    image: extract('image'),
    imageAlt: extract('imageAlt'),
    datePublished: extract('datePublished'),
    dateModified: extract('dateModified'),
    readingTime: extractNumber('readingTime'),
    featured: extractBoolean('featured'),
  };
  
  if (article.id && article.slug) {
    articles.push(article);
    
    const titleClean = article.title.replace(/"/g, '\\"');
    const excerptClean = article.excerpt.replace(/"/g, '\\"');
    
    const frontmatter = `---
id: "${article.id}"
slug: "${article.slug}"
title: "${titleClean}"
excerpt: "${excerptClean}"
category: "${article.category}"
categoryLabel: "${article.categoryLabel}"
tags: [${article.tags.map(t => `"${t}"`).join(', ')}]
image: "${article.image}"
imageAlt: "${article.imageAlt}"
datePublished: "${article.datePublished}"
dateModified: "${article.dateModified}"
readingTime: ${article.readingTime}
featured: ${article.featured}
---

${article.content}
`;
    
    const filename = `${article.slug}.mdx`;
    const filepath = path.join('content/articles', article.category, filename);
    
    fs.writeFileSync(filepath, frontmatter, 'utf8');
    console.log(`✅ ${article.category}/${filename}`);
  }
});

// Générer l'index
const index = articles.map(a => ({
  id: a.id,
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt,
  category: a.category,
  categoryLabel: a.categoryLabel,
  tags: a.tags,
  image: a.image,
  imageAlt: a.imageAlt,
  datePublished: a.datePublished,
  dateModified: a.dateModified,
  readingTime: a.readingTime,
  featured: a.featured,
}));

fs.writeFileSync('content/_index.json', JSON.stringify(index, null, 2), 'utf8');

console.log(`\n🎉 Migration terminée: ${articles.length} articles migrés!`);
console.log(`\n📁 Fichiers créés dans content/articles/`);
