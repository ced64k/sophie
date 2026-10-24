const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const htmlmin = require("html-minifier");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const og = require("./_og/generate.js");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const classement = require("./_data/classement.json");
const domaines = require("./_data/domaines.json");

// Domaine d'une section de fiche jeu, d'après le texte de son titre.
// « Métaphonologie » est testé avant « phonologie » (langage oral).
const DOMAINES_TITRES = [
  [/m[ée]taphonologie|lecture|orthographe|graphisme|[ée]crit/i, "ecrit"],
  [/oral|lexique|syntaxe|phonologie/i, "oral"],
  [/math|calcul|nombre|logique/i, "math"],
  [/ex[ée]cutive|m[ée]thod|m[ée]moris/i, "methodo"]
];

function domaineDuTitre(titre) {
  const trouve = DOMAINES_TITRES.find(([motif]) => motif.test(titre));
  return trouve ? trouve[1] : null;
}

function texteBrut(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(x?)([0-9a-f]+);/gi, (m, hex, n) => String.fromCodePoint(parseInt(n, hex ? 16 : 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}


// Domaines d'une fiche jeu (objets de _data/domaines.json), d'après ses titres de section
function domainesDeLaFiche(html) {
  const vus = new Set();
  String(html || "").replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (m, titre) => {
    const id = domaineDuTitre(texteBrut(titre));
    if (id) vus.add(id);
  });
  return [...vus].map(id => domaines.find(d => d.id === id)).filter(Boolean);
}

function premiereImage(html) {
  const trouve = String(html || "").match(/<img[^>]+src="([^"]+)"/);
  return trouve ? trouve[1] : null;
}

function classementDe(data) {
  const domainesTrouves = new Set();
  [...(data.categories || []), ...(data.tags || [])].forEach(e => {
    if (classement.domaines[e]) domainesTrouves.add(classement.domaines[e]);
  });
  return { domaines: [...domainesTrouves] };
}

