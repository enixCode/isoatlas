import React from 'react';
import { useScene } from 'src/hooks/useScene';
import { ConnectorLabel } from './ConnectorLabel';

interface Props {
  connectors: ReturnType<typeof useScene>['connectors'];
}

const ConnectorLabelsBase = ({ connectors }: Props) => {
  return (
    <>
      {connectors
        .filter((connector) => {
          return Boolean(connector.description);
        })
        .map((connector) => {
          return <ConnectorLabel key={connector.id} connector={connector} />;
        })}
    </>
  );
};

export const ConnectorLabels = React.memo(ConnectorLabelsBase);
