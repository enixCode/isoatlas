import {
  CLIPBOARD_TYPE,
  ClipboardContent,
  parseClipboard,
  placeClipboardContent
} from '../clipboard';

const node: ClipboardContent = {
  type: CLIPBOARD_TYPE,
  kind: 'ITEM',
  modelItem: { id: 'a', name: 'Server', icon: 'server' },
  viewItem: { id: 'a', tile: { x: 2, y: 3 } }
};

describe('parseClipboard()', () => {
  test('reads back what isoAtlas copied', () => {
    expect(parseClipboard(JSON.stringify(node))).toEqual(node);
  });

  test('ignores plain text and foreign JSON', () => {
    expect(parseClipboard('hello')).toBeNull();
    expect(parseClipboard('{"kind":"ITEM"}')).toBeNull();
  });

  test('rejects an element that breaks the schema', () => {
    const broken = { ...node, viewItem: { id: 'a', tile: { x: 5000, y: 0 } } };

    expect(parseClipboard(JSON.stringify(broken))).toBeNull();
  });
});

describe('placeClipboardContent()', () => {
  test('puts a node under the tile with a new id on both halves', () => {
    expect(placeClipboardContent(node, { x: 7, y: -1 }, 'b')).toEqual({
      ...node,
      modelItem: { ...node.modelItem, id: 'b' },
      viewItem: { id: 'b', tile: { x: 7, y: -1 } }
    });
  });

  test('centres a rectangle on the tile and keeps its size', () => {
    const rectangle: ClipboardContent = {
      type: CLIPBOARD_TYPE,
      kind: 'RECTANGLE',
      rectangle: { id: 'r', from: { x: 0, y: 0 }, to: { x: 4, y: 2 } }
    };
    const placed = placeClipboardContent(rectangle, { x: 10, y: 10 }, 's');

    expect(placed).toEqual({
      ...rectangle,
      rectangle: { id: 's', from: { x: 8, y: 9 }, to: { x: 12, y: 11 } }
    });
  });
});
