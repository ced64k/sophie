# sophielenaerts.be

Site de Sophie Lenaerts, logopède. Eleventy 2 (site statique), sources Markdown. Le projet se poursuit
surtout depuis un iPad, en session Claude Code cloud : pas d'accès SSH au VPS, tout passe par GitHub.

- Réponses en français, avec tutoiement.
- Contexte produit : [PRODUCT.md](PRODUCT.md). Direction visuelle validée : [.impeccable/surfaces/pages-home-md.md](.impeccable/surfaces/pages-home-md.md).
- Skills du dépôt : `impeccable` (design) et `ui-ux-pro-max`, dans `.claude/skills/`.

## Déploiement

- Travailler sur la branche `dev` : chaque push publie sur https://dev.sophielenaerts.be.
- `main` = production (https://sophielenaerts.be). Fusionner `dev` dans `main` seulement quand l'utilisateur valide le site dev.
- GitHub Actions (`.github/workflows/deploy.yml`) compile et envoie le site par rsync sur le VPS Infomaniak
  (`/var/www/sophie` pour main, `/var/www/devsophie` pour dev). Les secrets SSH sont dans GitHub, pas dans le dépôt.
- Vérifier un déploiement : `gh run list -R ced64k/sophie -L 3`.
- Compiler en local : `npm install` puis `npx @11ty/eleventy` (sortie dans `_site/`).

## Décisions de design (ne pas rouvrir sans demande)

- Direction « boîte de jeu », palette « vert tapis de jeu » : vert #17734A sur fond orange #FF8A3D, contours noirs, livrets blancs, bouton rose #C92E63, jeton bleu « Jeux en ligne ».
- **Ni pions ni dés** : refusés par l'utilisateur. Les domaines sont repérés par une pastille ronde de couleur à côté de leur nom.
- Polices hébergées dans `static/fonts/` : Bricolage Grotesque (titres), Atkinson Hyperlegible (texte, choisie pour la lisibilité / dyslexie).
- Le « couvercle » = le premier écran vert de l'accueil (nom de travail, jamais affiché).
- Tous les contenus existants sont conservés ; les URL des articles (`/AAAA/MM/JJ/slug/`) et des fiches (`/slug/`) ne changent pas.

## Organisation du code

- Données : `_data/domaines.json` (6 domaines, couleurs), `_data/lieux.json` (Elouges, Ath), `_data/classement.json`
  (catégories WordPress des articles → domaines, publics, thèmes). Ne pas nommer une donnée globale `categories` :
  elle écraserait le champ `categories` des articles.
- Les domaines d'une fiche jeu sont déduits de ses titres `##` (filtres dans `.eleventy.js`).
- Styles : un seul fichier `_includes/assets/css/site.css`, inliné dans la page. Filtres : `_includes/assets/js/filtres.js`.
- Les valeurs `metaDescription` contenant « : » doivent être entre guillemets (YAML).

## Reste à faire

1. **Formulaire de contact** : envoie via FormSubmit vers lenaerts.sophie@gmail.com. Au premier envoi, FormSubmit envoie un e-mail de confirmation à Sophie : elle doit cliquer dessus. Les coordonnées des lieux (`_data/lieux.json`, Up-toi en premier) sont réelles.
3. **Sveltia CMS** : en place (`admin/`, branche `dev`, jeton d'accès personnel GitHub). À tester par Sophie sur dev.sophielenaerts.be/admin/.
4. **Images** : `static/img` fait 228 Mo, surtout des déclinaisons WordPress (`-150x150`, `-300x167`…) inutilisées. Trier en vérifiant chaque référence.
5. Photos de Concept Kids et Cuisto Dingo : en place.
6. Redirections des anciennes pages `/authors/…` vers `/qui-suis-je/` (nécessite nginx, donc depuis le Mac).
7. Fin du parcours Impeccable : relecture finale (agent `impeccable-finish-reviewer`) puis DESIGN.md (agent `impeccable-documenter`).
