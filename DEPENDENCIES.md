# Dépendances à ajouter au package.json

## Installation rapide

```bash
npm install gray-matter@4.0.3 @mdx-js/react@3.0.0 @mdx-js/rollup@3.0.0 remark-gfm@4.0.0 rehype-highlight@7.0.0
```

## À ajouter dans package.json

### Dependencies

```json
{
  "dependencies": {
    "gray-matter": "^4.0.3",
    "@mdx-js/react": "^3.0.0",
    "reading-time": "^1.5.0"
  }
}
```

### DevDependencies

```json
{
  "devDependencies": {
    "@mdx-js/rollup": "^3.0.0",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "rehype-slug": "^6.0.0"
  }
}
```

## Scripts à ajouter

```json
{
  "scripts": {
    "build-index": "node scripts/build-index.js",
    "generate-article": "node scripts/generate-article-mdx.js"
  }
}
```

## Configuration Vite

Créer ou modifier `vite.config.ts` :

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export default defineConfig({
  plugins: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

## Ordre d'installation

1. Installer les packages
2. Vérifier que package-lock.json est mis à jour
3. Commiter les changements
4. Tester avec `npm run dev`
