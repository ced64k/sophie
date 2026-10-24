// Adresse des jeux en ligne : la version de test du site (branche dev, dev.sophielogo.be) renvoie
// vers la version de test des jeux, la production vers la production. GitHub Actions fournit GITHUB_REF.
module.exports =
  process.env.JEUX_EN_LIGNE ||
  (process.env.GITHUB_REF === "refs/heads/dev"
    ? "https://devjeux.sophielenaerts.be"
    : "https://jeux.sophielenaerts.be");
