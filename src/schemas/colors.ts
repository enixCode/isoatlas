import { z } from 'zod';
import { id } from './common';

export const colorSchema = z.object({
  id,
  // chroma-js throws on anything it cannot parse, and it is called at render
  // time, where the exception would take the whole tree with it.
  value: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
});

export const colorsSchema = z.array(colorSchema);
