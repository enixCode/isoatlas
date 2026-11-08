import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';

// Only what the editor really handles: keep in sync with useCopyPaste,
// useDeleteKey and useInteractionManager.
const SHORTCUTS = [
  ['Ctrl / ⌘ + C', 'Copy the selected element'],
  ['Ctrl / ⌘ + V', 'Paste it under the mouse'],
  ['Delete or Backspace', 'Delete the selected element'],
  ['Wheel', 'Pan up and down'],
  ['Shift + wheel', 'Pan sideways'],
  ['Ctrl / ⌘ + wheel, or pinch', 'Zoom'],
  ['Middle button drag', 'Pan'],
  ['Right click on a rectangle', 'Layer order']
];

interface Props {
  onClose: () => void;
}

export const ShortcutsDialog = ({ onClose }: Props) => {
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Keyboard shortcuts</DialogTitle>
      <DialogContent>
        <Table size="small">
          <TableBody>
            {SHORTCUTS.map(([keys, action]) => {
              return (
                <TableRow key={keys}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {keys}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{action}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};
