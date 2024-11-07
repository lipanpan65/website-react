// codeSnippets/index.tsx

import appSearchGuideMapping from './AppSearchGuide';

// 合并所有代码映射
const codeMapping: Record<string, { code: string, title: string }> = {
    ...appSearchGuideMapping,
    // 如果有其他代码映射，也可以在这里合并
};

export default codeMapping;
