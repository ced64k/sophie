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

## Édition des contenus (Sveltia CMS)

1. Créer un jeton d'accès personnel GitHub (GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens), limité au dépôt `ced64k/sophie`, avec les droits **Contents : lecture et écriture**.
2. Ouvrir https://dev.sophielenaerts.be/admin/ et choisir « Se connecter avec un jeton d'accès personnel ».
3. Écrire ou modifier un article, une fiche jeu ou une page, puis publier : l'enregistrement crée un commit sur `dev` et le site dev se met à jour en une ou deux minutes.

La mise en ligne sur sophielenaerts.be (branche `main`) se fait ensuite en fusionnant `dev`.

Voir `CLAUDE.md` et `PRODUCT.md` pour le contexte et les décisions de design.
