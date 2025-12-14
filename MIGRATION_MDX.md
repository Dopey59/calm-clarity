# 🚀 Migration vers Architecture MDX

Cette branche contient la nouvelle architecture MDX pour CalmeClair.

## 📁 Nouvelle Structure

```
calm-clarity/
├── content/
│   └── articles/
│       ├── anxiete/          ← Articles anxiété (fichiers .mdx)
│       ├── stress/           ← Articles stress (fichiers .mdx)
│       └── _index.json       ← Index généré automatiquement
│
├── scripts/
│   ├── migrate-to-mdx.js     ← Migration automatique
│   ├── generate-article-mdx.js ← Générateur d'articles
│   └── build-index.js        ← Générateur d'index
│
└── src/
    └── lib/
        └── articles.ts       ← Fonctions de chargement
```

## ✅ Ce qui a été fait

- ✅ Structure de dossiers créée
- ✅ Scripts de migration et génération
- ✅ Exemples d'articles MDX
- ✅ Documentation complète

## 📋 Prochaines étapes

### 1. Installer les dépendances

```bash
npm install gray-matter@4.0.3 @mdx-js/react@3.0.0 @mdx-js/rollup@3.0.0 remark-gfm@4.0.0
```

### 2. Migrer les articles existants

Deux options :

**Option A : Migration manuelle simple**

Copiez le contenu de chaque article de `src/data/articles.ts` dans des fichiers `.mdx` séparés dans `content/articles/anxiete/` ou `content/articles/stress/`.

Format d'un fichier MDX :
```mdx
---
id: "1"
slug: "mon-article"
title: "Mon Article"
excerpt: "..."
category: "anxiete"
# ... autres métadonnées
---

# Contenu de l'article

...
```

**Option B : Script automatique** (nécessite Node.js en local)

```bash
# Depuis la racine du projet
node scripts/migrate-to-mdx.js
```

### 3. Générer l'index

```bash
node scripts/build-index.js
```

### 4. Mettre à jour package.json

Ajoutez ces dépendances :

```json
{
  "dependencies": {
    "gray-matter": "^4.0.3",
    "@mdx-js/react": "^3.0.0"
  },
  "devDependencies": {
    "@mdx-js/rollup": "^3.0.0",
    "remark-gfm": "^4.0.0"
  }
}
```

### 5. Configurer Vite pour MDX

Créez/modifiez `vite.config.ts` :

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  plugins: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
    }),
  ],
});
```

### 6. Mettre à jour src/lib/articles.ts

Remplacez le système actuel par les fonctions de chargement MDX.

Exemple :

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getArticleBySlug(slug: string) {
  // Chercher dans anxiete et stress
  const categories = ['anxiete', 'stress'];
  
  for (const category of categories) {
    const filePath = path.join('content/articles', category, `${slug}.mdx`);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const { data, content: markdown } = matter(content);
      
      return {
        meta: data,
        content: markdown
      };
    }
  }
  
  return null;
}

export async function getAllArticles() {
  // Lire l'index pré-généré
  const index = JSON.parse(
    fs.readFileSync('content/_index.json', 'utf8')
  );
  return index;
}
```

### 7. Tester

```bash
npm run dev
# Vérifier que les articles s'affichent correctement
```

### 8. Déployer

```bash
npm run build
# Puis déployer sur Vercel
```

## 🎯 Avantages

- ✅ Un fichier = un article (facile à maintenir)
- ✅ Scalable à 1000+ articles
- ✅ Build incrémentiel rapide
- ✅ Lazy loading automatique
- ✅ Pas de conflits Git
- ✅ Meilleur SEO

## ❓ Questions ?

Consultez la documentation complète ou demandez de l'aide !

## 🔄 Workflow automatisé

Le workflow GitHub Actions a été adapté pour générer automatiquement des articles MDX (2 par jour).

---

**Note** : Cette migration améliore drastiquement la maintenabilité et les performances. Le fichier `articles.ts` de 131KB devient inutile après migration.
