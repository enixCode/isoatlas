import React, { useEffect, useRef } from 'react';
import { useQuill } from 'react-quilljs';
import { Box } from '@mui/material';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: number;
  styles?: React.CSSProperties;
}

const tools = ['bold', 'italic', 'underline', 'strike', 'link'];

export const MarkdownEditor = ({
  value,
  onChange,
  readOnly,
  height = 120,
  styles
}: Props) => {
  const { quill, quillRef } = useQuill({
    theme: 'snow',
    readOnly,
    formats: tools,
    modules: { toolbar: readOnly ? false : tools }
  });
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  // Memorise le dernier HTML connu pour ne pas reinjecter ce que l'editeur vient d'emettre.
  const lastHtml = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!quill) return;

    const next = value ?? '';

    if (next === lastHtml.current) return;

    lastHtml.current = next;
    quill.clipboard.dangerouslyPasteHTML(next, 'silent');
  }, [quill, value]);

  useEffect(() => {
    if (!quill) return undefined;

    const onTextChange = () => {
      const html = quill.root.innerHTML;

      lastHtml.current = html;
      onChangeRef.current?.(html);
    };

    quill.on('text-change', onTextChange);

    return () => {
      quill.off('text-change', onTextChange);
    };
  }, [quill]);

  return (
    <Box
      sx={{
        '.ql-toolbar.ql-snow': {
          border: 'none',
          pt: 0,
          px: 0
        },
        '.ql-toolbar.ql-snow + .ql-container.ql-snow': {
          border: '1px solid',
          borderColor: 'grey.300',
          borderTop: 'auto',
          borderRadius: 1.5,
          height,
          color: 'text.secondary'
        },
        '.ql-container.ql-snow': {
          ...(readOnly ? { border: 'none' } : {}),
          ...styles
        },
        '.ql-editor': {
          ...(readOnly ? { p: 0 } : {})
        }
      }}
    >
      <div ref={quillRef} />
    </Box>
  );
};
