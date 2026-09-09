# Développement

## Prérequis

Node **22 ou plus** (`node --version` pour vérifier).

## Démarrer

```bash
npm ci          # installe les dépendances (la première fois)
npm start       # lance l'éditeur sur http://localhost:3000
```

C'est tout. La page qui s'ouvre affiche un diagramme de démonstration, avec en bas
à droite un sélecteur pour basculer entre trois exemples : éditeur complet,
outils de debug, et mode lecture seule.

Le rechargement est automatique à chaque sauvegarde de fichier.

## Les commandes

| Commande | Ce qu'elle fait |
|---|---|
| `npm start` | Lance l'éditeur en local (port 3000) |
| `npm test` | Lance les tests (environ 1 minute) |
| `npx tsc --noEmit` | Vérifie les types sans rien compiler |
| `npm run lint` | Types puis ESLint. Doit rester vert |
| `npm run lint:fix` | Corrige automatiquement ce qui peut l'être |
| `npm run build` | Compile la bibliothèque dans `dist/` |
| `npm run docker:build` | Compile l'application autonome pour Docker |
| `npm run pages:build` | Compile la démo publiée sur GitHub Pages |

Avant de pousser du code, lance `npm run lint` puis `npm test`. C'est
exactement ce que la CI vérifiera.

## La documentation

Le site de docs est un projet **séparé**, avec ses propres dépendances :

```bash
cd docs
npm install     # la première fois seulement
npm run dev     # http://localhost:3002
```

Pour ajouter une page : créer un fichier `.mdx` dans `docs/pages/docs/`, puis
déclarer son titre dans le `_meta.ts` du même dossier (c'est lui qui définit
l'ordre du menu).

## Où travailler

Tout le produit est dans **`src/`**. Les autres dossiers sont de l'outillage :
`webpack/` pour la compilation, `docs/` pour le site, `dist/` pour la sortie
compilée (jetable, jamais modifié à la main).

Dans `src/`, chaque type d'objet du diagramme (noeud, connecteur, rectangle,
zone de texte) se retrouve dans quatre endroits parallèles :

| Pour changer... | Aller dans |
|---|---|
| la forme des données | `src/schemas/` |
| ce qui se passe quand on modifie | `src/stores/reducers/` |
| l'affichage | `src/components/SceneLayers/` |
| le panneau de réglages | `src/components/ItemControls/` |
| les outils de la barre (souris) | `src/interaction/modes/` |

Toute la géométrie isométrique (position des tuiles, projection, tracé des
connecteurs) vit dans un seul fichier : `src/utils/renderer.ts`.

## Pièges connus

**`npm run dev` ne lance pas de serveur.** Contrairement à ce que le nom
suggère, il recompile la bibliothèque en boucle. Pour développer, c'est
`npm start`.

**Deux cycles de dépendances subsistent** (`src/stores/reducers/view.ts` et
`viewItem.ts`). La règle `import/no-cycle` est réglée sur `warn` pour rester
visible sans bloquer la CI. Ils demandent une vraie correction, pas un
contournement.

**Le port 3000 est peut-être déjà pris** (VS Code l'utilise parfois). Dans ce
cas : `npm start -- --port 3001`.
