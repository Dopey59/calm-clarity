#!/usr/bin/env node

/**
 * Script de suppression finale - Supprime les 5 articles sans contenu
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🗑️  Suppression des articles sans contenu...\n');

// Articles sans contenu identifiés
const emptyArticles = [
  'content/articles/anxiete/boule-dans-la-gorge-causes-solutions.mdx',
  'content/articles/anxiete/difference-stress-anxiete.mdx',
  'content/articles/anxiete/douleurs-thoraciques-stress.mdx',
  'content/articles/stress/meditation-debutants-stress.mdx',
  'content/articles/stress/sommeil-stress-solutions.mdx',
];

let deleted = 0;

emptyArticles.forEach(file => {
  const filepath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filepath)) {
    console.log(`❌ Suppression: ${file}`);
    fs.unlinkSync(filepath);
    deleted++;
  } else {
    console.log(`⚠️  Déjà supprimé: ${file}`);
  }
});

console.log(`\n✅ ${deleted} articles vides supprimés!\n`);

// Régénérer l'index
console.log('🔄 Régénération de l\'index...\n');

try {
  execSync('npm run build-index', { stdio: 'inherit' });
  
  console.log('\n🎉 TERMINÉ !');
  console.log('\nVérifiez que vous voyez:');
  console.log('   ✅ Total articles: 7');
  console.log('   ✅ Avec contenu: 7');
  console.log('');
  console.log('📝 Ensuite:');
  console.log('   git add .');
  console.log('   git commit -m "FINAL FIX: Remove 5 empty articles"');
  console.log('   git push');
  console.log('\n✨ Articles visibles dans 2-3 minutes !');
  
} catch (error) {
  console.error('\n❌ Erreur lors de la régénération:', error.message);
  process.exit(1);
}
