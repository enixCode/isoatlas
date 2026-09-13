import { model as modelFixture } from 'src/fixtures/model';
import { SceneConnector } from 'src/types';
import { deleteConnector } from '../connector';

const path: SceneConnector['path'] = {
  tiles: [],
  rectangle: { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } }
};

const state = {
  model: modelFixture,
  scene: {
    connectors: {
      connector1: { path },
      connector2: { path }
    },
    textBoxes: {}
  }
};

describe('Connector reducers works correctly', () => {
  test('Deleting a connector removes it from the view', () => {
    const newState = deleteConnector('connector1', { viewId: 'view1', state });

    const ids = newState.model.views[0].connectors?.map((connector) => {
      return connector.id;
    });

    expect(ids).toStrictEqual(['connector2']);
  });

  test('Deleting a connector removes its path from the scene', () => {
    const newState = deleteConnector('connector1', { viewId: 'view1', state });

    expect(newState.scene.connectors.connector1).toBeUndefined();
    expect(newState.scene.connectors.connector2).toBeDefined();
  });
});
