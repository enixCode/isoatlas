import { Coords, Size, Scroll, View } from 'src/types';
import { CoordsUtils, SizeUtils } from 'src/utils';
import { PROJECTED_TILE_SIZE } from 'src/config';
import {
  getConnectorPath,
  getGridSubset,
  getItemAtTile,
  isBoundsOutOfViewport,
  isWithinBounds,
  screenToIso
} from '../renderer';

const getRendererSize = (tileSize: Size, zoom: number = 1): Size => {
  const projectedTileSize = SizeUtils.multiply(PROJECTED_TILE_SIZE, zoom);

  return {
    width: projectedTileSize.width * tileSize.width,
    height: projectedTileSize.height * tileSize.height
  };
};

const getScroll = (coords: Coords): Scroll => {
  return {
    position: coords,
    offset: CoordsUtils.zero()
  };
};

describe('Tests renderer utils', () => {
  test('getGridSubset() works correctly', () => {
    const gridSubset = getGridSubset([
      { x: 5, y: 5 },
      { x: 7, y: 7 }
    ]);

    expect(gridSubset).toEqual([
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 5, y: 7 },
      { x: 6, y: 5 },
      { x: 6, y: 6 },
      { x: 6, y: 7 },
      { x: 7, y: 5 },
      { x: 7, y: 6 },
      { x: 7, y: 7 }
    ]);
  });

  test('isWithinBounds() works correctly', () => {
    const bounds: Coords[] = [
      { x: 4, y: 4 },
      { x: 6, y: 6 }
    ];

    const withinBounds = isWithinBounds({ x: 5, y: 5 }, bounds);
    const onBorder = isWithinBounds({ x: 4, y: 4 }, bounds);
    const outsideBounds = isWithinBounds({ x: 3, y: 3 }, bounds);

    expect(withinBounds).toBe(true);
    expect(onBorder).toBe(true);
    expect(outsideBounds).toBe(false);
  });

  test('screenToIso() works correctly when mouse is at center of project', () => {
    const zoom = 1;
    const rendererSize = getRendererSize({ width: 10, height: 10 }, zoom);
    const scroll = getScroll({ x: 0, y: 0 });
    const tile = screenToIso({
      mouse: {
        x: rendererSize.width / 2,
        y: rendererSize.height / 2
      },
      zoom,
      scroll,
      rendererSize
    });

    expect(tile).toEqual({ x: 0, y: -0 });
  });

  test('screenToIso() works correctly when mouse is at topLeft corner of project', () => {
    const zoom = 1;
    const rendererSize = getRendererSize({ width: 10, height: 10 }, zoom);
    const scroll = getScroll({ x: 0, y: 0 });
    const tile = screenToIso({
      mouse: {
        x: 0,
        y: 0
      },
      zoom,
      scroll,
      rendererSize
    });

    expect(tile).toEqual({ x: 0, y: 10 });
  });

  test('screenToIso() works correctly when mouse is at topLeft corner of project and zoom is 0.5', () => {
    const zoom = 0.5;
    const rendererSize = getRendererSize({ width: 10, height: 10 }, zoom);
    const scroll = getScroll({ x: 0, y: 0 });
    const tile = screenToIso({
      mouse: {
        x: 0,
        y: 0
      },
      zoom,
      scroll,
      rendererSize
    });

    expect(tile).toEqual({ x: 0, y: 10 });
  });

  test('screenToIso() works correctly when mouse is at center of project and zoom is 0.5 and screen is halfway scrolled', () => {
    const zoom = 1;
    const rendererSize = getRendererSize({ width: 10, height: 10 }, zoom);
    const scroll = getScroll({
      x: rendererSize.width / 2,
      y: rendererSize.height / 2
    });
    const tile = screenToIso({
      mouse: {
        x: rendererSize.width / 2,
        y: rendererSize.height / 2
      },
      zoom,
      scroll,
      rendererSize
    });

    expect(tile).toEqual({ x: 0, y: 10 });
  });
});

