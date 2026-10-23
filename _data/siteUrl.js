// Absolute address of the site (for og:image and canonical): the test version (dev branch) points to dev.sophielenaerts.be.
// GitHub Actions provides GITHUB_REF.
module.exports =
  process.env.SITE_URL ||
  (process.env.GITHUB_REF === "refs/heads/dev" ? "https://dev.sophielenaerts.be" : "https://sophielenaerts.be");
