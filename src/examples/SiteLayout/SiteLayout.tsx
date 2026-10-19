import React from 'react';
import { Box, Button, IconButton, Link } from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';

const HEADER_HEIGHT = 48;
const FOOTER_HEIGHT = 32;

// Relative on purpose: the site is served from / on its own domain and from
// /isoatlas/ on GitHub Pages, with the docs under docs/ in both cases.
const DOCS_URL = 'docs/';
const NPM_URL = 'https://www.npmjs.com/package/isoatlas';
const ISOFLOW_URL = 'https://github.com/markmanx/isoflow';

// Same cube as the favicon in index.html.
const Logo = () => {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 3 L29 10.5 L16 18 L3 10.5 Z" fill="#5b9bd5" />
      <path d="M3 10.5 L16 18 L16 29 L3 21.5 Z" fill="#2e5f8a" />
      <path d="M29 10.5 L16 18 L16 29 L29 21.5 Z" fill="#417cb8" />
    </svg>
  );
};

const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        height: HEADER_HEIGHT,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        bgcolor: 'common.white',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Link
        href="./"
        underline="none"
        color="text.primary"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 600,
          fontSize: '1.1rem'
        }}
      >
        <Logo />
        Isoatlas
      </Link>
      <Box sx={{ flexGrow: 1 }} />
      <Button href={DOCS_URL} variant="text" color="inherit">
        Documentation
      </Button>
      <IconButton
        href={REPOSITORY_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub repository"
      >
        <GitHubIcon />
      </IconButton>
    </Box>
  );
};

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        height: FOOTER_HEIGHT,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 2,
        bgcolor: 'common.white',
        borderTop: 1,
        borderColor: 'divider',
        color: 'text.secondary',
        fontSize: '0.75rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      }}
    >
      <span>Isoatlas v{PACKAGE_VERSION} · MIT License</span>
      <span>
        Community fork of{' '}
        <Link href={ISOFLOW_URL} target="_blank" rel="noreferrer">
          Isoflow
        </Link>
        {' · '}
        <Link href={NPM_URL} target="_blank" rel="noreferrer">
          npm
        </Link>
      </span>
    </Box>
  );
};

interface Props {
  children: React.ReactNode;
}

export const SiteLayout = ({ children }: Props) => {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        // On mobile, 100vh includes the area under the browser toolbar and
        // would hide the footer. 100dvh is the visible height.
        '@supports (height: 100dvh)': { height: '100dvh' },
        // Links inherit the font of the body, which the page leaves unset.
        fontFamily: (theme) => {
          return theme.typography.fontFamily;
        },
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Header />
      <Box component="main" sx={{ flexGrow: 1, minHeight: 0 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
