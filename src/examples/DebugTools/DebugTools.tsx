import React from 'react';
import Isoatlas from 'src/Isoatlas';
import { initialData } from '../initialData';

export const DebugTools = () => {
  return (
    <Isoatlas
      initialData={{ ...initialData, fitToView: true }}
      enableDebugTools
      height="100%"
    />
  );
};
