// Entry point of the demo published on GitHub Pages and isoatlas.dev: the
// editor with the demo diagram loaded on startup, between the site header and
// footer.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import { theme } from './styles/theme';
import { BasicEditor } from './examples/BasicEditor/BasicEditor';
import { SiteLayout } from './examples/SiteLayout/SiteLayout';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalStyles
      styles={{
        body: {
          margin: 0
        }
      }}
    />
    <ThemeProvider theme={theme}>
      <SiteLayout>
        <BasicEditor />
      </SiteLayout>
    </ThemeProvider>
  </React.StrictMode>
);
