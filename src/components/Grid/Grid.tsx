import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import gsap from 'gsap';
import { Size } from 'src/types';
import gridTileSvg from 'src/assets/grid-tile-bg.svg';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { PROJECTED_TILE_SIZE } from 'src/config';
import { SizeUtils } from 'src/utils/SizeUtils';
import { useResizeObserver } from 'src/hooks/useResizeObserver';

export const Grid = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { size } = useResizeObserver(elementRef.current);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const scroll = useUiStateStore((state) => {
    return state.scroll;
  });
  const zoom = useUiStateStore((state) => {
    return state.zoom;
  });

  useEffect(() => {
    if (!elementRef.current) return;

    const tileSize = SizeUtils.multiply(PROJECTED_TILE_SIZE, zoom);
    const elSize = elementRef.current.getBoundingClientRect();
    // The svg covers one tile cell, whose two diagonals cross at its center:
    // that center lands on a tile corner, half a tile right of the origin.
    const backgroundPosition: Size = {
      width: elSize.width / 2 + scroll.position.x,
      height: elSize.height / 2 + scroll.position.y - tileSize.height / 2
    };

    gsap.set(elementRef.current, {
      backgroundSize: `${tileSize.width}px ${tileSize.height}px`,
      backgroundPosition: `${backgroundPosition.width}px ${backgroundPosition.height}px`
    });

    // No longer about animation: this second render is what finally hands
    // useResizeObserver an element (elementRef.current is null on the first
    // render). Without it, the grid does not realign when the window resizes.
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [scroll, zoom, isFirstRender, size]);

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <Box
        ref={elementRef}
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `repeat url("${gridTileSvg}")`
        }}
      />
    </Box>
  );
};
