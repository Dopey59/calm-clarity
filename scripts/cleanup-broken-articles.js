#!/usr/bin/env node

/**
 * Script de nettoyage des articles cassés (frontmatter tronqué)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Articles cassés identifiés (< 1000 bytes)
const brokenFiles = [
  'content/articles/anxiete/anxiete-anticipatoire-7-methodes-pour-arreter-de-sinquieter.mdx',
  'content/articles/anxiete/anxiete-de-performance-7-strategies-scientifiquement-prouvees.mdx',
  'content/articles/anxiete/anxiete-sociale-conseils.mdx',
  'content/articles/anxiete/exercices-respiration-anxiete.mdx',
  'content/articles/anxiete/gerer-crise-anxiete-7-etapes.mdx'
];

console.log('🧹 Nettoyage des articles cassés...\n');

let deleted = 0;

brokenFiles.forEach(file => {
  const filepath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    console.log(`❌ ${file} (${stats.size} bytes)`);
    fs.unlinkSync(filepath);
    deleted++;
  } else {
    console.log(`⚠️  Déjà supprimé: ${file}`);
  }
});

console.log(`\n✅ ${deleted} articles cassés supprimés!`);
console.log('\n⚠️  N\'oubliez pas de régénérer l\'index: npm run build-index');
