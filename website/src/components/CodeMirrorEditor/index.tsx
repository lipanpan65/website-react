import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';

interface CodeMirrorEditorProps {
  value: string;
  onChange: (value: string) => void;
  lines?: number; // 新增一个属性以指定行数
}

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({ value, onChange, lines = 5 }) => {
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
        minHeight: `${lines * 20}px`, // 根据行数计算高度，假设每行 20px
        maxHeight: '300px', // 可选的最大高度
        overflow: 'auto', // 允许内容超出时滚动
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        padding: '8px',
      }}
    />
  );
};

export default CodeMirrorEditor;
