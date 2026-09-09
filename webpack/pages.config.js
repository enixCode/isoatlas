// Démo publiée sur GitHub Pages : même build que l'image Docker, seul le
// point d'entrée change. La sortie reste dist/, servie telle quelle par Pages.
module.exports = {
  ...require('./docker.config'),
  entry: './src/index-pages.tsx'
};
