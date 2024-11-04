import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
// import { indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
// import { keymap } from '@codemirror/view';

interface CodeMirrorEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    // 初始化 CodeMirror 实例
    if (editorRef.current && !editorViewRef.current) {
      const state = EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          javascript(),
          // keymap.of([indentWithTab]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
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
    }
  }, []);

  useEffect(() => {
    // 更新 CodeMirror 内容
    if (editorViewRef.current) {
      const currentDoc = editorViewRef.current.state.doc.toString();
      if (currentDoc !== value) {
        editorViewRef.current.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: value || '' },
        });
      }
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      style={{
        minHeight: 20,
        // border: '1px solid #ccc',
        // borderRadius: '4px'
      }}
    />
  );
};

export default CodeMirrorEditor;
