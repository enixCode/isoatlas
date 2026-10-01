// Local save of the diagram for the pages that host the editor.
// Icons are not stored: they weigh about 2.5 MB and always come from
// the isopacks bundled in the build.
import { InitialData, Model } from 'src/Isoatlas';
import { modelSchema } from 'src/schemas/model';

const STORAGE_KEY = 'isoatlas:model';
const SAVE_DELAY_MS = 1000;

let saveTimeout: ReturnType<typeof setTimeout> | undefined;

// Unreadable or invalid content would block the editor on startup,
// so we fall back to the default data.
export const loadSavedModel = (fallback: InitialData): InitialData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallback;

    const data = { ...fallback, ...JSON.parse(saved), icons: fallback.icons };

    return modelSchema.safeParse(data).success ? data : fallback;
  } catch {
    return fallback;
  }
};

// The delay avoids writing on every pixel during a drag.
export const saveModel = (model: Model) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...model, icons: [] })
      );
    } catch {
      // Storage full or disabled: carry on without saving.
    }
  }, SAVE_DELAY_MS);
};
