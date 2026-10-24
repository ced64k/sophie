// Absolute address of the site (for og:image and canonical): the test version (dev branch) points to dev.sophielogo.be.
// GitHub Actions provides GITHUB_REF.
module.exports =
  process.env.SITE_URL ||
  (process.env.GITHUB_REF === "refs/heads/dev" ? "https://dev.sophielogo.be" : "https://sophielogo.be");
