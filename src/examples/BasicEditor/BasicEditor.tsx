import React, { useState } from 'react';
import Isoatlas from 'src/Isoatlas';
import { initialData } from '../initialData';
import { loadSavedModel, saveModel } from '../persistence';

export const BasicEditor = () => {
  const [data] = useState(() => {
    return loadSavedModel({ ...initialData, fitToView: true });
  });

  return <Isoatlas initialData={data} onModelUpdated={saveModel} />;
};
