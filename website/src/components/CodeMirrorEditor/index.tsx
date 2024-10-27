import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';

interface CodeMirrorEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            const newValue = update.state.doc.toString();
            onChange(newValue);
          }
        }),
      ],
    });

    editorViewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
      }
    };
  }, [value, onChange]);

  return <div ref={editorRef} />;
};

export default CodeMirrorEditor;
