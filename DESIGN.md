---
name: Sophie Lenaerts, logopède
description: "La logopédie, ça se joue ! Un monde rond et doux, à mascotte, sur fond menthe."
colors:
  menthe-fond: "#A3D9CB"
  menthe-tache: "#8CC7B8"
  menthe-givre: "#E6F4F0"
  indigo: "#464A96"
  indigo-fonce: "#35387A"
  jaune: "#E4AF1A"
  jaune-surligne: "#F2C94C"
  jaune-etiquette: "#F7DB84"
  encre: "#111111"
  encre-douce: "#33443F"
  blanc: "#FFFFFF"
  koala-visage: "#A5A8D5"
  koala-oreille: "#9295CA"
  domaine-precoce: "#7CC76E"
  domaine-oral: "#E8467C"
  domaine-ecrit: "#2F6BE0"
  domaine-math: "#FFD23F"
  domaine-methodo: "#FF8A3D"
typography:
  display:
    fontFamily: "Fredoka, Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, min(1.2rem + 7vw, 10.5vh), 7.2rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fredoka, Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 1.6rem + 3.6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Fredoka, Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "clamp(1.8rem, 1.3rem + 1.8vw, 2.8rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.015em"
  title-small:
    fontFamily: "Fredoka, Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + .3vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.6
  telephone:
    fontFamily: "Fredoka, Atkinson Hyperlegible, system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "0.01em"
rounded:
  pilule: "999px"
  panneau: "32px"
  petit: "20px"
  focus: "6px"
spacing:
  marge-page: "clamp(8px, 1.2vw, 16px)"
  gouttiere: "clamp(16px, 4vw, 56px)"
  espace: "clamp(16px, 2vw, 28px)"
  colonne: "1180px"
  lecture: "44rem"
components:
  button-primary:
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.blanc}"
    typography: "{typography.title-small}"
    rounded: "{rounded.pilule}"
    padding: "18px 34px"
  button-encre:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.blanc}"
    typography: "{typography.title-small}"
    rounded: "{rounded.pilule}"
    padding: "18px 34px"
  nav-pill-jeux:
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.blanc}"
    rounded: "{rounded.pilule}"
    padding: "10px 20px"
  chip-filtre:
    backgroundColor: "rgba(255, 255, 255, .55)"
    textColor: "{colors.encre}"
    typography: "{typography.label}"
    rounded: "{rounded.pilule}"
    padding: "10px 18px"
  chip-filtre-hover:
    backgroundColor: "{colors.blanc}"
  chip-filtre-active:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.blanc}"
  etiquette:
    backgroundColor: "{colors.jaune-etiquette}"
    textColor: "{colors.encre}"
    rounded: "{rounded.pilule}"
    padding: "2px 12px"
  panneau-livret:
    backgroundColor: "{colors.blanc}"
    textColor: "{colors.encre}"
    rounded: "{rounded.panneau}"
    padding: "clamp(28px, 5vw, 72px) clamp(16px, 4vw, 56px)"
  carte-fiche:
    backgroundColor: "{colors.blanc}"
    textColor: "{colors.encre}"
    rounded: "{rounded.petit}"
  bandeau-jeux:
    backgroundColor: "{colors.jaune}"
    textColor: "{colors.encre}"
    rounded: "{rounded.panneau}"
  champ:
    backgroundColor: "{colors.menthe-givre}"
    textColor: "{colors.encre}"
    rounded: "{rounded.petit}"
    padding: "14px 18px"
  champ-focus:
    backgroundColor: "{colors.blanc}"
  pied:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.blanc}"
    rounded: "{rounded.panneau}"
---

# Design System: Sophie Lenaerts, logopède

## Overview

**Creative North Star: "La frimousse"**

Le site est doux, rond et curieux, comme l'identité d'une marque de livres jeunesse : une mascotte indigo aux oreilles noires dépasse du bas de l'accueil et du haut du pied de page, et regarde le visiteur. Tout est rond (pilules, panneaux très arrondis, taches de fond), posé à plat sur un grand fond menthe, avec un texte noir franc, un accent indigo pour agir et quelques petites touches de jaune.

