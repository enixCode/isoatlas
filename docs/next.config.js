// Nextra 3 est publie en ESM : depuis un fichier CJS, l'usine est sur .default.
const withNextra = require('nextra').default({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
});

module.exports = withNextra({
  // Pas de basePath : le dossier pages/docs/ fournit deja le prefixe /docs.
  // En ajouter un second donnait des URL en /docs/docs/installation.
  // Sans cela, les fichiers _meta.ts deviennent des routes vides (/docs/_meta, etc.).
  pageExtensions: ['mdx', 'md', 'jsx', 'tsx']
});
