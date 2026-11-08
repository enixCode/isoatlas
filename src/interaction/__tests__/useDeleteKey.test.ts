import { deleteSelectedItem } from '../useDeleteKey';

const makeScene = () => {
  return {
    deleteViewItem: jest.fn(),
    deleteRectangle: jest.fn(),
    deleteTextBox: jest.fn(),
    deleteConnector: jest.fn()
  };
};

describe('deleteSelectedItem()', () => {
  test.each([
    ['ITEM', 'deleteViewItem'],
    ['RECTANGLE', 'deleteRectangle'],
    ['TEXTBOX', 'deleteTextBox'],
    ['CONNECTOR', 'deleteConnector']
  ] as const)('deletes a selected %s with %s', (type, method) => {
    const scene = makeScene();
    const clearSelection = jest.fn();

    expect(deleteSelectedItem({ type, id: 'a' }, scene, clearSelection)).toBe(
      true
    );
    expect(scene[method]).toHaveBeenCalledWith('a');
    // Cleared before the delete, as the side panels do.
    expect(clearSelection.mock.invocationCallOrder[0]).toBeLessThan(
      scene[method].mock.invocationCallOrder[0]
    );
  });

  test('does nothing without a deletable selection', () => {
    const scene = makeScene();
    const clearSelection = jest.fn();

    expect(deleteSelectedItem(null, scene, clearSelection)).toBe(false);
    expect(
      deleteSelectedItem({ type: 'ADD_ITEM' }, scene, clearSelection)
    ).toBe(false);
    expect(
      deleteSelectedItem(
        { type: 'CONNECTOR_ANCHOR', id: 'a' },
        scene,
        clearSelection
      )
    ).toBe(false);
    expect(clearSelection).not.toHaveBeenCalled();
    Object.values(scene).forEach((fn) => {
      expect(fn).not.toHaveBeenCalled();
    });
  });
});
