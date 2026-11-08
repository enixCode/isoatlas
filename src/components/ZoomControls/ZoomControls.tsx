import React, { useMemo } from 'react';
import {
  Add as ZoomInIcon,
  Remove as ZoomOutIcon,
  CropFreeOutlined as FitToScreenIcon
} from '@mui/icons-material';
import { Stack, Box, Typography, Divider } from '@mui/material';
import { toPx, isBoundsOutOfViewport } from 'src/utils';
import { UiElement } from 'src/components/UiElement/UiElement';
import { IconButton } from 'src/components/IconButton/IconButton';
import { MAX_ZOOM, MIN_ZOOM } from 'src/config';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useDiagramUtils } from 'src/hooks/useDiagramUtils';
import { useScene } from 'src/hooks/useScene';

export const ZoomControls = () => {
  const uiStateStoreActions = useUiStateStore((state) => {
    return state.actions;
  });
  const zoom = useUiStateStore((state) => {
    return state.zoom;
  });
  const scroll = useUiStateStore((state) => {
    return state.scroll;
  });
  const { currentView } = useScene();
  const { fitToView, getUnprojectedBounds, rendererSize } = useDiagramUtils();
  // Computed once per view change, not on every pan frame.
  const bounds = useMemo(() => {
    return getUnprojectedBounds();
  }, [getUnprojectedBounds]);

  const hasContent =
    currentView.items.length > 0 ||
    (currentView.connectors ?? []).length > 0 ||
    (currentView.rectangles ?? []).length > 0 ||
    (currentView.textBoxes ?? []).length > 0;

  // Like Excalidraw: fit to screen only shows once the whole diagram is off screen.
  const isOutOfView =
    hasContent &&
    rendererSize.width > 0 &&
    isBoundsOutOfViewport({
      bounds,
      zoom,
      scroll: scroll.position,
      rendererSize
    });

  return (
    <Stack direction="row" spacing={1}>
      <UiElement>
        <Stack direction="row">
          <IconButton
            name="Zoom out"
            Icon={<ZoomOutIcon />}
            onClick={uiStateStoreActions.decrementZoom}
            disabled={zoom >= MAX_ZOOM}
          />
          <Divider orientation="vertical" flexItem />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: toPx(60)
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {Math.ceil(zoom * 100)}%
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <IconButton
            name="Zoom in"
            Icon={<ZoomInIcon />}
            onClick={uiStateStoreActions.incrementZoom}
            disabled={zoom <= MIN_ZOOM}
          />
        </Stack>
      </UiElement>
      {isOutOfView && (
        <UiElement>
          <IconButton
            name="Fit to screen"
            Icon={<FitToScreenIcon />}
            onClick={fitToView}
          />
        </UiElement>
      )}
    </Stack>
  );
};
