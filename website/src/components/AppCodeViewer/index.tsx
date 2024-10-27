import React from 'react';
import AppCode from '../AppCode';
import codeSnippets from '@/common/codeSnippets';

interface AppCodeViewerProps {
  codeKey: string;
}

const AppCodeViewer: React.FC<AppCodeViewerProps> = ({ codeKey }) => {
  const codeItem = codeSnippets[codeKey];

  if (!codeItem) {
    return <div>找不到对应的代码示例</div>;
  }

  return (
    <AppCode language="javascript" value={codeItem.code} title={codeItem.title} />
  );
};

export default AppCodeViewer;
