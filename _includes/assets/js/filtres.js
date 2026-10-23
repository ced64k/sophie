// Domain filters: one choice per group (domaines, publics, themes),
// kept in the URL so a filtered list can be shared.
(function () {
  var liste = document.querySelector("[data-liste]");
  if (!liste) return;
  var boutons = Array.prototype.slice.call(document.querySelectorAll(".filtre"));
  var vide = document.querySelector(".vide");
  var choix = {};
  var groupes = boutons.map(function (b) { return b.getAttribute("data-filtre"); });

  // Only the page's own filter groups count (not ?palette=…, for example)
  new URLSearchParams(location.search).forEach(function (valeur, groupe) {
    if (groupes.indexOf(groupe) !== -1) choix[groupe] = valeur;
  });

  function appliquer() {
    var visibles = 0;
    Array.prototype.forEach.call(liste.children, function (item) {
      var garde = Object.keys(choix).every(function (groupe) {
        if (!choix[groupe]) return true;
        var valeurs = (item.getAttribute("data-" + groupe) || "").split(" ");
        return valeurs.indexOf(choix[groupe]) !== -1;
      });
      item.hidden = !garde;
      if (garde) visibles++;
    });
    if (vide) vide.hidden = visibles > 0;

    boutons.forEach(function (b) {
      var groupe = b.getAttribute("data-filtre");
      var actif = (choix[groupe] || "") === b.getAttribute("data-valeur");
      // "À télécharger" is alone in its group: a second click switches it off
      b.setAttribute("aria-pressed", actif ? "true" : "false");
    });
  }

  boutons.forEach(function (b) {
    b.addEventListener("click", function () {
      var groupe = b.getAttribute("data-filtre");
      var valeur = b.getAttribute("data-valeur");
      choix[groupe] = choix[groupe] === valeur ? "" : valeur;

      var params = new URLSearchParams();
      Object.keys(choix).forEach(function (g) { if (choix[g]) params.set(g, choix[g]); });
      var requete = params.toString();
      history.replaceState(null, "", requete ? "?" + requete : location.pathname);

      if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.startViewTransition(appliquer);
      } else {
        appliquer();
      }
    });
  });

  appliquer();
})();
