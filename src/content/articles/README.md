# Architecture SEO-optimale des articles

## Structure

```
src/content/articles/
├── anxiete/
│   ├── slug-article-1.ts
│   ├── slug-article-2.ts
│   └── ...
├── stress/
│   ├── slug-article-1.ts
│   └── ...
└── index.ts (auto-découverte)
```

## Avantages SEO

- **Structure = URL**: Fichier path = URL path
- **Crawlabilité**: Google indexe facilement l'arborescence
- **1 fichier = 1 article**: Maintenance facilitée
- **Auto-découverte**: Vite glob détecte automatiquement les nouveaux articles

## Génération

```bash
CATEGORY=anxiete TOPIC=anxiété npm run generate-article
```

Le fichier sera créé automatiquement dans `anxiete/{slug}.ts`