describe('isBoundsOutOfViewport()', () => {
  const rendererSize = { width: 1000, height: 800 };
  const bounds = { x: -100, y: -50, width: 200, height: 100 };

  test('is false when the bounds sit in the middle of the screen', () => {
    expect(
      isBoundsOutOfViewport({
        bounds,
        zoom: 1,
        scroll: CoordsUtils.zero(),
        rendererSize
      })
    ).toBe(false);
  });

  test('is false while part of the bounds is still on screen', () => {
    expect(
      isBoundsOutOfViewport({
        bounds,
        zoom: 1,
        scroll: { x: 550, y: 0 },
        rendererSize
      })
    ).toBe(false);
  });

  test('is true once the bounds have fully left the screen', () => {
    expect(
      isBoundsOutOfViewport({
        bounds,
        zoom: 1,
        scroll: { x: 650, y: 0 },
        rendererSize
      })
    ).toBe(true);
  });

  test('takes the zoom into account', () => {
    expect(
      isBoundsOutOfViewport({
        bounds,
        zoom: 2,
        scroll: { x: 650, y: 0 },
        rendererSize
      })
    ).toBe(false);
  });

  test('screenToIso() snaps the mouse to a quarter of a tile', () => {
    const zoom = 1;
    const rendererSize = getRendererSize({ width: 10, height: 10 }, zoom);
    const scroll = getScroll({ x: 0, y: 0 });
    // A quarter of a tile along x, from the center of the project.
    const tile = screenToIso({
      mouse: {
        x: rendererSize.width / 2 + PROJECTED_TILE_SIZE.width / 8,
        y: rendererSize.height / 2 - PROJECTED_TILE_SIZE.height / 8
      },
      zoom,
      scroll,
      rendererSize
    });

    expect(tile).toEqual({ x: 0.25, y: -0 });
  });

  test('getItemAtTile() finds a node less than half a tile away', () => {
    const scene = {
      items: [{ id: 'server', tile: { x: 2.25, y: 3 } }],
      textBoxes: [],
      connectors: [],
      rectangles: []
    } as unknown as Parameters<typeof getItemAtTile>[0]['scene'];

    expect(getItemAtTile({ tile: { x: 2.5, y: 3 }, scene })).toEqual({
      type: 'ITEM',
      id: 'server'
    });
    expect(getItemAtTile({ tile: { x: 2.75, y: 3 }, scene })).toBeNull();
  });

  test('getItemAtTile() picks the nearest of two overlapping nodes', () => {
    const scene = {
      items: [
        { id: 'far', tile: { x: 0, y: 0 } },
        { id: 'near', tile: { x: 0.5, y: 0 } }
      ],
      textBoxes: [],
      connectors: [],
      rectangles: []
    } as unknown as Parameters<typeof getItemAtTile>[0]['scene'];

    expect(getItemAtTile({ tile: { x: 0.5, y: 0 }, scene })?.id).toBe('near');
  });

  test('getConnectorPath() routes on whole tiles and ends on the exact nodes', () => {
    const view = {
      id: 'view',
      name: 'View',
      items: [
        { id: 'a', tile: { x: 0.25, y: 0 } },
        { id: 'b', tile: { x: 4.75, y: 0.5 } }
      ],
      connectors: []
    } as unknown as View;
    const { tiles, rectangle } = getConnectorPath({
      anchors: [
        { id: 'a1', ref: { item: 'a' } },
        { id: 'a2', ref: { item: 'b' } }
      ],
      view
    });
    const toLocal = (tile: Coords) => {
      return { x: rectangle.from.x - tile.x, y: rectangle.from.y - tile.y };
    };

    expect(Number.isInteger(rectangle.from.x)).toBe(true);
    expect(Number.isInteger(rectangle.from.y)).toBe(true);
    expect(tiles[0]).toEqual(toLocal({ x: 0.25, y: 0 }));
    expect(tiles[tiles.length - 1]).toEqual(toLocal({ x: 4.75, y: 0.5 }));
    tiles.slice(1, -1).forEach((tile) => {
      expect(Number.isInteger(tile.x) && Number.isInteger(tile.y)).toBe(true);
    });
  });
});
