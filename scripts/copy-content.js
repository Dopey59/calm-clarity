import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📦 Copie du dossier content/ vers dist/...');

const sourceDir = path.join(__dirname, '..', 'content');
const destDir = path.join(__dirname, '..', 'dist', 'content');

// Fonction récursive pour copier un dossier
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  if (fs.existsSync(sourceDir)) {
    copyRecursiveSync(sourceDir, destDir);
    console.log('✅ Dossier content/ copié avec succès!');
    
    // Compter les fichiers
    const anxieteFiles = fs.readdirSync(path.join(destDir, 'articles', 'anxiete')).length;
    const stressFiles = fs.readdirSync(path.join(destDir, 'articles', 'stress')).length;
    
    console.log(`   📁 Articles anxiété: ${anxieteFiles}`);
    console.log(`   📁 Articles stress: ${stressFiles}`);
    console.log(`   📊 Index: content/_index.json`);
  } else {
    console.warn('⚠️  Dossier content/ non trouvé');
  }
} catch (error) {
  console.error('❌ Erreur lors de la copie:', error);
  process.exit(1);
}
