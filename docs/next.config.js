// Nextra 3 est publie en ESM : depuis un fichier CJS, l'usine est sur .default.
const withNextra = require('nextra').default({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
});

module.exports = withNextra({
  // Site statique (dossier out/), servi sous /docs a cote de la demo.
  // Sur GitHub Pages, le workflow y ajoute le prefixe du depot (/isoatlas/docs).
  output: 'export',
  basePath: process.env.DOCS_BASE_PATH ?? '/docs',
  // installation/index.html plutot que installation.html : l'URL sans
  // extension marche aussi sur un hebergement Apache, pas seulement sur Pages.
  trailingSlash: true,
  // Pas de serveur Next en export statique, donc pas d'optimisation d'images.
  images: { unoptimized: true },
  // La config ESLint du depot exclut docs/ : rien a linter ici.
  eslint: { ignoreDuringBuilds: true },
  // Sans cela, les fichiers _meta.ts deviennent des routes vides (/_meta, etc.).
  pageExtensions: ['mdx', 'md', 'jsx', 'tsx']
});
