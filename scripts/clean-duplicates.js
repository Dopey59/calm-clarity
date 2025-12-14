#!/usr/bin/env node

/**
 * Script de nettoyage des articles dupliqués
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filesToDelete = [
  'content/articles/anxiete/anxiete-de-performance-7-strategies-scientifiquement-prouvees.mdx',
  'content/articles/anxiete/anxiete-de-performance-comment-surmonter-la-peur-de-l-echec-et-retrouver-confiance-en-soi.mdx'
];

console.log('🧹 Nettoyage des articles dupliqués\n');

filesToDelete.forEach(file => {
  const filepath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    console.log(`✅ Supprimé: ${file}`);
  } else {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
  }
});

console.log('\n✨ Nettoyage terminé!');
console.log('\n⚠️  N\'oubliez pas de régénérer l\'index avec: npm run build-index');
