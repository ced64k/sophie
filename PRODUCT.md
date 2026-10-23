# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Deux publics, à égalité :

- **Parents (et patients)** qui cherchent une logopède pour leur enfant dans la région de Dour / Ath : comprendre ce que Sophie prend en charge, son approche, et savoir comment la contacter.
- **Professionnels** (logopèdes, instituteurs, stagiaires) qui viennent chercher des idées : fiches d'utilisation de jeux du commerce, articles, matériel à télécharger.

Les parents sont aussi lecteurs des ressources (articles « pour les parents », jeux à refaire à la maison).

## Product Purpose

Site professionnel de Sophie Lenaerts, logopède indépendante. Il sert à la fois de vitrine du cabinet (qui elle est, ce qu'elle prend en charge, comment la joindre) et de bibliothèque de ressources ludo-pédagogiques qu'elle partage depuis 2017. Réussite : un parent sait en une visite si Sophie peut aider son enfant et comment la contacter ; un professionnel trouve vite une fiche ou un matériel par domaine ou par public.

## Positioning

Une logopède qui travaille par le jeu : elle détourne des jeux du commerce (que les parents peuvent acheter et refaire à la maison) et décline chacun par domaine (lexique, syntaxe, phonologie, métaphonologie, lecture, orthographe, fonctions exécutives, cognition mathématique…). Approche inspirée des pédagogies alternatives : partir des intérêts et du rythme de l'enfant, parents bienvenus en séance, travail conjoint avec l'école et les autres thérapeutes. Elle a aussi créé des jeux en ligne, sur un site séparé (jeux.sophielenaerts.be).

## Operating Context

- Consultations : équipe des **Locaux des Chaperons à Elouges (Dour)** et équipe **Up-toi à Ath**.
- Prise de rendez-vous : les gens appellent ou écrivent aux Chaperons ou à Up-toi (téléphone, e-mail, adresse de chaque structure), qui renvoient vers Sophie. Le formulaire de contact du site arrive directement chez Sophie.
- Sophie prend de nouveaux patients ; 
- Pas de stages ni d'ateliers actuellement : aucune rubrique d'agenda à prévoir.
- Page Facebook existante, utilisée comme canal de contact.

## Capabilities and Constraints

- **Prises en charge** : enfants de l'âge préscolaire au début du secondaire. Domaines : prise en charge précoce et prémices de la communication, langage oral, langage écrit, cognition mathématique (anciennement « logique et mathématique »), méthodologie (méthode de travail, dont la compréhension des lectures longues).
- **INAMI** : Sophie est **conventionnée INAMI** ; le site le mentionne, sans détailler tarifs ni remboursements.
- **Stack** : Eleventy (site statique), sources sur GitHub `ced64k/sophie`. GitHub Actions déploie `main` sur sophielenaerts.be et `dev` sur dev.sophielenaerts.be (VPS Infomaniak, nginx).
- **Édition** : Sophie doit pouvoir écrire et modifier articles et fiches jeux sans toucher au code, via **Sveltia CMS** (backend GitHub ; Sophie a un compte GitHub). Les contenus restent des fichiers Markdown dans le dépôt.
- **Formulaire de contact** : à mettre en place côté VPS (le site est statique, Netlify Forms n'existe plus), envoi vers l'e-mail de Sophie.
- **Contenus existants** : tout est conservé et mieux organisé (par public et par domaine, avec résumés et images). Les URL actuelles (`/AAAA/MM/JJ/slug/` pour les articles, `/slug/` pour les fiches jeux, `/tags/…`) sont conservées ou redirigées.
- Le site est en français (Belgique) ; dates et interface en français.
- Le site des jeux en ligne (jeux.sophielenaerts.be) reste séparé ; le site principal le met en avant de façon bien visible dans la navigation.

## Brand Commitments

- Nom : Sophie Lenaerts – Logopède.
- Voix : première personne, chaleureuse, concrète, ton de praticienne qui partage (« coucou », « c'est une pépite ! »), tutoiement possible envers les pros dans les articles.
- Les textes des fiches jeux sont soumis aux droits d'auteur (mention à conserver).

## Evidence on Hand

- Bio complète (`pages/home.md`) : formation à l'Institut Libre Marie Haps (2001), expérience au CHAAP de Quevaucamps (PECS, Sésame), 3 ans de conseil en jeux éducatifs.
- 23 articles (`posts/`, 2017–2022) avec tags par public (`pour-les-parents`, `pour-les-instits`) et par domaine.
- 8 fiches jeux du commerce (`jeux/`) : Additions, Concept Kids, Cuisto Dingo, Jungle Speed, Kioukoi, Roads, Tocto Loto, Tortuboom.
- PDF téléchargeables et photos dans `static/img/` (beaucoup de déclinaisons WordPress inutiles à trier).
- Photo d'accueil : mains d'enfant et puzzle en bois (`static/img/cropped-4860084382_c8a130d413_o-1.jpg`).
- Absences : pas de portrait de Sophie identifié, pas de témoignages. Coordonnées (téléphone, e-mail, adresse) des Chaperons et d'Up-toi introuvables en ligne : le site utilise des valeurs factices clairement marquées « à remplacer », jamais présentées comme réelles.

## Product Principles

1. Un parent doit trouver en moins d'une minute : ce que Sophie prend en charge, où, et comment la contacter.
2. Les ressources sont le cœur du site : on les trouve par public et par domaine, pas seulement par date.
3. Le jeu est la méthode : il doit se sentir dans le site, sans infantiliser les professionnels.
4. Sophie publie seule : tout contenu doit pouvoir être créé dans le CMS sans aide technique.
5. Rien ne se perd : les anciennes URL et les fichiers téléchargeables continuent de fonctionner.

## Accessibility & Inclusion

Public incluant des parents d'enfants dyslexiques ou avec troubles du langage, et parfois eux-mêmes concernés : lisibilité soignée (taille de texte généreuse, lignes courtes, contraste élevé), WCAG 2.2 AA visé.
