import React from 'react';

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
    return <link rel="icon" type="image/svg+xml" href="/favicon.svg" />;
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
