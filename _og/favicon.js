// Favicon of both sites (sophielogo.be and jeux.sophielogo.be): « so » from the logo, yellow disc in the o,
// on a rounded mint square. Run by hand: node _og/favicon.js <folder> [<folder>…]
// Writes favicon.svg (text turned into paths by satori: no font needed), favicon.ico (16, 32, 48)
// and apple-touch-icon.png (180, full square: iOS rounds the corners itself).

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { pieces } = require("./generate");
const { charger, h, COULEURS } = pieces;

const COTE = 512;

async function svgFavicon(arrondi) {
  await charger();
  const satori = (await import("satori")).default;
  const lire = nom => fs.readFileSync(path.join(__dirname, "fonts", nom));
  const taille = 380;
  const largeurO = taille * 0.558;
  const disque = { l: taille * 0.32, h: taille * 0.34 };
  const arbre = h(
    "div",
    { width: COTE, height: COTE, alignItems: "center", justifyContent: "center", background: COULEURS.menthe, borderRadius: arrondi },
    h(
      "div",
      { alignItems: "flex-end", fontFamily: "Fredoka", fontWeight: 700, fontSize: taille, lineHeight: 1, letterSpacing: "-0.02em", color: COULEURS.encre, marginTop: -taille * 0.16 },
      h("div", {}, "s"),
      h(
        "div",
        { position: "relative", width: largeurO, height: taille, justifyContent: "center" },
        h("div", { position: "absolute", left: (largeurO - disque.l) / 2, bottom: taille * 0.2, width: disque.l, height: disque.h, borderRadius: 999, background: COULEURS.jaune }),
        h("div", { position: "relative" }, "o")
      )
    )
  );
  return satori(arbre, { width: COTE, height: COTE, fonts: [{ name: "Fredoka", data: lire("fredoka-700.woff"), weight: 700, style: "normal" }] });
}

// ICO file holding PNG images (supported by every current browser)
function ico(pngs) {
  const entete = Buffer.alloc(6 + 16 * pngs.length);
  entete.writeUInt16LE(1, 2);
  entete.writeUInt16LE(pngs.length, 4);
  let decalage = entete.length;
  pngs.forEach(({ cote, png }, i) => {
    const e = 6 + 16 * i;
    entete.writeUInt8(cote % 256, e);
    entete.writeUInt8(cote % 256, e + 1);
    entete.writeUInt16LE(1, e + 4);
    entete.writeUInt16LE(32, e + 6);
    entete.writeUInt32LE(png.length, e + 8);
    entete.writeUInt32LE(decalage, e + 12);
    decalage += png.length;
  });
  return Buffer.concat([entete, ...pngs.map(p => p.png)]);
}

async function favicons(dossiers) {
  const arrondi = await svgFavicon(COTE * 0.22);
  const carre = await svgFavicon(0);
  const pngs = await Promise.all([16, 32, 48].map(async cote => ({ cote, png: await sharp(Buffer.from(arrondi)).resize(cote, cote).png().toBuffer() })));
  const pomme = await sharp(Buffer.from(carre)).resize(180, 180).flatten({ background: COULEURS.menthe }).png().toBuffer();
  for (const dossier of dossiers) {
    fs.mkdirSync(dossier, { recursive: true });
    fs.writeFileSync(path.join(dossier, "favicon.svg"), arrondi);
    fs.writeFileSync(path.join(dossier, "favicon.ico"), ico(pngs));
    fs.writeFileSync(path.join(dossier, "apple-touch-icon.png"), pomme);
    console.log(dossier);
  }
}

if (require.main === module) favicons(process.argv.slice(2).length ? process.argv.slice(2) : [path.join(__dirname, "..")]);

module.exports = { favicons };
