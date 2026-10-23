const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const htmlmin = require("html-minifier");
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
    .replace(/\s+/g, " ")
    .trim();
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
    String(html || "").replace(/<h2[^>]*?(?:id="([^"]*)")?[^>]*>([\s\S]*?)<\/h2>/g, (m, id, titre) => {
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
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("static/fonts");
  eleventyConfig.addPassthroughCopy("admin/");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: false
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
