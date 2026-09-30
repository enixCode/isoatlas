import React, { useCallback, useRef, useState } from 'react';
import { InputBase, Typography } from '@mui/material';

// Same bound as constrainedStrings.name in src/schemas/common.ts.
const MAX_LENGTH = 100;

interface Props {
  value: string;
  onChange: (newValue: string) => void;
  isEditable: boolean;
}

export const EditableText = ({ value, onChange, isEditable }: Props) => {
  // null means "not editing".
  const [draft, setDraft] = useState<string | null>(null);
  // Escape blurs the field too, so onBlur must know the edit was cancelled.
  const isCancelledRef = useRef(false);

  const startEditing = useCallback(() => {
    setDraft(value);
  }, [value]);

  const onDraftChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft(e.target.value);
    },
    []
  );

  const onFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.select();
    },
    []
  );

  const onBlur = useCallback(() => {
    const nextValue = draft?.trim() ?? '';

    if (!isCancelledRef.current && nextValue && nextValue !== value) {
      onChange(nextValue);
    }

    isCancelledRef.current = false;
    setDraft(null);
  }, [draft, value, onChange]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === 'Escape') isCancelledRef.current = true;
      if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur();
    },
    []
  );

  if (!isEditable || draft === null) {
    return (
      <Typography
        // The overlay container disables pointer events, re-enable them here.
        sx={{
          fontWeight: 600,
          ...(isEditable && { pointerEvents: 'auto', cursor: 'text' })
        }}
        color="text.secondary"
        onClick={isEditable ? startEditing : undefined}
      >
        {value}
      </Typography>
    );
  }

  return (
    <InputBase
      autoFocus
      value={draft}
      onChange={onDraftChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      slotProps={{
        input: { maxLength: MAX_LENGTH, size: Math.max(draft.length, 1) }
      }}
      sx={{
        fontWeight: 600,
        color: 'text.secondary',
        lineHeight: 1.2,
        pointerEvents: 'auto',
        '& .MuiInputBase-input': { p: 0, height: 'auto' }
      }}
    />
  );
};
