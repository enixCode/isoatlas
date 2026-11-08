import { z } from 'zod';
import { modelItemSchema } from 'src/schemas/modelItems';
import { viewItemSchema } from 'src/schemas/views';
import { rectangleSchema } from 'src/schemas/rectangle';
import { textBoxSchema } from 'src/schemas/textBox';
import { Coords } from 'src/types';
import { CoordsUtils } from './CoordsUtils';

// Marks what isoAtlas puts in the system clipboard: pasting any other text is
// left to the browser.
export const CLIPBOARD_TYPE = 'isoatlas/clipboard';

// The clipboard can hold anything, so a paste is validated like a saved model.
const clipboardSchema = z.discriminatedUnion('kind', [
  z.object({
    type: z.literal(CLIPBOARD_TYPE),
    kind: z.literal('ITEM'),
    modelItem: modelItemSchema,
    viewItem: viewItemSchema
  }),
  z.object({
    type: z.literal(CLIPBOARD_TYPE),
    kind: z.literal('RECTANGLE'),
    rectangle: rectangleSchema
  }),
  z.object({
    type: z.literal(CLIPBOARD_TYPE),
    kind: z.literal('TEXTBOX'),
    textBox: textBoxSchema
  })
]);

export type ClipboardContent = z.infer<typeof clipboardSchema>;

export const parseClipboard = (text: string): ClipboardContent | null => {
  try {
    const result = clipboardSchema.safeParse(JSON.parse(text));

    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

// Gives the copied element a new id and puts it under the mouse tile. A
// rectangle is centred on that tile.
export const placeClipboardContent = (
  content: ClipboardContent,
  tile: Coords,
  id: string
): ClipboardContent => {
  if (content.kind === 'ITEM') {
    return {
      ...content,
      modelItem: { ...content.modelItem, id },
      viewItem: { ...content.viewItem, id, tile }
    };
  }

  if (content.kind === 'TEXTBOX') {
    return { ...content, textBox: { ...content.textBox, id, tile } };
  }

  const { from, to } = content.rectangle;
  const centre = {
    x: Math.round((from.x + to.x) / 2),
    y: Math.round((from.y + to.y) / 2)
  };
  const delta = CoordsUtils.subtract(tile, centre);

  return {
    ...content,
    rectangle: {
      ...content.rectangle,
      id,
      from: CoordsUtils.add(from, delta),
      to: CoordsUtils.add(to, delta)
    }
  };
};
