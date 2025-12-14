#!/usr/bin/env node

/**
 * Migration des articles MDX vers TypeScript
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Migration MDX → TypeScript...\n');

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/articles-generated.ts');

const categories = ['anxiete', 'stress'];
const articles = [];

// Scanner les articles MDX
categories.forEach(category => {
  const categoryPath = path.join(ARTICLES_DIR, category);
  
  if (!fs.existsSync(categoryPath)) return;
  
  const files = fs.readdirSync(categoryPath);
  
  files.forEach(file => {
    if (!file.endsWith('.mdx')) return;
    
    const filePath = path.join(categoryPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    try {
      const { data, content } = matter(fileContent);
      
      if (!data.id || !data.slug || !data.title || !content || content.trim().length === 0) {
        console.log(`⚠️  Ignoré (incomplet): ${file}`);
        return;
      }
      
      // Échapper pour TypeScript
      const contentEscaped = content
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$');
      
      const titleEscaped = data.title.replace(/'/g, "\\'" );
      const excerptEscaped = (data.excerpt || '').replace(/'/g, "\\'" );
      const imageAltEscaped = (data.imageAlt || '').replace(/'/g, "\\'" );
      
      articles.push({
        id: data.id,
        slug: data.slug,
        title: titleEscaped,
        excerpt: excerptEscaped,
        content: contentEscaped,
        category: data.category,
        categoryLabel: data.categoryLabel,
        tags: data.tags || [],
        image: data.image || '',
        imageAlt: imageAltEscaped,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        readingTime: data.readingTime || 10,
        featured: data.featured || false,
      });
      
      console.log(`✅ Migré: ${data.title}`);
      
    } catch (error) {
      console.error(`❌ Erreur: ${file}:`, error.message);
    }
  });
});

// Trier par date
articles.sort((a, b) => 
  new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
);

// Générer le fichier TypeScript
const tsContent = `import { Article } from '@/types/Article';

/**
 * Articles générés automatiquement
 * Migré depuis MDX le ${new Date().toISOString().split('T')[0]}
 */

export const generatedArticles: Article[] = [
${articles.map(a => `  {
    id: '${a.id}',
    slug: '${a.slug}',
    title: '${a.title}',
    excerpt: '${a.excerpt}',
    content: \`${a.content}\`,
    category: '${a.category}' as const,
    categoryLabel: '${a.categoryLabel}',
    tags: [${a.tags.map(t => `'${t}'`).join(', ')}],
    image: '${a.image}',
    imageAlt: '${a.imageAlt}',
    datePublished: '${a.datePublished}',
    dateModified: '${a.dateModified}',
    readingTime: ${a.readingTime},
    featured: ${a.featured},
  }`).join(',\n')}
];
`;

fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');

console.log(`\n✅ ${articles.length} articles migrés vers articles-generated.ts`);
console.log('\n📝 Prochaines étapes:');
console.log('   1. Vérifiez src/data/articles-generated.ts');
console.log('   2. Testez en local: npm run dev');
console.log('   3. Si OK, supprimez le dossier content/');