La densité reste basse : grands titres en Fredoka, lecture en Atkinson Hyperlegible dans des panneaux blancs sans contour, une colonne de 1180 px. Le mouvement est rare et doux : la frimousse monte une fois à l'arrivée, ses pupilles suivent le pointeur, les cartes se soulèvent en penchant à peine. Le site refuse le cabinet pastel « portrait + grille de services » et l'ancienne boîte de jeu verte.

Une seule palette, **menthe**, définie dans `:root`. Les noms de variables sont historiques (vestiges d'une palette cyan corail abandonnée) : `--cyan` est le fond, `--corail` l'accent des boutons, `--jaune` les petites touches. Les composants n'utilisent que les variables, jamais les valeurs.

**Key Characteristics:**
- Fond menthe plein avec de grandes taches ovales d'une menthe plus soutenue.
- Texte noir franc ; un accent indigo réservé aux actions et à la mascotte.
- Petites touches de jaune (fond jaune du « o » du logo, trait sous « joue », bandeau, étiquettes, page active), jamais sur la mascotte ni les boutons.
- Panneaux blancs très arrondis, sans contour, pour la lecture.
- Domaines repérés par leur nom surligné au marqueur dans leur couleur ; sur les cartes de fiches, par une petite tache de couleur.
- Boutons pilules posés sur un aplat plus foncé de 4 px qui s'écrase au clic.
- Mascotte « frimousse » en SVG, dessin provisoire en attendant une vraie illustration.

## Colors

Un fond frais et doux, de l'encre noire, un indigo qui fait agir et un jaune qui ponctue.

### Primary
- **Indigo** (indigo, variable `--corail`) : fond des boutons d'action et de la pilule « Jeux en ligne » ; puces de liste dans les textes ; bordure des champs invalides ; curseur de saisie et `accent-color` ; dernier arrêt du dégradé de la frimousse.
- **Indigo nuit** (indigo-fonce, `--corail-fonce`) : l'aplat de 4 px sous les boutons indigo ; couleur des liens dans les textes et des liens forts (« Mon parcours », « Tous les articles »), et du titre d'article au survol.

### Secondary
- **Jaune d'or** (jaune, `--jaune`, `--point`, `--souligne-lien`, `--corail-vif`) : fond jaune du « o » du logo, trait sous la page active du menu, fond du bandeau « Jeux en ligne » (texte encre), soulignement des liens forts, aplat d'une fiche sans image sur deux.
- **Jaune surligné** (jaune-surligne, `--surligne`, `--selection`, `--pied-survol`) : trait sous « joue » dans le titre d'accueil, sélection de texte (texte encre), liens du pied au survol.
- **Jaune paille** (jaune-etiquette, `--etiquette`) : fond des étiquettes d'articles.

### Tertiary
- **Lavande** (koala-visage, koala-oreille, koala-creux) et **Bleu nuit** (koala-oeil) : les couleurs du koala. Réservées à la mascotte.
- **Couleurs des domaines** (domaine-precoce, domaine-oral, domaine-ecrit, domaine-math, domaine-methodo), définies dans `_data/domaines.json` et passées en `--puce` : elles n'apparaissent que dans le marqueur sous le nom du domaine (mélangées à du blanc) et dans les taches des cartes de fiches, jamais en fond de surface ni en texte.

### Neutral
- **Menthe** (menthe-fond, `--cyan`) : fond de toute la page et couleur de thème du navigateur.
- **Menthe tache** (menthe-tache, `--cyan-fort`) : les grandes taches ovales de l'accueil, contour des champs au survol, une fiche sans image sur deux.
- **Menthe givrée** (menthe-givre, `--cyan-pale`) : intérieur des panneaux blancs (fond des champs, citations, sommaire de fiche, fond d'image en attente) et filets de séparation de 2 px entre articles, domaines et lieux.
- **Encre** (encre) : tout le texte, le logo, les oreilles, les pupilles, le pied de page, l'anneau de focus, le filtre actif, le bouton secondaire.
- **Encre douce** (encre-douce) : texte secondaire seulement (auteur, métadonnées et extraits d'articles, descriptions de domaines, aides de formulaire).
- **Blanc** (blanc) : panneaux de lecture, cartes de fiches, texte sur indigo et sur encre.


### Named Rules
**La règle de l'accent unique.** Une seule couleur pour agir : l'indigo. Boutons, pilule de navigation et mascotte la partagent ; rien d'autre ne la prend en fond.

**La règle des touches jaunes.** Le jaune ponctue (point, trait, bandeau, étiquette, sélection), il ne touche jamais la frimousse ni les boutons, et porte toujours du texte encre.

**La règle de l'encre franche.** Le texte principal est noir (encre), sur menthe comme sur blanc. L'encre douce est réservée au texte secondaire ; aucun autre gris dans le contenu.

**La règle des variables.** Une surface nouvelle utilise les variables (`--cyan`, `--cyan-fort`, `--cyan-pale`, `--corail`, `--corail-fonce`, `--jaune`, `--point`, `--etiquette`, `--surligne`…) et jamais les hex. Les noms sont historiques et ne disent pas la couleur.

## Typography

**Display Font:** Fredoka (avec Atkinson Hyperlegible, system-ui), auto-hébergée, graisse variable 300–700
**Body Font:** Atkinson Hyperlegible (avec system-ui), auto-hébergée en 400, 400 italique et 700

**Character:** Une ronde dodue pour tout ce qui se lit d'un coup d'œil (titres, logo, boutons, noms de fiches, numéros), une humaniste conçue pour la lisibilité (et les lecteurs dyslexiques) pour tout ce qui se lit vraiment.

### Hierarchy
- **Display** : uniquement le titre de l'accueil, centré, au plus 11ch, incliné de -2° ; sa taille suit aussi la hauteur de fenêtre (10.5vh) pour que le premier écran tienne.
- **Headline** : h1 des pages intérieures.
- **Title** : h2 de section (« Les règles du jeu », « Derniers articles »…) ; dans un texte long, h2 réduit à clamp(1.5rem, 1.2rem + 1vw, 2.1rem).
- **Title small** (Fredoka 600, 1.3–1.55rem, interligne 1.05–1.15) : boutons, noms de fiches (1.5rem), titres d'articles (clamp 1.35–1.8rem), noms de domaines (1.55rem), structures, villes, titres du pied, h3 (1.4rem).
- **Body** : Atkinson 400, interligne 1.6, lecture plafonnée à 44rem (62rem pour les listes d'articles), intros à 52–60ch.
- **Label** : Atkinson 700, 1rem pour les filtres et la navigation ; 0.85rem pour les étiquettes, 0.95rem pour les métadonnées.

### Named Rules
**La règle du zéro rond.** Tous les chiffres du texte courant viennent de Fredoka (famille « Chiffres », `unicode-range: U+0030-0039`, placée en tête de `--texte`) : le zéro barré d'Atkinson faisait lire dates, codes postaux et numéros comme du code. Les numéros de téléphone sont en plus en Fredoka 600 (`.tel`).

**La règle du marqueur.** Ce qui est mis en avant est surligné au marqueur jaune (ou au blanc translucide pour les filtres au repos) : trait sous « joue », page active du menu, liens, filtres, étiquettes. Bord irrégulier (rayons inégaux) et légère inclinaison (±1°), jamais de pilule pour ces éléments, jamais de soulignement classique.

**La règle du gras qui porte.** Liens de navigation, filtres, liens de texte et domaines sont en gras 700 ; la hiérarchie passe par la graisse et la police, pas par la couleur.

## Layout

Une colonne centrale de 1180 px. Le corps a une marge de page (marge-page) tout autour ; les panneaux ont une gouttière intérieure (gouttiere) et sont séparés verticalement par un espace (espace). L'en-tête, l'accueil et le pied alignent leur bord sur celui des panneaux grâce à `--bord: max(gouttière, (100% - 1180px) / 2)`. Toutes les tailles et espacements sont des `clamp()` fluides plutôt que des paliers.

Les pages alternent deux plans : des **livrets** (panneau blanc arrondi, texte centré dans 44rem) et des **sections posées directement sur le fond** (fiches jeux, filtres), dont le texte reste à gauche dans la colonne. Sur l'accueil, tous les textes partagent le même bord gauche intérieur.

Premier écran de l'accueil : sur ordinateur il tient dans la fenêtre (min(100svh, 1100px)), tailles et espaces suivent la hauteur ; grille trois colonnes en bas (domaines à gauche, frimousse au centre, structures à droite, alignées en bas), la frimousse passant derrière le panneau suivant. Sous 860 px, la frimousse suit le bouton et se cache derrière un panneau blanc qui regroupe domaines et structures ; sous 520 px, boutons pleine largeur et une seule colonne.

Grilles : fiches en `auto-fill, minmax(240px, 1fr)`, deux colonnes fixes sous 600 px ; articles en vignette 160 px + texte (84 px sur mobile, extrait masqué) ; contact en 0.8fr / 1.2fr, une colonne sous 760 px ; navigation repliée derrière un bouton « Menu » sous 960 px.

## Elevation & Depth

Le monde est plat : profondeur par superposition (frimousse derrière les panneaux, taches derrière le contenu) et par contraste de plans (blanc sur menthe), pas par les ombres. Deux exceptions, chacune avec un rôle précis.

### Shadow Vocabulary
- **Aplat de bouton** (`box-shadow: 0 4px 0 var(--corail-fonce)`) : sous les boutons et la pilule « Jeux en ligne », sans flou, de la même teinte en plus foncé (noir à 35 % pour le bouton encre). Au survol le bouton monte de 2 px (aplat 6 px) ; à l'appui il descend de 4 px et l'aplat tombe à 0. Demande explicite de l'utilisateur.
- **Ombre de carte** (`--ombre`, double ombre douce teintée de bleu-vert) : uniquement sur les cartes de fiches jeux (renforcée au survol) et sur le lien « suite » au survol.

### Named Rules
**La règle du bouton qu'on enfonce.** Seuls les boutons ont un aplat dur, toujours vertical, de leur propre teinte foncée, jamais décalé en diagonale ni noir sur fond clair.

**La règle des panneaux à plat.** Panneaux de lecture, bandeau et pied n'ont ni ombre ni contour.

## Shapes

Tout est rond. Trois rayons : 32 px pour les grands panneaux (livret, bandeau, pied, panneau mobile de l'accueil), 20 px pour tout ce qui vit à l'intérieur (cartes, images, champs, citations, sommaire), pilule 999 px pour tout ce qui se clique ou s'étiquette (boutons, filtres, étiquettes, lien « suite », menu, lien d'évitement). Les taches de fond sont des ovales (ratio 1.4), l'une légèrement irrégulière. Aucun contour : les séparations internes sont des filets givrés de 2 px. Les taches de domaine des cartes sont des ovales pleins légèrement irréguliers, sans contour. Les flèches de lien sont des tracés SVG à bouts ronds.

## Components

### Buttons
Charnus et tactiles, comme une touche qu'on enfonce.
- **Shape :** pilule (999 px).
- **Primaire :** indigo, texte blanc en Fredoka 600 1.3rem, 18 px × 34 px, aplat indigo nuit de 4 px.
- **Secondaire (encre) :** fond encre, aplat noir à 35 % ; utilisé sur le bandeau jaune.
- **Survol / appui :** montée de 2 px puis écrasement de 4 px, 0.15 s en `cubic-bezier(.16, 1, .3, 1)`.
- **Pilule « Jeux en ligne » :** version compacte (10 × 20 px, Atkinson 700) dans la navigation, avec flèche sortante SVG.

### Chips
- **Filtres de domaine :** libellé Atkinson 700 1rem surligné au marqueur (pseudo-élément incliné, rayons inégaux) dans la couleur du domaine mélangée à du blanc (38 %, 58 % au survol, 82 % actif). Les filtres sans domaine (« Tous », publics, « À télécharger ») ont un marqueur blanc à 55 %, blanc plein au survol, `--surligne` (jaune) actifs. Texte toujours encre.
- **Étiquettes d'articles :** Atkinson 700 0.85rem surligné au marqueur `--etiquette` (jaune paille), incliné de −1.2° (la suivante de +0.9°).

### Cards / Containers
- **Livret :** panneau blanc, rayon 32 px, sans ombre ni contour, padding fluide de 28 à 72 px.
- **Carte de fiche jeu :** blanche, rayon 20 px, image 4:3 sans marge, nom en Fredoka 1.5rem, taches de couleur des domaines en bas (chacune tournée différemment). Sans image, aplat jaune (`--corail-vif`) ou menthe tache en alternance, avec le nom en grand. Survol : monte de 6 px en penchant de -1°, l'image grossit à 104 %.
- **Article :** ligne vignette carrée arrondie 20 px + métadonnées, titre Fredoka, extrait en encre douce et domaines ; filet givré entre deux articles ; titre indigo nuit souligné 3 px au survol.
- **Bandeau « Jeux en ligne » :** panneau `--jaune` rayon 32 px, texte `--bandeau-texte` (encre), bouton encre.

### Inputs / Fields
- **Style :** fond menthe givrée, bordure 2 px transparente, rayon 20 px, 14 × 18 px ; libellé Atkinson 700 au-dessus.
- **Survol :** bordure menthe tache. **Focus :** bordure encre, fond blanc, sans halo. **Invalide** (`:user-invalid`) : bordure `--erreur` (#B3261E, rouge réservé aux erreurs).

### Navigation
- Logo « sophie » en Fredoka 700 (clamp 1.8–2.3rem) dont le creux du « o » est rempli de jaune `--point` (disque derrière la lettre).
- Liens en Atkinson 700 sans soulignement ; survol en indigo (`--corail`) ; page courante marquée d'un trait jaune au marqueur (`--surligne`) derrière le bas du mot, incliné de −1.5°.
- **Liens dans les textes et liens fléchés :** texte encre, trait jaune au marqueur (`--surligne`) sous le texte (il s'arrête avant la flèche), survol en indigo.
- Sous 960 px : bouton pilule blanc « Menu » avec icône trois traits en CSS, liens en colonne.
- **Focus partout :** anneau encre 3 px décalé de 3 px, rayon 6 px.

### Repère de domaine
Partout où le nom du domaine est écrit (légende de l'accueil, domaines d'articles, page Prises en charge, sommaire et titres de variantes des fiches), il est surligné au marqueur dans sa couleur : classe `.marque`, dégradé de `--puce` à 55 % mélangé à du blanc, sur 0.55em au bas du texte. Sur les cartes de fiches, où le nom n'est pas écrit, une tache SVG (symbole `#puce`, ovale irrégulier sans contour) rempli par `--puce`, avec le nom en `aria-label`.

### Frimousse
Mascotte : le koala (dessin fourni, SVG 417 × 247 inline dans `frimousse.njk`, couleurs par variables `--koala-*`). Elle dépasse du bas de l'accueil (centrée, passe derrière le panneau suivant, monte en 1.1 s une seule fois à l'arrivée) et du haut du pied de page (à droite). Sur l'accueil, les reflets blancs de ses yeux suivent le pointeur (désactivé si mouvement réduit). Le fichier source est `static/img/koala.svg`.

### Pied de page
Grand panneau encre, rayon 32 px, texte blanc ; noms et villes en Fredoka 600 1.3rem ; téléphones en `.tel` ; liens qui passent en `--pied-survol` (jaune) au survol ; mention de droits sous un filet blanc à 20 %.

## Do's and Don'ts

### Do:
- **Do** passer par les variables de palette (`--cyan`, `--corail`, `--corail-fonce`, `--jaune`, `--point`, `--etiquette`, `--surligne`) plutôt que des valeurs en dur.
- **Do** repérer un domaine en surlignant son nom au marqueur dans sa couleur (`.marque`) ; une tache de couleur seulement là où le nom n'est pas écrit.
- **Do** donner aux boutons l'aplat vertical de 4 px de leur teinte foncée, qui s'écrase à l'appui.
- **Do** composer les numéros de téléphone en Fredoka 600 (`.tel`).
- **Do** garder trois rayons : 32 px pour les panneaux, 20 px pour l'intérieur, pilule pour ce qui se clique.
- **Do** respecter `prefers-reduced-motion` : animations et transitions coupées, pupilles immobiles.

### Don't:
- **Don't** utiliser de pions ni de dés pour représenter les domaines (refusés par l'utilisateur).
- **Don't** revenir à la boîte de jeu verte ni au cabinet pastel « portrait + grille de services ».
- **Don't** mettre de contour ou d'ombre sur les panneaux de lecture.
- **Don't** écrire le texte principal en gris : encre noire, encre douce seulement pour le secondaire.
- **Don't** utiliser les couleurs des domaines ailleurs que dans leur marqueur et leurs taches.
- **Don't** mettre le jaune sur la frimousse ni sur les boutons.
