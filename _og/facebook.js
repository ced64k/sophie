// Cover picture of Sophie's Facebook page, in the style of the sharing cards (1640×624, twice the 820×312 size Facebook shows).
// Run by hand: node _og/facebook.js [output.jpg]  (default: static/img/partage/facebook-couverture.jpg)
// On a phone Facebook crops the sides (only x = 265…1375 stays visible) and, on a computer, the profile picture covers
// the bottom left corner: everything important stays in the middle, above y = 500 on the left.

const fs = require("fs");
const path = require("path");
const { pieces } = require("./generate");
const { charger, h, logo, etiquette, marqueurs, koala, fond, dessiner, rognerKoala, COULEURS } = pieces;

const LARGEUR = 1640;
const HAUTEUR = 624;
const domaines = require("../_data/domaines.json").filter(d => d.id !== "precoce");

// « joue » underlined with the yellow marker, as in the title of the home page
function surligne(texte) {
  return h(
    "div",
    { padding: "0 6px", backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 62%, ${COULEURS.jaune} 62%, ${COULEURS.jaune} 90%, rgba(255,255,255,0) 90%)` },
    texte
  );
}

async function couverture() {
  await charger();
  const titre = { fontFamily: "Fredoka", fontWeight: 700, fontSize: 92, lineHeight: 1.04, letterSpacing: "-0.015em", color: COULEURS.encre };
  const bloc = h(
    "div",
    { position: "absolute", left: 300, top: 56, width: 700, flexDirection: "column", alignItems: "flex-start" },
    logo(84),
    h("div", { marginTop: 30 }, etiquette("Logopède à Elouges et Ath", 30)),
    h("div", { ...titre, marginTop: 26 }, "La logopédie,"),
    h("div", { ...titre, alignItems: "flex-end" }, h("div", { marginRight: 22 }, "ça se"), surligne("joue"), h("div", { marginLeft: 14 }, "!")),
    h("div", { marginTop: 30, gap: 12, flexWrap: "wrap" }, marqueurs(domaines.map(d => ({ ...d, nom: d.id === "math" ? "Maths" : d.nom, court: null })), 27))
  );
  const contenu = await dessiner(h("div", { position: "relative", width: LARGEUR, height: HAUTEUR }, bloc), LARGEUR, HAUTEUR);

  const taches = [
    { x: 1240, y: 120, rx: 300, ry: 190, a: -12 },
    { x: 120, y: 560, rx: 320, ry: 140, a: 8 },
    { x: 1600, y: 600, rx: 200, ry: 120, a: -6 }
  ];
  // The koala peeks from the bottom edge, on the right of the text
  const k = await koala(400);
  const couches = [
    { input: k.png, left: 960, top: HAUTEUR - Math.round(k.hauteur * 0.96) },
    { input: contenu, left: 0, top: 0 }
  ];
  return rognerKoala(await fond(LARGEUR, HAUTEUR, taches), couches, LARGEUR, HAUTEUR);
}

if (require.main === module) {
  const sortie = process.argv[2] || path.join(__dirname, "..", "static/img/partage/facebook-couverture.jpg");
  couverture().then(jpeg => {
    fs.mkdirSync(path.dirname(sortie), { recursive: true });
    fs.writeFileSync(sortie, jpeg);
    console.log(sortie);
  });
}

module.exports = { couverture };
