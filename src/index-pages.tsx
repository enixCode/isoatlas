// Entry point of the demo published on GitHub Pages: the editor alone,
// with the demo diagram loaded on startup.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Box } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import { BasicEditor } from './examples/BasicEditor/BasicEditor';

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
    <Box sx={{ width: '100vw', height: '100vh' }}>
      <BasicEditor />
    </Box>
  </React.StrictMode>
);
