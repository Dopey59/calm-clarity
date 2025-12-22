#!/usr/bin/env node

/**
 * Script pour BLOQUER les publications jusqu'au 30 décembre
 * Version ES Module (compatible avec "type": "module")
 */

import fs from 'fs';

console.log('=== CORRECTION keywords.json - Blocage jusqu au 30 decembre ===\n');

// Charger keywords.json
const keywords = JSON.parse(fs.readFileSync('keywords.json', 'utf8'));

// Date d'aujourd'hui
const today = new Date().toISOString().split('T')[0];
console.log('Date aujourdhui : ' + today);

// Date de déblocage (lundi 30 décembre 2024)
const unblockDate = '2024-12-30';
console.log('Date deblocage : ' + unblockDate + '\n');

// Compter articles publiés aujourd'hui
const allArticles = [
  ...keywords.stress.piliers,
  ...keywords.stress.satellites,
  ...keywords.anxiete.piliers,
  ...keywords.anxiete.satellites
];

const todayPublished = allArticles.filter(a => 
  a.status === 'done' && 
  a.publishedAt && 
  a.publishedAt.startsWith(today)
);

console.log('Articles publies aujourdhui : ' + todayPublished.length);
todayPublished.forEach(a => console.log('   - ' + a.keyword + ' (' + a.id + ')'));

if (todayPublished.length === 0) {
  console.log('\nAucun article publie aujourdhui. Rien a corriger.');
  process.exit(0);
}

// AJOUTER un flag de blocage temporaire
keywords._publishingBlocked = {
  until: unblockDate,
  reason: '3 articles publies le ' + today + ' - pause jusqu au ' + unblockDate,
  articlesPublished: todayPublished.map(a => a.id)
};

console.log('\nFlag de blocage ajoute jusqu au ' + unblockDate);
console.log('   Raison : ' + keywords._publishingBlocked.reason);

// Sauvegarder
fs.writeFileSync('keywords.json', JSON.stringify(keywords, null, 2));

console.log('\nkeywords.json mis a jour !');
console.log('\n=== RESUME ===');
console.log('   - Articles aujourdhui : ' + todayPublished.length);
console.log('   - Deblocage prevu : ' + unblockDate);
console.log('   - Prochaine publication : Lundi 30 decembre 2024');
console.log('\n=== PROCHAINE ETAPE ===');
console.log('   Commit et push :');
console.log('   git add keywords.json');
console.log('   git commit -m "Pause publications jusqu au 30 decembre"');
console.log('   git push');