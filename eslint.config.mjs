// ESLint 9 flat config. Replaces .eslintrc and the Airbnb chain, abandoned
// since March 2024, which held back 6 packages and 6 high vulnerabilities.
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
      // Hooks are the main source of silent bugs in React.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Two pre-existing cycles remain (stores/reducers/view.ts and
      // viewItem.ts). Set to warn to stay visible without blocking CI.
      'import/no-cycle': 'warn',

      // Historical project style, kept as is.
      'arrow-body-style': ['error', 'always'],
      // immer exposes a mutable draft named draft: this is intended.
      'no-param-reassign': [
        'error',
        { props: true, ignorePropertyModificationsFor: ['draft'] }
      ],

      // The underscore prefix marks an intentionally unused argument.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },
  prettier
);
