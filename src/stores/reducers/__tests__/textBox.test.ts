import { produce } from 'immer';
import { model as modelFixture } from 'src/fixtures/model';
import { SceneTextBox } from 'src/types';
import { deleteTextBox } from '../textBox';

const size: SceneTextBox['size'] = { width: 1, height: 1 };

const getState = () => {
  return {
    model: produce(modelFixture, (draft) => {
      draft.views[0].textBoxes = [
        { id: 'textBox1', tile: { x: 0, y: 0 }, content: 'One' },
        { id: 'textBox2', tile: { x: 1, y: 1 }, content: 'Two' }
      ];
    }),
    scene: {
      connectors: {},
      textBoxes: {
        textBox1: { size },
        textBox2: { size }
      }
    }
  };
};

describe('TextBox reducers works correctly', () => {
  test('Deleting a text box removes it from the view', () => {
    const newState = deleteTextBox('textBox1', {
      viewId: 'view1',
      state: getState()
    });

    const ids = newState.model.views[0].textBoxes?.map((textBox) => {
      return textBox.id;
    });

    expect(ids).toStrictEqual(['textBox2']);
  });

  test('Deleting a text box removes its size from the scene', () => {
    const newState = deleteTextBox('textBox1', {
      viewId: 'view1',
      state: getState()
    });

    expect(newState.scene.textBoxes.textBox1).toBeUndefined();
    expect(newState.scene.textBoxes.textBox2).toBeDefined();
  });
});
