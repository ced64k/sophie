// Filtres par domaine : un choix par groupe (domaines, publics, themes),
// gardé dans l'URL pour pouvoir partager une liste filtrée.
(function () {
  var liste = document.querySelector("[data-liste]");
  if (!liste) return;
  var boutons = Array.prototype.slice.call(document.querySelectorAll(".filtre"));
  var vide = document.querySelector(".vide");
  var choix = {};

  new URLSearchParams(location.search).forEach(function (valeur, groupe) {
    choix[groupe] = valeur;
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
      // « À télécharger » est seul dans son groupe : il se coupe au second clic
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
