import { produce } from 'immer';
import { model as modelFixture } from 'src/fixtures/model';
import * as reducers from 'src/stores/reducers';

const scene = {
  connectors: {},
  textBoxes: {}
};

const deleteNode1 = (model = modelFixture) => {
  return reducers.view({
    action: 'DELETE_VIEWITEM',
    payload: 'node1',
    ctx: { viewId: 'view1', state: { model, scene } }
  });
};

describe('View item reducers works correctly', () => {
  test('Deleting a node removes its model item', () => {
    const newState = deleteNode1();

    const ids = newState.model.items.map((item) => {
      return item.id;
    });

    expect(ids).not.toContain('node1');
  });

  test('A model item still placed in another view is kept', () => {
    const model = produce(modelFixture, (draft) => {
      draft.views.push({
        id: 'view2',
        name: 'View2',
        items: [{ id: 'node1', tile: { x: 0, y: 0 } }]
      });
    });

    const newState = deleteNode1(model);

    const ids = newState.model.items.map((item) => {
      return item.id;
    });

    expect(ids).toContain('node1');
  });
});
