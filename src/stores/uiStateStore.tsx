import React, { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import gsap from 'gsap';
import { CoordsUtils, getStartingMode, clamp } from 'src/utils';
import { Coords, UiStateStore } from 'src/types';
import {
  INITIAL_UI_STATE,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_INCREMENT,
  ZOOM_SENSITIVITY
} from 'src/config';

const initialState = () => {
  // The zoom glides toward its target instead of jumping on every notch.
  const glide = { zoom: INITIAL_UI_STATE.zoom };
  let target = INITIAL_UI_STATE.zoom;

  return createStore<UiStateStore>((set, get) => {
    // `pointer` is relative to the renderer centre, where SceneLayers anchor.
    const zoomTowards = (delta: number, pointer: Coords) => {
      // While a glide runs, add to its target so quick notches stack up.
      const base = gsap.isTweening(glide) ? target : get().zoom;
      target = clamp(base + delta, MIN_ZOOM, MAX_ZOOM);
      glide.zoom = get().zoom;

      gsap.to(glide, {
        zoom: target,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
        onUpdate: () => {
          const { zoom, scroll } = get();
          // Keep the point under the pointer fixed by translating by the same ratio.
          const ratio = glide.zoom / zoom;

          set({
            zoom: glide.zoom,
            scroll: {
              ...scroll,
              position: {
                x: pointer.x * (1 - ratio) + scroll.position.x * ratio,
                y: pointer.y * (1 - ratio) + scroll.position.y * ratio
              }
            }
          });
        }
      });
    };

    return {
      zoom: INITIAL_UI_STATE.zoom,
      scroll: INITIAL_UI_STATE.scroll,
      view: '',
      mainMenuOptions: [],
      editorMode: 'EXPLORABLE_READONLY',
      mode: getStartingMode('EXPLORABLE_READONLY'),
      iconCategoriesState: [],
      isMainMenuOpen: false,
      dialog: null,
      rendererEl: null,
      contextMenu: null,
      mouse: {
        position: { screen: CoordsUtils.zero(), tile: CoordsUtils.zero() },
        mousedown: null,
        delta: null
      },
      itemControls: null,
      enableDebugTools: false,
      actions: {
        get,
        setView: (view) => {
          set({ view });
        },
        setMainMenuOptions: (mainMenuOptions) => {
          set({ mainMenuOptions });
        },
        setEditorMode: (mode) => {
          set({ editorMode: mode, mode: getStartingMode(mode) });
        },
        setIconCategoriesState: (iconCategoriesState) => {
          set({ iconCategoriesState });
        },
        resetUiState: () => {
          set({
            mode: getStartingMode(get().editorMode),
            scroll: {
              position: CoordsUtils.zero(),
              offset: CoordsUtils.zero()
            },
            itemControls: null,
            zoom: 1
          });
        },
        setMode: (mode) => {
          set({ mode });
        },
        setDialog: (dialog) => {
          set({ dialog });
        },
        setIsMainMenuOpen: (isMainMenuOpen) => {
          set({ isMainMenuOpen, itemControls: null });
        },
        // The buttons zoom around the centre of the view.
        incrementZoom: () => {
          zoomTowards(ZOOM_INCREMENT, CoordsUtils.zero());
        },
        decrementZoom: () => {
          zoomTowards(-ZOOM_INCREMENT, CoordsUtils.zero());
        },
        zoomBy: (deltaY, pointer) => {
          zoomTowards(-deltaY * ZOOM_SENSITIVITY, pointer);
        },
        scrollBy: (delta) => {
          const { scroll } = get();

          set({
            scroll: {
              ...scroll,
              position: {
                x: scroll.position.x + delta.x,
                y: scroll.position.y + delta.y
              }
            }
          });
        },
        setZoom: (zoom) => {
          set({ zoom });
        },
        setScroll: ({ position, offset }) => {
          set({ scroll: { position, offset: offset ?? get().scroll.offset } });
        },
        setItemControls: (itemControls) => {
          set({ itemControls });
        },
        setContextMenu: (contextMenu) => {
          set({ contextMenu });
        },
        setMouse: (mouse) => {
          set({ mouse });
        },
        setEnableDebugTools: (enableDebugTools) => {
          set({ enableDebugTools });
        },
        setRendererEl: (el) => {
          set({ rendererEl: el });
        }
      }
    };
  });
};

const UiStateContext = createContext<ReturnType<typeof initialState> | null>(
  null
);

interface ProviderProps {
  children: React.ReactNode;
}

// TODO: Typings below are pretty gnarly due to the way Zustand works.
// see https://github.com/pmndrs/zustand/discussions/1180#discussioncomment-3439061
export const UiStateProvider = ({ children }: ProviderProps) => {
  const storeRef = useRef<ReturnType<typeof initialState> | undefined>(
    undefined
  );

  if (!storeRef.current) {
    storeRef.current = initialState();
  }

  return (
    <UiStateContext.Provider value={storeRef.current}>
      {children}
    </UiStateContext.Provider>
  );
};

export function useUiStateStore<T>(selector: (state: UiStateStore) => T) {
  const store = useContext(UiStateContext);

  if (store === null) {
    throw new Error('Missing provider in the tree');
  }

  const value = useStore(store, selector);
  return value;
}
