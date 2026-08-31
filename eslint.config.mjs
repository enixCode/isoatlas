// Config plate d'ESLint 9. Remplace .eslintrc et la chaine Airbnb, abandonnee
// depuis mars 2024, qui bloquait 6 paquets et 6 vulnerabilites hautes.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: ['dist/**', 'docs/**', 'webpack/build/**', 'coverage/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      import: importPlugin
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' }
      }
    },
    rules: {
      // Les hooks sont la principale source de bugs silencieux en React.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Deux cycles preexistants subsistent (stores/reducers/view.ts et
      // viewItem.ts). En warn pour rester visible sans bloquer la CI.
      'import/no-cycle': 'warn',

      // Style historique du projet, conserve tel quel.
      'arrow-body-style': ['error', 'always'],
      // immer expose un brouillon mutable nomme draft : c'est voulu.
      'no-param-reassign': [
        'error',
        { props: true, ignorePropertyModificationsFor: ['draft'] }
      ],

      // Le prefixe underscore marque un argument volontairement inutilise.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },
  prettier
);
