import { produce } from 'immer';
import { model as modelFixture } from 'src/fixtures/model';
import * as reducers from 'src/stores/reducers';

const scene = {
  connectors: {},
  textBoxes: {}
};

const renameView = (viewId: string, model = modelFixture) => {
  return reducers.view({
    action: 'UPDATE_VIEW',
    payload: { name: 'Renamed' },
    ctx: { viewId, state: { model, scene } }
  });
};

describe('View reducers works correctly', () => {
  test('Updating a view renames it and keeps its other fields', () => {
    const newState = renameView('view1');

    expect(newState.model.views[0]).toEqual({
      ...modelFixture.views[0],
      name: 'Renamed',
      lastUpdated: expect.any(String)
    });
  });

  test('Updating a view leaves the other views untouched', () => {
    const model = produce(modelFixture, (draft) => {
      draft.views.push({ id: 'view2', name: 'View2', items: [] });
    });

    const newState = renameView('view1', model);

    expect(newState.model.views[1]).toEqual(model.views[1]);
  });

  test('Updating an unknown view throws', () => {
    expect(() => {
      return renameView('unknownView');
    }).toThrow('Item with id "unknownView" not found.');
  });
});
