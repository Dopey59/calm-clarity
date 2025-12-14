#!/usr/bin/env node

/**
 * Script de nettoyage final - Supprime les articles cassés et régénère l'index
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧹 Nettoyage des articles cassés...\n');

// Fichiers à supprimer
const brokenFiles = [
  'content/articles/stress/10-techniques-de-respiration-anti-stress-scientifiquement-prouvees.mdx',
  'content/articles/stress/alimentation-anti-stress.mdx',
  'content/articles/stress/burn-out-reconnaitre-les-7-signes-precurseurs-essentiels.mdx',
  'content/articles/anxiete/anxiete-nocturne-comprendre-et-apaiser-les-angoisses-qui-perturbent-le-sommeil.mdx',
];

let deleted = 0;

brokenFiles.forEach(file => {
  const filepath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filepath)) {
    console.log(`❌ Suppression: ${file}`);
    fs.unlinkSync(filepath);
    deleted++;
  } else {
    console.log(`⚠️  Déjà supprimé: ${file}`);
  }
});

console.log(`\n✅ ${deleted} fichiers cassés supprimés!\n`);

// Régénérer l'index
console.log('🔄 Régénération de l\'index avec le contenu...\n');

try {
  execSync('npm run build-index', { stdio: 'inherit' });
  
  console.log('\n🎉 TERMINÉ !');
  console.log('\n📝 Prochaines étapes:');
  console.log('   1. git pull');
  console.log('   2. git add .');
  console.log('   3. git commit -m "Clean: Remove broken articles and regenerate index with content"');
  console.log('   4. git push');
  console.log('\n✨ Vos articles seront visibles dans 2-3 minutes !');
  
} catch (error) {
  console.error('\n❌ Erreur lors de la régénération:', error.message);
  process.exit(1);
}
