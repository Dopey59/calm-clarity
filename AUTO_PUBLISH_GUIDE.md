# 🤖 Guide de Publication Automatique d'Articles

Ce guide explique comment configurer la publication automatique de 2 articles par jour sur CalmeClair.

---

## 📋 Vue d'ensemble

Le système fonctionne avec :
- **GitHub Actions** : Automatisation gratuite (2000 min/mois)
- **API Claude** : Génération d'articles de qualité
- **Vercel** : Déploiement automatique après chaque commit

**Coût : 0€** (tout est gratuit dans les limites d'usage raisonnables)

---

## 🚀 Configuration (5 minutes)

### ÉTAPE 1 : Obtenir une clé API Claude

1. Aller sur https://console.anthropic.com/
2. Se connecter avec votre compte
3. Aller dans "API Keys"
4. Créer une nouvelle clé → Copier la clé (format: `sk-ant-...`)

**Coût estimé :** 
- ~$0.50 par article (2500 mots)
- 2 articles/jour × 30 jours = **~$30/mois**

### ÉTAPE 2 : Ajouter la clé dans GitHub Secrets

1. Aller sur votre repo GitHub : https://github.com/Dopey59/calm-clarity
2. Cliquer sur **Settings** (en haut)
3. Dans le menu de gauche : **Secrets and variables** → **Actions**
4. Cliquer sur **New repository secret**
5. Nom : `ANTHROPIC_API_KEY`
6. Value : Coller votre clé API (sk-ant-...)
7. Cliquer sur **Add secret**

✅ Votre clé est maintenant sécurisée !

### ÉTAPE 3 : Créer le workflow GitHub Actions

Créez le fichier `.github/workflows/auto-publish-articles.yml` avec ce contenu :

```yaml
name: Auto-générer et publier articles

on:
  schedule:
    # Exécution 2 fois par jour : 9h et 15h (heure de Paris)
    - cron: '0 8 * * *'  # 9h Paris (8h UTC en hiver)
    - cron: '0 14 * * *' # 15h Paris (14h UTC en hiver)
  
  # Permet le déclenchement manuel
  workflow_dispatch:

jobs:
  generate-and-publish-article:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate new article
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npm run generate-article
      
      - name: Commit and push new article
        run: |
          git config user.name "CalmeClair Bot"
          git config user.email "bot@calmeclair.com"
          git add src/data/articles.ts
          
          if git diff --staged --quiet; then
            echo "Aucun nouvel article généré"
            exit 0
          fi
          
          git commit -m "🤖 Publication automatique d'un nouvel article"
          git push
```

**Comment créer ce fichier :**

```bash
# Depuis votre terminal local
mkdir -p .github/workflows
nano .github/workflows/auto-publish-articles.yml
# Coller le contenu ci-dessus
# Ctrl+O pour sauvegarder, Ctrl+X pour quitter

git add .github/workflows/auto-publish-articles.yml
git commit -m "ci: Ajouter workflow de publication automatique"
git push
```

---

## ✅ Test Manuel (avant d'activer l'automatisation)

Testez d'abord manuellement :

```bash
# Sur votre machine locale
export ANTHROPIC_API_KEY="votre-cle-api"
npm run generate-article
```

Cela devrait :
1. ✅ Générer un article de 2500+ mots
2. ✅ L'ajouter à `src/data/articles.ts`
3. ✅ Afficher l'URL du nouvel article

---

## 🎯 Déclenchement Manuel depuis GitHub

Vous pouvez aussi déclencher manuellement :

1. Aller sur https://github.com/Dopey59/calm-clarity/actions
2. Cliquer sur "Auto-générer et publier articles"
3. Cliquer sur "Run workflow"
4. Choisir la branche "main"
5. Cliquer sur "Run workflow"

---

## 📊 Suivi et Monitoring

### Vérifier les exécutions

1. https://github.com/Dopey59/calm-clarity/actions
2. Voir l'historique des workflows
3. Cliquer sur une exécution pour voir les logs

### Notifications en cas d'échec

GitHub vous enverra un email si le workflow échoue.

---

## ⚙️ Personnalisation

### Changer la fréquence de publication

Modifier les lignes `cron:` dans le workflow :

```yaml
# 1 fois par jour à 10h
- cron: '0 9 * * *'

# 3 fois par jour : 9h, 14h, 18h
- cron: '0 8 * * *'
- cron: '0 13 * * *'
- cron: '0 17 * * *'

# Tous les jours de la semaine (lundi-vendredi) à 9h
- cron: '0 8 * * 1-5'
```

### Ajouter plus de sujets d'articles

Modifier `scripts/generate-article.js`, section `ARTICLE_TOPICS` :

```javascript
const ARTICLE_TOPICS = [
  "Votre nouveau sujet 1",
  "Votre nouveau sujet 2",
  // ... ajoutez autant de sujets que vous voulez
];
```

### Changer la longueur des articles

Modifier le prompt dans `scripts/generate-article.js` :

```javascript
// Pour des articles plus longs
"Ton article DOIT contenir entre 3500-4500 mots"

// Pour des articles plus courts
"Ton article DOIT contenir entre 1500-2000 mots"
```

---

## 🔒 Sécurité

✅ **Bonnes pratiques :**
- Clé API stockée dans GitHub Secrets (chiffrée)
- Clé jamais visible dans les logs
- Accès limité au workflow

⚠️ **Ne JAMAIS :**
- Commiter votre clé API dans le code
- Partager votre clé API
- Afficher la clé dans les logs

---

## 💰 Estimation des Coûts

### API Claude (Claude Sonnet 4)

- **Input** : ~$3 / 1M tokens
- **Output** : ~$15 / 1M tokens

**Par article :**
- Input : ~5000 tokens = $0.015
- Output : ~15000 tokens (2500 mots) = $0.225
- **Total : ~$0.24 par article**

**Par mois (60 articles) :**
- 60 articles × $0.24 = **~$14.40/mois**

### GitHub Actions

- **Gratuit** : 2000 minutes/mois
- Chaque exécution : ~2 minutes
- 60 exécutions/mois = 120 minutes
- **Coût : 0€**

### Vercel

- **Gratuit** : 100 GB bande passante/mois
- **Coût : 0€**

**TOTAL : ~$15/mois** pour 60 articles automatiques

---

## 🎯 Workflow Complet

```
Chaque jour à 9h et 15h :
  ↓
1. GitHub Actions démarre
  ↓
2. Script génère un article via API Claude
  ↓
3. Article ajouté à articles.ts
  ↓
4. Commit + Push automatique
  ↓
5. Vercel détecte le changement
  ↓
6. Déploiement automatique (2-3 min)
  ↓
7. Article visible sur calmeclair.com
```

---

## 🐛 Résolution de Problèmes

### "ANTHROPIC_API_KEY manquant"
→ Vérifier que le secret est bien ajouté dans GitHub Settings → Secrets

### "npm ci failed"
→ Vérifier que package.json contient `@anthropic-ai/sdk`

### "Impossible de push"
→ Vérifier les permissions du workflow dans Settings → Actions → General

### Article non généré
→ Vérifier les logs dans Actions → Cliquer sur l'exécution échouée

---

## 📚 Ressources

- **API Claude** : https://docs.anthropic.com/
- **GitHub Actions** : https://docs.github.com/en/actions
- **Cron syntax** : https://crontab.guru/

---

## 🎉 C'est Tout !

Une fois configuré, votre site publiera automatiquement 2 articles par jour sans intervention manuelle !

**Questions ?** Consultez les logs dans GitHub Actions ou contactez le support.

Dernière mise à jour : 13 décembre 2024
