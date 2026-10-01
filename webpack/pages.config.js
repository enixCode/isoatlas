// Demo published on GitHub Pages: same build as the Docker image, only the
// entry point changes. Output stays in dist/, served as is by Pages.
module.exports = {
  ...require('./docker.config'),
  entry: './src/index-pages.tsx'
};
