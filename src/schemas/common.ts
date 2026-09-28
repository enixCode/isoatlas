import { z } from 'zod';

// A tile coordinate ends up sizing the pathfinder grid, and that cost grows
// with the square of the span between two anchors. Unbounded, two integers in
// an imported file ask for a grid of billions of cells and take the tab down.
const tileCoord = z.number().min(-1000).max(1000);

export const coords = z.object({
  x: tileCoord,
  y: tileCoord
});

export const id = z.string().min(1).max(100);
export const color = z.string();

export const constrainedStrings = {
  name: z.string().max(100),
  description: z.string().max(1000)
};
