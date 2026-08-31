import { Size, Coords } from 'src/types';

declare global {
  let PACKAGE_VERSION: string;
  let REPOSITORY_URL: string;

  interface Window {
    Isoatlas: {
      getUnprojectedBounds: () => Size & Coords;
      fitToView: () => void;
    };
  }
}
