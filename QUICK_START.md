# ⚡ Démarrage Rapide - Publication Automatique

## 🎯 Objectif

Publier automatiquement **2 articles par jour** (9h et 15h) sur CalmeClair.

---

## 🚀 Configuration en 3 étapes (5 minutes)

### ✅ ÉTAPE 1 : Obtenir une clé API Claude

1. Aller sur https://console.anthropic.com/
2. Se connecter
3. "API Keys" → "Create Key"
4. Copier la clé (format: `sk-ant-...`)

💰 **Coût estimé : ~$15/mois** pour 60 articles

---

### ✅ ÉTAPE 2 : Ajouter la clé dans GitHub

1. Aller sur https://github.com/Dopey59/calm-clarity/settings/secrets/actions
2. Cliquer sur "New repository secret"
3. Name: `ANTHROPIC_API_KEY`
4. Secret: Coller votre clé API
5. "Add secret"

---

### ✅ ÉTAPE 3 : Activer le workflow

**Option A - Via l'interface GitHub (recommandé) :**

1. Aller sur https://github.com/Dopey59/calm-clarity
2. Cliquer sur "Add file" → "Create new file"
3. Nom du fichier : `.github/workflows/auto-publish-articles.yml`
4. Copier-coller le contenu du fichier `.github-workflow-template.yml`
5. Cliquer sur "Commit new file"

**Option B - En ligne de commande :**

```bash
# Créer le dossier
mkdir -p .github/workflows

# Copier le template
cp .github-workflow-template.yml .github/workflows/auto-publish-articles.yml

# Commit et push
git add .github/workflows/auto-publish-articles.yml
git commit -m "ci: Activer publication automatique d'articles"
git push
```

---

## ✅ C'est tout ! 🎉

Le système est maintenant actif et publiera automatiquement :
- **1 article à 9h** chaque jour
- **1 article à 15h** chaque jour

---

## 🧪 Test Manuel (optionnel)

Avant d'attendre l'exécution automatique, testez manuellement :

1. Aller sur https://github.com/Dopey59/calm-clarity/actions
2. Cliquer sur "Auto-générer et publier articles"
3. Cliquer sur "Run workflow" → "Run workflow"
4. Attendre 2-3 minutes
5. Vérifier qu'un nouvel article apparaît dans `src/data/articles.ts`

---

## 📊 Que se passe-t-il ensuite ?

```
Chaque jour à 9h et 15h :
  1. GitHub Actions démarre
  2. Claude génère un article (2500+ mots)
  3. Article ajouté automatiquement
  4. Commit + Push
  5. Vercel déploie (2-3 min)
  6. Article visible sur calmeclair.com
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **AUTO_PUBLISH_GUIDE.md** - Guide complet
- **scripts/generate-article.js** - Script de génération

---

## 🎯 Prochaines Étapes

1. ✅ Attendez la première publication (9h ou 15h)
2. ✅ Vérifiez dans GitHub Actions que ça fonctionne
3. ✅ Vérifiez que l'article apparaît sur le site
4. ✅ Personnalisez les sujets dans `scripts/generate-article.js` si souhaité

---

**Questions ?** Consultez AUTO_PUBLISH_GUIDE.md ou les logs dans GitHub Actions.

Dernière mise à jour : 13 décembre 2024
