import React from 'react';
import { useScene } from 'src/hooks/useScene';
import { Rectangle } from './Rectangle';

interface Props {
  rectangles: ReturnType<typeof useScene>['rectangles'];
}

const RectanglesBase = ({ rectangles }: Props) => {
  return (
    <>
      {[...rectangles].reverse().map((rectangle) => {
        return <Rectangle key={rectangle.id} {...rectangle} />;
      })}
    </>
  );
};

export const Rectangles = React.memo(RectanglesBase);
