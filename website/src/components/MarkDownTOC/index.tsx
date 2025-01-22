import React, { useEffect, useState } from 'react';
import { Anchor } from 'antd';

interface NavItem {
  index: number;
  level: number;
  text: string;
  id: string;
  children?: NavItem[];
}

interface MarkDownTOCProps {
  source: string;
  offsetTop?: number;
}

// 解析 Markdown 标题为树形结构
const parseMarkdownToTree = (source: string): NavItem[] => {

  // Step 1: 去掉代码块
  // 匹配多行代码块（包括 ``` 和 `），并替换为空字符串
  const cleanedSource = source.replace(/```[\s\S]*?```|`[^`]+`/g, '');

  // Step 2: 解析剩余的 Markdown 标题
  const headings = cleanedSource.match(/(#+\s.*)/g);
  if (!headings) return [];

  const root: NavItem[] = [];
  const stack: NavItem[] = [];

  headings.forEach((heading, index) => {
    const levelMatch = heading.match(/^#+/);
    const level = levelMatch ? levelMatch[0].length : 1;
    const text = heading.replace(/^#+\s*/, '').trim();
    const id = `heading-${index}`;

    const newNode: NavItem = { index, level, text, id };

    // 构建树形结构
    while (stack.length && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(newNode);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(newNode);
    }

    stack.push(newNode);
  });

  return root;
};

// 为文章中的标题元素动态添加 ID
const addIdToHeadings = () => {
  const container = document.querySelector('.article-body .markdown-body');
  if (!container) return;

  const headings = container.querySelectorAll('h1:not(.article-title), h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    heading.setAttribute('id', `heading-${index}`);
  });
};

// 平滑滚动到指定元素
const smoothScrollToElement = (id: string, offset: number = 0) => {
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: 'smooth',
    });
  }
};

const updateHash = (hash: string) => {
  if (!hash) return;

  // 获取当前 URL 并去掉所有哈希部分
  const currentUrl = window.location.href;

  // 提取基础路径并保留 #/user/article/detail/25 部分
  const basePathMatch = currentUrl.match(/(.*#\/[^#]*)/);
  const basePath = basePathMatch ? basePathMatch[1] : currentUrl.split('#')[0];

  // 拼接新的完整哈希路径
  const newUrl = `${basePath}#${hash}`;

  // 更新浏览器 URL
  window.history.replaceState({}, '', newUrl);
};



// 递归生成 Anchor 项目
const renderAnchorItems = (items: NavItem[]): any[] => {
  return items.map((item) => ({
    key: item.id,
    href: `#${item.id}`,
    title: item.text,
    children: item.children ? renderAnchorItems(item.children) : null,
  }));
};

const MarkDownTOC: React.FC<MarkDownTOCProps> = ({ source, offsetTop = 0 }) => {
  const [navTree, setNavTree] = useState<NavItem[]>([]);
  const [activeLink, setActiveLink] = useState<string>('');

  useEffect(() => {
    const tree = parseMarkdownToTree(source);
    setNavTree(tree);
    addIdToHeadings(); // 动态为标题元素添加 ID
  }, [source]);

  // 添加 hashchange 监听器
  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash) {
        smoothScrollToElement(newHash, offsetTop);
        setActiveLink(`#${newHash}`);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [offsetTop]);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      const currentId = getCurrentVisibleHeading(navTree, offsetTop);

      if (currentId && currentId !== activeLink) {
        setActiveLink(`#${currentId}`);
        updateHash(currentId); // 更新 URL 中的哈希
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navTree, offsetTop, activeLink]);

  // 获取当前可视区域的标题 ID
  const getCurrentVisibleHeading = (navItems: NavItem[], offset: number): string | null => {
    let currentVisibleId: string | null = null;

    const traverseTree = (items: NavItem[]) => {
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset) {
            currentVisibleId = item.id;
          }
        }
        if (item.children) traverseTree(item.children);
      }
    };

    traverseTree(navItems);
    return currentVisibleId;
  };

  // 生成树形的 <Anchor> 导航
  const anchorItems = renderAnchorItems(navTree);

  return (
    <>
      <Anchor
        items={anchorItems}
        offsetTop={offsetTop}
        affix={false}
        onClick={(e, link) => {
          e.preventDefault(); // 阻止默认行为
          const newHash = link.href.replace('#', '');
          smoothScrollToElement(newHash, offsetTop); // 平滑滚动到目标
          updateHash(newHash); // 更新 URL 哈希
          setActiveLink(link.href);
        }}
      />
    </>

  );
};

export default MarkDownTOC;
