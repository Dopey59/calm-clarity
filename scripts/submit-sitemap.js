#!/usr/bin/env node

/**
 * Script de soumission automatique du sitemap à Google Search Console
 * Utilise l'API Google Search Console pour informer Google des mises à jour
 * Usage: GOOGLE_SEARCH_CONSOLE_CREDENTIALS=base64_json node scripts/submit-sitemap.js
 */

import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const SITE_URL = 'https://calmeclair.com/';
const SITEMAP_URL = 'https://calmeclair.com/sitemap.xml';

async function submitSitemap() {
  try {
    console.log('🚀 Démarrage de la soumission du sitemap à Google Search Console\n');
    
    // Vérifier que les credentials sont présents
    if (!process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS) {
      throw new Error('❌ GOOGLE_SEARCH_CONSOLE_CREDENTIALS manquant dans les variables d\'environnement');
    }
    
    // Décoder les credentials depuis la variable d'environnement (base64)
    const credentialsJson = Buffer.from(
      process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS,
      'base64'
    ).toString('utf-8');
    
    const credentials = JSON.parse(credentialsJson);
    
    console.log('✅ Credentials chargés');
    console.log(`📧 Service Account: ${credentials.client_email}\n`);
    
    // Créer le client JWT pour l'authentification
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/webmasters'],
    });
    
    console.log('🔐 Authentification en cours...');
    await client.authorize();
    console.log('✅ Authentification réussie\n');
    
    // Créer le service Search Console
    const searchconsole = google.searchconsole({
      version: 'v1',
      auth: client,
    });
    
    // Soumettre le sitemap
    console.log(`📤 Soumission du sitemap à Google...`);
    console.log(`   Site: ${SITE_URL}`);
    console.log(`   Sitemap: ${SITEMAP_URL}\n`);
    
    await searchconsole.sitemaps.submit({
      siteUrl: SITE_URL,
      feedpath: SITEMAP_URL,
    });
    
    console.log('✅ ✅ ✅ SUCCÈS ! ✅ ✅ ✅');
    console.log('📍 Sitemap soumis avec succès à Google Search Console');
    console.log('⏱️  Google va crawler le sitemap dans les prochaines heures');
    console.log('🔍 Vérifiez dans Google Search Console > Sitemaps\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR lors de la soumission du sitemap:');
    
    if (error.message.includes('GOOGLE_SEARCH_CONSOLE_CREDENTIALS')) {
      console.error('   → Variable d\'environnement manquante');
      console.error('   → Ajoutez GOOGLE_SEARCH_CONSOLE_CREDENTIALS dans GitHub Secrets');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   → Problème de connexion réseau');
    } else if (error.message.includes('permission')) {
      console.error('   → Le Service Account n\'a pas les permissions nécessaires');
      console.error('   → Vérifiez qu\'il est bien ajouté comme "Owner" dans Google Search Console');
    } else {
      console.error('   →', error.message);
    }
    
    console.error('\n📚 Consultez le guide GUIDE_AUTOMATISATION_SITEMAP.md pour plus d\'aide\n');
    process.exit(1);
  }
}

submitSitemap();
