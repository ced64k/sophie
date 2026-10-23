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

- Direction « frimousse » (inspirée de l'identité « nook »), palette **« menthe »** : fond menthe #A3D9CB avec taches #8CC7B8, texte noir #111 (pas de gris), boutons indigo #464A96, frimousse indigo, petites touches de jaune #E4AF1A (trait sous « joue », point du logo, bandeau jeux en ligne, étiquettes) mais jamais sur la frimousse ni les boutons ; panneaux blancs très arrondis sans contour. Les noms de variables CSS sont historiques (`--cyan` = fond, `--corail` = boutons, `--jaune` = petites touches). L'ancienne boîte de jeu verte est abandonnée.
- La frimousse (`_includes/components/frimousse.njk`) : mascotte SVG (couleurs par variables `--peau-*`, `--oreille`) aux oreilles noires qui dépasse du bas de l'accueil et du haut du pied de page ; ses pupilles suivent le pointeur sur l'accueil. C'est un dessin provisoire, à remplacer par une vraie illustration si Sophie en commande une.
- Logo « sophie » en Fredoka, avec un point dans le « o ».
- Boutons : aplat plus foncé de 4 px sous chaque bouton (ombre « vectorielle », sans flou), qui s'écrase au clic.
- Accueil : un seul bouton « Prendre contact », **pas de numéros de téléphone** (ils sont dans le pied de page et sur /contact/). Le premier écran doit tenir dans la fenêtre sur ordinateur, liste des domaines comprise.
- Alignements : en-tête, accueil, bandeau et pied de page s'alignent sur la colonne de 1180px des panneaux (variable `--bord`) ; sur l'accueil, tous les textes partagent le même bord intérieur.
- Chiffres du texte courant en Fredoka (famille « Chiffres » limitée aux chiffres par `unicode-range`) et téléphones en `.tel` : le zéro barré d'Atkinson donnait un air de code.
- Mise en avant au **marqueur jaune** (trait irrégulier, légèrement penché) : sous « joue », page active du menu, liens, filtres (blanc au repos, jaune actifs), étiquettes. Pas de pilules ni de soulignement classique pour ces éléments.
- **Ni pions ni dés** : refusés par l'utilisateur. Les domaines sont repérés par une pastille ronde de couleur à côté de leur nom.
- Polices hébergées dans `static/fonts/` : Fredoka (titres), Atkinson Hyperlegible (texte, choisie pour la lisibilité / dyslexie).
- Tous les contenus existants sont conservés ; les URL des articles (`/AAAA/MM/JJ/slug/`) et des fiches (`/slug/`) ne changent pas.

## Organisation du code

- Données : `_data/domaines.json` (5 domaines, couleurs), `_data/lieux.json` (Elouges, Ath), `_data/classement.json`
  (catégories WordPress des articles → domaines, publics, thèmes). Ne pas nommer une donnée globale `categories` :
  elle écraserait le champ `categories` des articles.
- Les domaines d'une fiche jeu sont déduits de ses titres `##` (filtres dans `.eleventy.js`).
- Styles : un seul fichier `_includes/assets/css/site.css`, inliné dans la page. Filtres : `_includes/assets/js/filtres.js`.
- Les valeurs `metaDescription` contenant « : » doivent être entre guillemets (YAML).

## Reste à faire

1. **Formulaire de contact** : envoie via FormSubmit vers lenaerts.sophie@gmail.com. Au premier envoi, FormSubmit envoie un e-mail de confirmation à Sophie : elle doit cliquer dessus. Les coordonnées des lieux (`_data/lieux.json`, Up-toi en premier) sont réelles.
2. **Sveltia CMS** : en place (`admin/`, branche `dev`, jeton d'accès personnel GitHub). À tester par Sophie sur dev.sophielenaerts.be/admin/.
3. **Images** : `static/img` fait 228 Mo, surtout des déclinaisons WordPress (`-150x150`, `-300x167`…) inutilisées. Trier en vérifiant chaque référence.
4. Redirections des anciennes pages `/authors/…` vers `/qui-suis-je/` (nécessite nginx, donc depuis le Mac).
5. Relecture finale Impeccable de la version menthe avant la mise en production.
