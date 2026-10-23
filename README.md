# sophielenaerts.be

Site de Sophie Lenaerts, logopède. Site statique [Eleventy](https://www.11ty.dev/) 2, contenus en Markdown.

## Développer

```
npm install
npx @11ty/eleventy --serve   # aperçu local
npx @11ty/eleventy           # compile dans _site/
```

## Déploiement

- `dev` → https://dev.sophielenaerts.be
- `main` → https://sophielenaerts.be

GitHub Actions (`.github/workflows/deploy.yml`) compile le site et l'envoie sur le VPS.

## Édition des contenus

Sveltia CMS est disponible sur `/admin/` : articles, fiches jeux et pages, enregistrés sur la branche `dev`.

Voir `CLAUDE.md` et `PRODUCT.md` pour le contexte et les décisions de design.
