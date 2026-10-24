# sophielogo.be

Site de Sophie Lenaerts, logopède. Site statique [Eleventy](https://www.11ty.dev/) 3, contenus en Markdown.

## Développer

```
npm install
npx @11ty/eleventy --serve   # aperçu local
npx @11ty/eleventy           # compile dans _site/
```

## Déploiement

- `dev` → https://dev.sophielogo.be
- `main` → https://sophielogo.be

GitHub Actions (`.github/workflows/deploy.yml`) compile le site et l'envoie sur le VPS.

## Édition des contenus (Sveltia CMS)

1. Se connecter sur github.com avec le compte `soph64k`.
2. Créer un jeton **classique** : Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic). Nom : « Site sophie », expiration au choix (par exemple 1 an). Cocher seulement **public_repo** (suffisant, le dépôt est public, et plus restreint que `repo`). Générer, puis copier le jeton : il ne s'affiche qu'une fois.
3. Ouvrir https://dev.sophielogo.be/admin/ et choisir « Se connecter avec un jeton d'accès personnel », puis coller le jeton.
4. Écrire ou modifier un article, une fiche jeu ou une page, puis publier : l'enregistrement crée un commit sur `dev` et le site dev se met à jour en une ou deux minutes.

La mise en ligne sur sophielogo.be (branche `main`) se fait ensuite en fusionnant `dev`.

Voir `CLAUDE.md` et `PRODUCT.md` pour le contexte et les décisions de design.