module.exports = function(eleventyConfig) {

  // Eleventy Navigation https://www.11ty.dev/docs/plugins/navigation/
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Merge data instead of overriding
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // Fiches jeux
  eleventyConfig.addCollection("jeux", collection =>
    collection.getFilteredByGlob("./jeux/*.md").sort((a, b) => a.data.title.localeCompare(b.data.title, "fr"))
  );

  // Filters

  // Fin d'URL sans accents (les liens accentués sont illisibles une fois encodés : %C3%A9)
  eleventyConfig.addFilter("urlSansAccents", texte => String(texte).normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  eleventyConfig.addFilter("permalink_year", dateObj => dateObj.getFullYear());
  eleventyConfig.addFilter("permalink_month", dateObj =>
    String(dateObj.getMonth() + 1).padStart(2, "0")
  );
  eleventyConfig.addFilter("permalink_day", dateObj =>
    String(dateObj.getDate()).padStart(2, "0")
  );

  // Date lisible, en français (« 22 octobre 2022 »)
  eleventyConfig.addFilter("readableDate", dateObj =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).setLocale("fr").toFormat("d LLLL yyyy")
  );

  // Date machine (attribut datetime)
  eleventyConfig.addFilter("machineDate", dateObj =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-MM-dd")
  );

  // Première image d'un contenu HTML rendu
  eleventyConfig.addFilter("firstImage", html => {
    const trouve = String(html || "").match(/<img[^>]+src="([^"]+)"/);
    return trouve ? trouve[1] : null;
  });

  // Début du texte d'un contenu HTML rendu, coupé sur un mot
  eleventyConfig.addFilter("excerpt", (html, longueur = 180) => {
    const texte = texteBrut(html);
    if (texte.length <= longueur) return texte;
    return texte.slice(0, texte.lastIndexOf(" ", longueur)) + "…";
  });

  // Sections (h2) d'une fiche jeu avec leur domaine
  eleventyConfig.addFilter("sectionsFiche", html => {
    const sections = [];
    String(html || "").replace(/<h2(?:[^>]*?\sid="([^"]*)")?[^>]*>([\s\S]*?)<\/h2>/g, (m, id, titre) => {
      const texte = texteBrut(titre);
      sections.push({ id, titre: texte, domaine: domaineDuTitre(texte) });
    });
    return sections;
  });

  // Domaines distincts couverts par une fiche jeu
  eleventyConfig.addFilter("domainesFiche", html => {
    const vus = new Set();
    String(html || "").replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (m, titre) => {
      const domaine = domaineDuTitre(texteBrut(titre));
      if (domaine) vus.add(domaine);
    });
    return [...vus];
  });

  // Ajoute la pastille de domaine devant chaque h2 d'une fiche jeu
  eleventyConfig.addFilter("puceFiche", html =>
    String(html || "").replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (m, attributs, titre) => {
      const domaine = domaineDuTitre(texteBrut(titre));
      if (!domaine) return m;
      const couleur = domaines.find(d => d.id === domaine).couleur;
      return `<h2${attributs} class="variante" style="--puce: ${couleur}"><span class="marque">${titre}</span></h2>`;
    })
  );

  // Classement d'un article (catégories WordPress ou tags)
  eleventyConfig.addFilter("classementArticle", data => {
    const etiquettes = [...(data.categories || []), ...(data.tags || [])];
    const domaines = new Set();
    const publics = new Map();
    const themes = new Map();
    etiquettes.forEach(e => {
      if (classement.domaines[e]) domaines.add(classement.domaines[e]);
      if (classement.publics[e]) publics.set(classement.publics[e].id, classement.publics[e]);
      if (classement.themes[e]) themes.set(classement.themes[e].id, classement.themes[e]);
    });
    return { domaines: [...domaines], publics: [...publics.values()], themes: [...themes.values()] };
  });

  // Retrouve un domaine par son id
  eleventyConfig.addFilter("domaine", (domaines, id) => domaines.find(d => d.id === id));

  // Vignettes : les photos des cartes (fiches, articles) sont servies en WebP réduit, générées à la compilation
  const vignettes = new Map();
  const vignette = (src, largeur = 480) => {
    const m = /^\/static\/img\/(.+)\.(jpe?g|png)$/i.exec(src || "");
    if (!m || !fs.existsSync("." + src)) return src;
    const sortie = `/static/img/v/${m[1].replace(/[^A-Za-z0-9_-]/g, "_")}-${largeur}.webp`;
    vignettes.set(sortie, { source: "." + src, largeur });
    return sortie;
  };
  eleventyConfig.addFilter("vignette", vignette);

  // Les images du texte (articles, fiches) sont servies en WebP de 1200 px max, avec leurs dimensions réelles
  const dimensions = new Map();
  eleventyConfig.addTransform("imagesDuTexte", async function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    const re = /<img([^>]*?) src="(\/static\/img\/(?!v\/)[^"]+\.(?:jpe?g|png))"([^>]*)>/gi;
    const trouvees = [...content.matchAll(re)];
    if (!trouvees.length) return content;
    for (const [, , src] of trouvees) {
      if (dimensions.has(src) || !fs.existsSync("." + src)) continue;
      const { width, height } = await sharp("." + src).metadata();
      dimensions.set(src, { width, height });
    }
    return content.replace(re, (m, avant, src, apres) => {
      const d = dimensions.get(src);
      if (!d) return m;
      const largeur = Math.min(1200, d.width);
      const hauteur = Math.round(d.height * largeur / d.width);
      const lazy = /loading=/.test(avant + apres) ? "" : ' loading="lazy"';
      return `<img${avant} src="${vignette(src, 1200)}" width="${largeur}" height="${hauteur}"${lazy}${apres}>`;
    });
  });
  // Deux images en portrait qui se suivent dans un texte sont présentées côte à côte, à la même hauteur (les images paysage restent l'une sous l'autre)
  eleventyConfig.addTransform("duosImages", function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    const img = '(<img\\b[^>]*?\\bwidth="(\\d+)"[^>]*?\\bheight="(\\d+)"[^>]*>)';
    const re = new RegExp(`<p>((?:(?!<p>|<img)[\\s\\S])*?)${img}(?:\\s*<br\\s*/?>)?\\s*(?:</p>\\s*<p>)?${img}</p>`, "g");
    return content.replace(re, (m, texte, a, wa, ha, b, wb, hb) => {
      if (+wa > +ha || +wb > +hb) return m;
      const avant = texte.replace(/<br\s*\/?>\s*$/, "").trim() ? `<p>${texte.trim()}</p>` : "";
      return `${avant}<div class="duo-images"><span style="flex:${(wa / ha).toFixed(3)} 1 0">${a}</span><span style="flex:${(wb / hb).toFixed(3)} 1 0">${b}</span></div>`;
    });
  });
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    for (const [sortie, { source, largeur }] of vignettes) {
      const fichier = path.join(dir.output, sortie);
      if (fs.existsSync(fichier) && fs.statSync(fichier).mtimeMs > fs.statSync(source).mtimeMs) continue;
      fs.mkdirSync(path.dirname(fichier), { recursive: true });
      await sharp(source).resize({ width: largeur, withoutEnlargement: true }).webp({ quality: 72 }).toFile(fichier);
    }
  });

  // ——— Social images (1200×630 og:image and 1080×1920 story), see _og/generate.js ———
  // Every page registers its card while it renders (the layout calls the ogCarte filter); the images are drawn after the build.
  const cartesOg = new Map();
  const PAGES_SANS_CARTE = ["./tags.njk", "./404.md", "./pages/contact-merci.md", "./partage.njk"];
  const TEXTES_PAGES = {
    "qui-suis-je": { titre: "Qui suis-je ?", etiquette: "Sophie Lenaerts, logopède", bouton: "Faire connaissance" },
    "prises-en-charge": { titre: "Ce que je prends en charge", etiquette: "Prises en charge", bouton: "Voir les domaines", tousLesDomaines: true },
    "jeux": { titre: "Les jeux du commerce, détournés en séances", etiquette: "Fiches jeux", bouton: "Voir les fiches" },
    "blog": { titre: "Idées de jeux et astuces pour la maison ou la classe", etiquette: "Articles", bouton: "Lire les articles" },
    "contact": { titre: "Prenons contact", etiquette: "Logopède à Elouges et Ath", bouton: "Appeler ou écrire" },
    "accueil": { titre: "La logopédie, ça se joue !", etiquette: "Logopède à Elouges et Ath", bouton: "Découvrir" }
  };

  function slugCarte(page) {
    if (!page || PAGES_SANS_CARTE.includes(page.inputPath)) return null;
    if (page.url === "/") return "accueil";
    return page.fileSlug || null;
  }

  function fichierLocal(src) {
    const m = /^\/static\/img\/([^?#]+)$/.exec(src || "");
    if (!m || /cropped-4176463964/.test(src)) return null;
    const f = path.join(__dirname, "static/img", decodeURIComponent(m[1]));
    return /\.(jpe?g|png|webp)$/i.test(f) && fs.existsSync(f) ? f : null;
  }

  // Called from the head of every page: registers the card and returns the slug of the image to use
  eleventyConfig.addFilter("ogCarte", (page, data, contenu) => {
    const slug = slugCarte(page);
    if (!slug) return "accueil";
    const texte = TEXTES_PAGES[slug] || {};
    const dossier = (page.inputPath || "").split("/")[1];
    let carte;
    if (dossier === "jeux" && page.inputPath !== "./pages/jeux.md") {
      const trouves = domainesDeLaFiche(contenu);
      carte = {
        titre: data.title,
        etiquette: `Fiche jeu · ${data.author || "Sophie Lenaerts"}`,
        bouton: "Découvrir la fiche",
        domaines: trouves,
        photo: fichierLocal(data.image || premiereImage(contenu))
      };
    } else if (dossier === "posts") {
      const c = classementDe(data);
      carte = {
        titre: data.title,
        etiquette: `Article · ${DateTime.fromJSDate(page.date, { zone: "utc" }).setLocale("fr").toFormat("d LLLL yyyy")}`,
        bouton: "Lire l’article",
        domaines: c.domaines.map(id => domaines.find(d => d.id === id)).filter(Boolean),
        photo: fichierLocal(data.image || premiereImage(contenu))
      };
    } else {
      carte = {
        titre: texte.titre || data.title,
        etiquette: texte.etiquette || "Sophie Lenaerts, logopède",
        bouton: texte.bouton || "Découvrir",
        domaines: texte.tousLesDomaines ? domaines.filter(d => d.id !== "precoce").slice(0, 3) : [],
        photo: null
      };
    }
    // Optional overrides in a page's front matter: ogTitre, ogEtiquette, ogBouton
    if (data.ogTitre) carte.titre = data.ogTitre;
    if (data.ogEtiquette) carte.etiquette = data.ogEtiquette;
    if (data.ogBouton) carte.bouton = data.ogBouton;
    cartesOg.set(slug, carte);
    return slug;
  });

  // Description for link previews: the page's own description, else the first real paragraph of an article or fiche
  eleventyConfig.addFilter("ogDescription", (data, contenu, parDefaut) => {
    if (data.metaDescription || data.summary) return data.metaDescription || data.summary;
    const trouve = /<p>([\s\S]*?)<\/p>/g;
    let m;
    while ((m = trouve.exec(String(contenu || "")))) {
      const t = texteBrut(m[1]).replace(/ ([,.;:!?…])/g, "$1");
      if (t.length >= 60) return t.length <= 160 ? t : t.slice(0, t.lastIndexOf(" ", 158)) + "…";
    }
    return parDefaut;
  });

  // List of the cards (for the /partage/ page): one entry per page that has its own images
  eleventyConfig.addFilter("ogListe", items =>
    items
      .map(item => {
        const slug = slugCarte(item.page || item);
        if (!slug || !item.data || !item.data.title) return null;
        const dossier = (item.inputPath || "").split("/")[1];
        const type = slug === "accueil" ? "Accueil" : dossier === "posts" ? "Article" : dossier === "jeux" && item.inputPath !== "./pages/jeux.md" ? "Fiche jeu" : "Page";
        return { slug, titre: item.data.title === "Accueil" ? "Accueil" : item.data.title, type, url: item.url };
      })
      .filter(Boolean)
      .sort((a, b) => ["Accueil", "Page", "Fiche jeu", "Article"].indexOf(a.type) - ["Accueil", "Page", "Fiche jeu", "Article"].indexOf(b.type) || a.titre.localeCompare(b.titre, "fr"))
  );

  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const { faites, reutilisees } = await og.generer(cartesOg, dir.output);
    if (faites) console.log(`[og] ${faites} image(s) générée(s), ${reutilisees} réutilisée(s) du cache`);
    cartesOg.clear();
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath && outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        // Inline <script> blocks are minified too (comments removed, names shortened)
        minifyJS: true
      });
      return minified;
    }
    return content;
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("static/fonts");
  eleventyConfig.addPassthroughCopy("admin/");
  // Carte de la page contact (Leaflet, servi par le site : pas de dépendance à un CDN)
  eleventyConfig.addPassthroughCopy({ "node_modules/leaflet/dist/leaflet.js": "static/vendor/leaflet/leaflet.js", "node_modules/leaflet/dist/leaflet.css": "static/vendor/leaflet/leaflet.css" });
  // Script d'envoi du formulaire de contact (exécuté par PHP-FPM sur le VPS, voir serveur/README.md)
  eleventyConfig.addPassthroughCopy({ "serveur/contact-envoi.php": "contact/envoi.php" });

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  // Identifiants de titres sans accents : un id « ex%C3%A9cutives » ne correspond pas au lien #exécutives décodé par le navigateur
  let opts = {
    permalink: false,
    slugify: titre => String(titre).normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  return {
    templateFormats: ["md", "njk", "liquid"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
