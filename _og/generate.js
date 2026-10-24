// Image generator for social sharing: 1200×630 « og:image » cards and 1080×1920 (9:16) story images.
// Everything is drawn at build time with satori (layout → SVG), resvg (SVG → PNG) and sharp (background, photo, koala).
// The visual language is the site's: mint background with fabric texture, marker-style tags, indigo button, koala.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const RACINE = path.join(__dirname, "..");
const POLICES = path.join(__dirname, "fonts");

const COULEURS = {
  encre: "#111111",
  menthe: "#A3D9CB",
  tache: "#8CC7B8",
  indigo: "#464A96",
  indigoFonce: "#35387A",
  jaune: "#E4AF1A",
  marqueur: "#F2C94C",
  blanc: "#FFFFFF"
};

const FORMATS = {
  og: { largeur: 1200, hauteur: 630 },
  story: { largeur: 1080, hauteur: 1920 }
};

let bibliotheques;
let polices;
let glyphes;
let texture;

async function charger() {
  if (bibliotheques) return;
  const satori = (await import("satori")).default;
  const { Resvg } = require("@resvg/resvg-js");
  bibliotheques = { satori, Resvg };
  const lire = nom => fs.readFileSync(path.join(POLICES, nom));
  polices = [
    { name: "Fredoka", data: lire("fredoka-700.woff"), weight: 700, style: "normal" },
    { name: "Fredoka", data: lire("fredoka-600.woff"), weight: 600, style: "normal" },
    { name: "Atkinson Hyperlegible", data: lire("atkinson-400.woff"), weight: 400, style: "normal" },
    { name: "Atkinson Hyperlegible", data: lire("atkinson-700.woff"), weight: 700, style: "normal" }
  ];
  const liste = JSON.parse(fs.readFileSync(path.join(POLICES, "glyphes.json"), "utf8"));
  glyphes = { fredoka: new Set(liste.fredoka), atkinson: new Set(liste.atkinson) };
  // Fabric texture used in overlay mode, at the same scale as on the website (250 px wide)
  const brut = await sharp(path.join(RACINE, "static/img/fabric-texture-gris.webp")).resize({ width: 250 }).greyscale().raw().toBuffer({ resolveWithObject: true });
  texture = { data: brut.data, largeur: brut.info.width, hauteur: brut.info.height, canaux: brut.info.channels };
}

// Replaces characters the fonts cannot draw (instead of showing empty boxes)
function nettoyer(texte, famille = "fredoka") {
  const ok = glyphes[famille];
  return String(texte || "")
    .replace(/\s+/g, " ")
    .replace(/[‘’]/g, "’")
    .replace(/ /g, " ")
    .split("")
    .map(c => (ok.has(c.codePointAt(0)) ? c : ""))
    .join("")
    .trim();
}

function h(type, style, ...enfants) {
  const contenu = enfants.flat().filter(e => e !== null && e !== undefined && e !== false);
  return { type, props: { style: { display: "flex", ...style }, children: contenu.length === 1 ? contenu[0] : contenu } };
}

function image(src, largeur, hauteur, style = {}) {
  return { type: "img", props: { src, width: largeur, height: hauteur, style } };
}

function svgEnUri(svg) {
  return "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
}

const FLECHE = svgEnUri("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M2 8h11M9 4l4 4-4 4' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/></svg>");

// ——— Pieces of the design ———

// « sophie » logo: Fredoka, with the yellow disc behind the o
function logo(taille) {
  const largeurO = taille * 0.558;
  const disque = { l: taille * 0.32, h: taille * 0.34 };
  return h(
    "div",
    { alignItems: "flex-end", fontFamily: "Fredoka", fontWeight: 700, fontSize: taille, lineHeight: 1, letterSpacing: "-0.02em", color: COULEURS.encre },
    h("div", {}, "s"),
    h(
      "div",
      { position: "relative", width: largeurO, height: taille, justifyContent: "center" },
      h("div", { position: "absolute", left: (largeurO - disque.l) / 2, bottom: taille * 0.2, width: disque.l, height: disque.h, borderRadius: 999, background: COULEURS.jaune }),
      h("div", { position: "relative" }, "o")
    ),
    h("div", {}, "phie")
  );
}

