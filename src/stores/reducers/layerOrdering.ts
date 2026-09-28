import { produce } from 'immer';
import { ItemReference, LayerOrderingAction } from 'src/types';
import { getItemByIdOrThrow } from 'src/utils';
import { State, ViewReducerContext } from './types';

export const changeLayerOrder = (
  { action, item }: { action: LayerOrderingAction; item: ItemReference },
  { viewId, state }: ViewReducerContext
): State => {
  const newState = produce(state, (draft) => {
    const view = getItemByIdOrThrow(draft.model.views, viewId);
    // The three arrays are only read through their id here, so the common
    // shape is enough and spares a union that splice would reject.
    let arr: { id: string }[];

    switch (item.type) {
      case 'RECTANGLE':
        arr = view.value.rectangles ?? [];
        break;
      case 'CONNECTOR':
        arr = view.value.connectors ?? [];
        break;
      case 'TEXTBOX':
        arr = view.value.textBoxes ?? [];
        break;
      default:
        throw new Error(`Cannot reorder an item of type ${item.type}`);
    }

    const target = getItemByIdOrThrow(arr, item.id);

    if (action === 'SEND_BACKWARD' && target.index < arr.length - 1) {
      arr.splice(target.index, 1);
      arr.splice(target.index + 1, 0, target.value);
    } else if (action === 'SEND_TO_BACK' && target.index !== arr.length - 1) {
      arr.splice(target.index, 1);
      arr.splice(arr.length, 0, target.value);
    } else if (action === 'BRING_FORWARD' && target.index > 0) {
      arr.splice(target.index, 1);
      arr.splice(target.index - 1, 0, target.value);
    } else if (action === 'BRING_TO_FRONT' && target.index !== 0) {
      arr.splice(target.index, 1);
      arr.splice(0, 0, target.value);
    }
  });

  return newState;
};
