import { useEffect } from 'react';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useScene } from 'src/hooks/useScene';
import { ItemControls } from 'src/types';
import { isTextField } from 'src/utils';

type SceneDeletes = Pick<
  ReturnType<typeof useScene>,
  'deleteViewItem' | 'deleteRectangle' | 'deleteTextBox' | 'deleteConnector'
>;

// Same calls, in the same order, as the Delete button of each side panel:
// the selection is cleared first, the panel would read a deleted item.
// Returns false when the selection is nothing that can be deleted.
export const deleteSelectedItem = (
  itemControls: ItemControls | null,
  scene: SceneDeletes,
  clearSelection: () => void
) => {
  if (!itemControls) return false;

  const remove: Partial<Record<ItemControls['type'], (id: string) => void>> = {
    ITEM: scene.deleteViewItem,
    RECTANGLE: scene.deleteRectangle,
    TEXTBOX: scene.deleteTextBox,
    CONNECTOR: scene.deleteConnector
  };
  const removeItem = remove[itemControls.type];

  if (!removeItem || !('id' in itemControls)) return false;

  clearSelection();
  removeItem(itemControls.id);

  return true;
};

// Delete, or Backspace since the Mac key labelled "delete" sends it (as in
// Excalidraw).
export const isDeleteKey = (key: string) => {
  return key === 'Delete' || key === 'Backspace';
};

// The delete keys remove the selected element, like its Delete button.
export const useDeleteKey = () => {
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const scene = useScene();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isDeleteKey(e.key)) return;

      const { editorMode, itemControls } = uiStateActions.get();

      if (editorMode !== 'EDITABLE' || isTextField(e.target)) return;

      const isDeleted = deleteSelectedItem(itemControls, scene, () => {
        uiStateActions.setItemControls(null);
      });

      if (isDeleted) e.preventDefault();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [uiStateActions, scene]);
};
