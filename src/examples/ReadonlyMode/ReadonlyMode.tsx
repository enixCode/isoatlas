import React from 'react';
import Isoatlas from 'src/Isoatlas';
import { initialData } from '../initialData';

export const ReadonlyMode = () => {
  return (
    <Isoatlas
      initialData={{ ...initialData, fitToView: true }}
      editorMode="EXPLORABLE_READONLY"
    />
  );
};
