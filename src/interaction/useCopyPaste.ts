import { useEffect } from 'react';
import { useModelStore } from 'src/stores/modelStore';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useScene } from 'src/hooks/useScene';
import { generateId, getItemByIdOrThrow, isTextField } from 'src/utils';
import {
  CLIPBOARD_TYPE,
  ClipboardContent,
  parseClipboard,
  placeClipboardContent
} from 'src/utils/clipboard';

// An optional reference (icon, colour) must exist in the diagram it lands in.
const isKnownRef = (list: { id: string }[], ref?: string) => {
  return (
    !ref ||
    list.some((entry) => {
      return entry.id === ref;
    })
  );
};

// Ctrl+C / Ctrl+V on the selected element. Like Excalidraw, it goes through the
// browser's copy and paste events: no permission prompt, and the content can
// be pasted in another tab.
export const useCopyPaste = () => {
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const modelActions = useModelStore((state) => {
    return state.actions;
  });
  const scene = useScene();

  useEffect(() => {
    const onCopy = (e: ClipboardEvent) => {
      const { editorMode, itemControls } = uiStateActions.get();

      if (editorMode !== 'EDITABLE' || isTextField(e.target)) return;
      if (!itemControls || itemControls.type === 'ADD_ITEM') return;

      const { currentView } = scene;
      let content: ClipboardContent | null = null;

      if (itemControls.type === 'ITEM') {
        content = {
          type: CLIPBOARD_TYPE,
          kind: 'ITEM',
          modelItem: getItemByIdOrThrow(
            modelActions.get().items,
            itemControls.id
          ).value,
          viewItem: getItemByIdOrThrow(currentView.items, itemControls.id).value
        };
      } else if (itemControls.type === 'RECTANGLE') {
        content = {
          type: CLIPBOARD_TYPE,
          kind: 'RECTANGLE',
          rectangle: getItemByIdOrThrow(
            currentView.rectangles ?? [],
            itemControls.id
          ).value
        };
      } else if (itemControls.type === 'TEXTBOX') {
        content = {
          type: CLIPBOARD_TYPE,
          kind: 'TEXTBOX',
          textBox: getItemByIdOrThrow(
            currentView.textBoxes ?? [],
            itemControls.id
          ).value
        };
      }

      if (!content) return;

      e.preventDefault();
      e.clipboardData?.setData('text/plain', JSON.stringify(content));
    };

    const onPaste = (e: ClipboardEvent) => {
      const uiState = uiStateActions.get();

      if (uiState.editorMode !== 'EDITABLE' || isTextField(e.target)) return;

      const copied = parseClipboard(
        e.clipboardData?.getData('text/plain') ?? ''
      );

      if (!copied) return;

      e.preventDefault();

      const id = generateId();
      const content = placeClipboardContent(
        copied,
        uiState.mouse.position.tile,
        id
      );
      const { icons, colors } = modelActions.get();

      // From another diagram, an icon or colour may be missing here: the
      // element would point to nothing, so the paste is dropped.
      if (content.kind === 'ITEM') {
        if (!isKnownRef(icons, content.modelItem.icon)) return;

        scene.createModelItem(content.modelItem);
        scene.createViewItem(content.viewItem);
      } else if (content.kind === 'RECTANGLE') {
        if (!isKnownRef(colors, content.rectangle.color)) return;

        scene.createRectangle(content.rectangle);
      } else {
        scene.createTextBox(content.textBox);
      }

      uiState.actions.setItemControls({ type: content.kind, id });
    };

    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);

    return () => {
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
    };
  }, [uiStateActions, modelActions, scene]);
};
