import React from 'react';
import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';

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
    component: null
  }
};