// Tag « au marqueur » (yellow, slightly tilted)
function etiquette(texte, taille, angle = -1.5) {
  return h(
    "div",
    {
      background: COULEURS.marqueur,
      color: COULEURS.encre,
      fontFamily: "Fredoka",
      fontWeight: 600,
      fontSize: taille,
      lineHeight: 1,
      padding: `${taille * 0.28}px ${taille * 0.7}px`,
      borderRadius: `${taille * 0.3}px ${taille * 0.8}px ${taille * 0.5}px ${taille * 0.65}px`,
      transform: `rotate(${angle}deg)`
    },
    texte
  );
}

// Domain names highlighted with their own marker colour
function marqueurs(domaines, taille) {
  // With three long names the row would wrap onto a second line: the short names are used instead
  const court = domaines.reduce((n, d) => n + d.nom.length, 0) > 40;
  return domaines.map(d =>
    h(
      "div",
      {
        fontFamily: "Fredoka",
        fontWeight: 700,
        fontSize: taille,
        lineHeight: 1.25,
        color: COULEURS.encre,
        padding: `0 ${taille * 0.15}px`,
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 50%, ${d.couleur}CC 50%, ${d.couleur}CC 92%, rgba(255,255,255,0) 92%)`
      },
      court && d.court ? d.court : d.nom
    )
  );
}

// Indigo « button » with a 4 px darker flat shadow, as on the site
function bouton(texte, taille) {
  return h(
    "div",
    {
      alignItems: "center",
      background: COULEURS.indigo,
      color: COULEURS.blanc,
      fontFamily: "Fredoka",
      fontWeight: 600,
      fontSize: taille,
      lineHeight: 1,
      padding: `${taille * 0.5}px ${taille * 0.95}px`,
      borderRadius: 999,
      boxShadow: `0 ${Math.max(4, taille * 0.14)}px 0 ${COULEURS.indigoFonce}`
    },
    h("div", {}, texte),
    image(FLECHE, taille * 0.8, taille * 0.8, { marginLeft: taille * 0.4 })
  );
}

// Largest font size at which the title fits the box (estimated: Fredoka Bold averages about 0.52 em per character)
function tailleTitre(texte, largeur, hauteurMax, lignesMax, tailleMax) {
  for (let taille = tailleMax; taille > 34; taille -= 2) {
    const parLigne = Math.max(1, Math.floor(largeur / (taille * 0.52)));
    const mots = texte.split(" ");
    let lignes = 1;
    let courante = 0;
    for (const mot of mots) {
      const longueur = mot.length;
      if (courante === 0) courante = longueur;
      else if (courante + 1 + longueur <= parLigne) courante += 1 + longueur;
      else {
        lignes++;
        courante = longueur;
      }
    }
    if (lignes <= lignesMax && lignes * taille * 1.06 <= hauteurMax) return taille;
  }
  return 34;
}

// ——— Rasters ———

async function fond(largeur, hauteur, taches) {
  const ovales = taches
    .map(t => `<ellipse cx='${t.x}' cy='${t.y}' rx='${t.rx}' ry='${t.ry}' transform='rotate(${t.a || 0} ${t.x} ${t.y})' fill='${COULEURS.tache}'/>`)
    .join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${largeur}' height='${hauteur}'><rect width='100%' height='100%' fill='${COULEURS.menthe}'/>${ovales}</svg>`;
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  const grain = await sharp(path.join(RACINE, "static/img/fabric-texture-gris.webp")).resize({ width: 250 }).png().toBuffer();
  return sharp(base).composite([{ input: grain, tile: true, blend: "overlay" }]).png().toBuffer();
}

function recouvrement(b, t) {
  b /= 255;
  t /= 255;
  return Math.round((b < 0.5 ? 2 * b * t : 1 - 2 * (1 - b) * (1 - t)) * 255);
}

// The koala (SVG supplied by the client) with the fabric texture in overlay mode, only on its own pixels
async function koala(largeur) {
  const brut = await sharp(path.join(RACINE, "static/img/koala.svg"), { density: 300 }).resize({ width: Math.round(largeur) }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = brut;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      if (data[i + 3] === 0) continue;
      const t = texture.data[((y % texture.hauteur) * texture.largeur + (x % texture.largeur)) * texture.canaux];
      data[i] = recouvrement(data[i], t);
      data[i + 1] = recouvrement(data[i + 1], t);
      data[i + 2] = recouvrement(data[i + 2], t);
    }
  }
  const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
  return { png, largeur: info.width, hauteur: info.height };
}

async function photo(chemin, largeur, hauteur) {
  const jpeg = await sharp(chemin).rotate().resize(Math.round(largeur), Math.round(hauteur), { fit: "cover", position: "centre" }).jpeg({ quality: 86 }).toBuffer();
  return "data:image/jpeg;base64," + jpeg.toString("base64");
}

async function dessiner(arbre, largeur, hauteur) {
  const { satori, Resvg } = bibliotheques;
  const svg = await satori(arbre, { width: largeur, height: hauteur, fonts: polices });
  return new Resvg(svg, { fitTo: { mode: "width", value: largeur } }).render().asPng();
}

// ——— The two layouts ———

async function carteOg(tache) {
  const { largeur, hauteur } = FORMATS.og;
  const titre = nettoyer(tache.titre);
  const avecPhoto = Boolean(tache.photo);
  const taillePhoto = { l: 470, h: 352 };
  const largeurTexte = avecPhoto ? 540 : 620;
  const taille = tailleTitre(titre, largeurTexte, 230, 4, 118);

  const bloc = [];
  bloc.push(h("div", { position: "absolute", left: 60, top: 50 }, logo(58)));
  // Tag, title and domains stack up in the space between the logo and the button, centred vertically
  bloc.push(
    h(
      "div",
      { position: "absolute", left: 60, top: 140, width: largeurTexte, height: 390, flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 24 },
      etiquette(nettoyer(tache.etiquette), 27),
      h("div", { fontFamily: "Fredoka", fontWeight: 700, fontSize: taille, lineHeight: 1.06, letterSpacing: "-0.015em", color: COULEURS.encre, lineClamp: 4 }, titre),
      tache.domaines.length ? h("div", { gap: 14, flexWrap: "wrap" }, marqueurs(tache.domaines.slice(0, 3), 26)) : null
    )
  );
  bloc.push(h("div", { position: "absolute", left: 60, bottom: 46 }, bouton(nettoyer(tache.bouton), 32)));
  if (avecPhoto) {
    const src = await photo(tache.photo, taillePhoto.l, taillePhoto.h);
    bloc.push(
      h(
        "div",
        { position: "absolute", left: 640, top: 64, width: taillePhoto.l + 24, height: taillePhoto.h + 24, padding: 12, background: COULEURS.blanc, borderRadius: 44, transform: "rotate(2.5deg)", boxShadow: "0 18px 40px -18px rgba(17,60,72,.45)" },
        image(src, taillePhoto.l, taillePhoto.h, { borderRadius: 34 })
      )
    );
  }
  const contenu = await dessiner(h("div", { position: "relative", width: largeur, height: hauteur }, bloc), largeur, hauteur);

  const taches = [
    { x: 1130, y: 110, rx: 230, ry: 170, a: -12 },
    { x: 40, y: 600, rx: 260, ry: 120, a: 8 }
  ];
  const couches = [];
  const k = await koala(avecPhoto ? 360 : 520);
  couches.push({ input: k.png, left: Math.round(avecPhoto ? 800 : 680), top: Math.round(hauteur - k.hauteur * (avecPhoto ? 0.66 : 0.8)) });
  couches.push({ input: contenu, left: 0, top: 0 });
  return rognerKoala(await fond(largeur, hauteur, taches), couches, largeur, hauteur);
}

async function carteStory(tache) {
  const { largeur, hauteur } = FORMATS.story;
  const titre = nettoyer(tache.titre);
  const avecPhoto = Boolean(tache.photo);
  const taille = tailleTitre(titre, 900, 250, 3, 128);
  // Instagram and TikTok cover the top and bottom of a story with their own buttons: everything important stays between y = 230 and y = 1580
  const zonePhoto = { l: 740, h: 555 };
  const yZone = 708;

  const bloc = [];
  bloc.push(h("div", { position: "absolute", left: 0, top: 232, width: largeur, justifyContent: "center" }, logo(96)));
  bloc.push(h("div", { position: "absolute", left: 0, top: 356, width: largeur, justifyContent: "center" }, etiquette(nettoyer(tache.etiquette), 38, -1.5)));
  bloc.push(
    h(
      "div",
      { position: "absolute", left: 90, top: 448, width: largeur - 180, height: 250, alignItems: "center", justifyContent: "center" },
      h("div", { fontFamily: "Fredoka", fontWeight: 700, fontSize: taille, lineHeight: 1.06, letterSpacing: "-0.015em", color: COULEURS.encre, textAlign: "center", justifyContent: "center", lineClamp: 3 }, titre)
    )
  );
  if (avecPhoto) {
    const src = await photo(tache.photo, zonePhoto.l, zonePhoto.h);
    bloc.push(
      h(
        "div",
        { position: "absolute", left: (largeur - zonePhoto.l - 28) / 2, top: yZone, width: zonePhoto.l + 28, height: zonePhoto.h + 28, padding: 14, background: COULEURS.blanc, borderRadius: 56, transform: "rotate(-2deg)", boxShadow: "0 24px 50px -22px rgba(17,60,72,.5)" },
        image(src, zonePhoto.l, zonePhoto.h, { borderRadius: 44 })
      )
    );
  }
  if (tache.domaines.length) {
    bloc.push(h("div", { position: "absolute", left: 90, top: yZone + zonePhoto.h + 78, width: largeur - 180, gap: 20, flexWrap: "wrap", justifyContent: "center" }, marqueurs(tache.domaines.slice(0, 3), 36)));
  }
  bloc.push(h("div", { position: "absolute", left: 0, top: 1408, width: largeur, justifyContent: "center" }, bouton(nettoyer(tache.bouton), 56)));
  bloc.push(h("div", { position: "absolute", left: 0, top: 1542, width: largeur, justifyContent: "center", fontFamily: "Atkinson Hyperlegible", fontWeight: 700, fontSize: 38, color: COULEURS.encre }, "sophielogo.be"));
  const contenu = await dessiner(h("div", { position: "relative", width: largeur, height: hauteur }, bloc), largeur, hauteur);

  const taches = [
    { x: 960, y: 300, rx: 330, ry: 260, a: -14 },
    { x: 80, y: 1050, rx: 330, ry: 240, a: 10 },
    { x: 900, y: 1790, rx: 380, ry: 200, a: -8 }
  ];
  const couches = [];
  if (!avecPhoto) {
    const k = await koala(840);
    couches.push({ input: k.png, left: Math.round((largeur - k.largeur) / 2), top: yZone + 40 });
  } else {
    // The koala peeks from the bottom edge, below the button
    const k = await koala(560);
    couches.push({ input: k.png, left: Math.round((largeur - k.largeur) / 2 + 190), top: hauteur - Math.round(k.hauteur * 0.5) });
  }
  couches.push({ input: contenu, left: 0, top: 0 });
  return rognerKoala(await fond(largeur, hauteur, taches), couches, largeur, hauteur);
}

// Composes the layers; anything that goes past the edge is cut off (the koala peeks from the bottom edge)
async function rognerKoala(base, couches, largeur, hauteur) {
  const preparees = [];
  for (const c of couches) {
    const meta = await sharp(c.input).metadata();
    const gauche = Math.max(0, c.left);
    const haut = Math.max(0, c.top);
    const rogneL = Math.min(meta.width - (gauche - c.left), largeur - gauche);
    const rogneH = Math.min(meta.height - (haut - c.top), hauteur - haut);
    if (rogneL <= 0 || rogneH <= 0) continue;
    const entree = await sharp(c.input).extract({ left: gauche - c.left, top: haut - c.top, width: rogneL, height: rogneH }).png().toBuffer();
    preparees.push({ input: entree, left: gauche, top: haut });
  }
  // JPEG: about 10 times lighter than PNG for this textured background, and link previews (WhatsApp, Messenger…) want small files
  return sharp(base).composite(preparees).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
}

function empreinte(tache) {
  let photoInfo = "";
  if (tache.photo) {
    try {
      const s = fs.statSync(tache.photo);
      photoInfo = `${s.size}-${s.mtimeMs}`;
    } catch (e) {
      photoInfo = "absente";
    }
  }
  const code = fs.readFileSync(__filename, "utf8");
  return crypto.createHash("sha1").update(JSON.stringify(tache) + photoInfo + code).digest("hex");
}

/**
 * Generates (or reuses from the cache) the two images of every job.
 * @param {Map<string, object>} taches slug → { titre, etiquette, bouton, domaines, photo }
 * @param {string} sortie  folder of the final site (e.g. _site)
 */
async function generer(taches, sortie, cache = path.join(RACINE, ".cache", "og")) {
  if (!taches.size) return { faites: 0, reutilisees: 0 };
  await charger();
  fs.mkdirSync(cache, { recursive: true });
  const dossiers = { og: path.join(sortie, "og"), story: path.join(sortie, "og", "story") };
  fs.mkdirSync(dossiers.og, { recursive: true });
  fs.mkdirSync(dossiers.story, { recursive: true });
  let faites = 0;
  let reutilisees = 0;
  for (const [slug, brute] of taches) {
    // A photo too small to be shown large (old WordPress thumbnails) is left out: the koala layout is used instead
    const tache = { ...brute };
    if (tache.photo) {
      try {
        const meta = await sharp(tache.photo).metadata();
        if ((meta.width || 0) < 640) tache.photo = null;
      } catch (e) {
        tache.photo = null;
      }
    }
    const hash = empreinte(tache);
    for (const [format, dessin] of [["og", carteOg], ["story", carteStory]]) {
      const enCache = path.join(cache, `${slug}-${format}-${hash.slice(0, 12)}.jpg`);
      let png;
      if (fs.existsSync(enCache)) {
        png = fs.readFileSync(enCache);
        reutilisees++;
      } else {
        try {
          png = await dessin(tache);
        } catch (erreur) {
          console.warn(`[og] ${slug} (${format}) : ${erreur.message}`);
          continue;
        }
        // Old versions of the same image are removed
        for (const ancien of fs.readdirSync(cache)) if (ancien.startsWith(`${slug}-${format}-`)) fs.unlinkSync(path.join(cache, ancien));
        fs.writeFileSync(enCache, png);
        faites++;
      }
      fs.writeFileSync(path.join(dossiers[format], `${slug}.jpg`), png);
    }
  }
  return { faites, reutilisees };
}

module.exports = { generer, FORMATS };
// Pieces reused by facebook.js (cover picture of the Facebook page)
module.exports.pieces = { charger, h, logo, etiquette, marqueurs, koala, fond, dessiner, rognerKoala, COULEURS };
