// This is an entry point for the Docker image build.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Box } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import Isoatlas, { INITIAL_DATA } from 'src/Isoatlas';
import { icons, colors } from './examples/initialData';
import { loadSavedModel, saveModel } from './examples/persistence';

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
      <Isoatlas
        initialData={loadSavedModel({ ...INITIAL_DATA, icons, colors })}
        onModelUpdated={saveModel}
      />
    </Box>
  </React.StrictMode>
);
