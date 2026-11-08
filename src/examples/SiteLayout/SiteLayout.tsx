import React from 'react';
import { Box, Button, IconButton, Link } from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';
// The brand logo of the README, so the site and the repository show the same one.
import logoSrc from '../../../.github/assets/isoatlas-logo.svg';

const HEADER_HEIGHT = 48;
const FOOTER_HEIGHT = 32;

// Brand fonts, loaded in index.html. The editor keeps its own: Isoatlas wraps
// itself in its theme, so these only reach the header and the footer.
const SITE_FONT = '"Red Hat Text", Roboto, Arial, sans-serif';
const WORDMARK_FONT = '"Red Hat Display", "Red Hat Text", sans-serif';

// Relative on purpose: the site is served from / on its own domain and from
// /isoatlas/ on GitHub Pages, with the docs under docs/ in both cases.
const DOCS_URL = 'docs/';
const NPM_URL = 'https://www.npmjs.com/package/isoatlas';
const ISOFLOW_URL = 'https://github.com/markmanx/isoflow';

// Same logo as the favicon in index.html.
const Logo = () => {
  return <Box component="img" src={logoSrc} alt="" sx={{ height: 26 }} />;
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
          fontFamily: WORDMARK_FONT,
          fontWeight: 800,
          fontSize: '1.1rem'
        }}
      >
        <Logo />
        isoAtlas
      </Link>
      <Box sx={{ flexGrow: 1 }} />
      <Button
        href={DOCS_URL}
        variant="text"
        color="inherit"
        sx={{ fontFamily: 'inherit' }}
      >
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
      <span>isoAtlas v{PACKAGE_VERSION} · MIT License</span>
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
        fontFamily: SITE_FONT,
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
