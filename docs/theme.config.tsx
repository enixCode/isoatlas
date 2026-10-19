import React from 'react';
import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';

// L'editeur est a la racine du site, la doc sous /docs/ : on retire ce suffixe
// du basePath pour pointer vers l'editeur (/ ou /isoatlas/ sur GitHub Pages).
const useEditorUrl = () => {
  const { basePath } = useRouter();
  return `${basePath.replace(/\/docs$/, '')}/`;
};

// Le footer de Nextra ne stylise pas ses liens : sans cela, ils passent pour
// du simple texte.
const footerLink = { textDecoration: 'underline' };

export default {
  darkMode: false,
  logo: () => {
    return (
      <span
        style={{
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '-0.02em',
          fontWeight: 'bold',
          fontSize: '1.2em'
        }}
      >
        Isoatlas Developer Documentation
      </span>
    );
  },
  head: () => {
    // Remplace le head par defaut de Nextra, qui posait le <title>.
    const { title } = useConfig();
    // Les fichiers de public/ ne recoivent pas le basePath automatiquement.
    const { basePath } = useRouter();
    return (
      <>
        <title>{`${title} – Isoatlas`}</title>
        <link
          rel="icon"
          type="image/svg+xml"
          href={`${basePath}/favicon.svg`}
        />
      </>
    );
  },
  nextThemes: {
    defaultTheme: 'light'
  },
  navbar: {
    extraContent: () => {
      return (
        <a href={useEditorUrl()} style={{ fontSize: '0.875rem' }}>
          Editor
        </a>
      );
    }
  },
  project: {
    link: 'https://github.com/enixCode/isoatlas'
  },
  feedback: {
    content: null
  },
  editLink: {
    component: () => {
      return null;
    }
  },
  footer: {
    content: () => {
      return (
        <span style={{ fontSize: '0.875rem' }}>
          Isoatlas · MIT License · Community fork of{' '}
          <a href="https://github.com/markmanx/isoflow" style={footerLink}>
            Isoflow
          </a>{' '}
          ·{' '}
          <a href="https://www.npmjs.com/package/isoatlas" style={footerLink}>
            npm
          </a>
        </span>
      );
    }
  }
};
