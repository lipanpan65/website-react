import * as React from 'react'
import { Tabs, TabsProps } from 'antd'
import ArticleList from '../ArticleList'

interface TabItem {
  key: string;
  label: string;
  children?: React.ReactNode;
  content?: string;
}

interface ArticleTabsProps {
  category: string; // 分类：recommended, backend, frontend
  onTabChange?: (key: string) => void;
  activeKey?: string;
  customItems?: TabItem[]; // 自定义标签页配置
  showHot?: boolean; // 是否显示热门标签页
  showArticleList?: boolean; // 是否显示文章列表
  className?: string;
  style?: React.CSSProperties;
}

const ArticleTabs: React.FC<ArticleTabsProps> = ({ 
  category, 
  onTabChange, 
  activeKey = 'recommend',
  customItems,
  showHot = false,
  showArticleList = false,
  className,
  style
}) => {

  // 根据分类生成不同的标签页内容
  const getTabContent = (tabKey: string) => {
    if (showArticleList) {
      return <ArticleList category={category} tabKey={tabKey} />;
    }
    
    switch (tabKey) {
      case 'recommend':
        return `${category} 推荐内容`;
      case 'latest':
        return `${category} 最新内容`;
      case 'hot':
        return `${category} 热门内容`;
      default:
        return `${category} 内容`;
    }
  };

  // 根据分类生成标签页配置
  const getTabItems = (): TabsProps['items'] => {
    // 如果有自定义配置，优先使用
    if (customItems) {
      return customItems.map(item => ({
        key: item.key,
        label: item.label,
        children: item.children || item.content || getTabContent(item.key),
      }));
    }

    const baseItems = [
      {
        key: 'recommend',
        label: '推荐',
        children: getTabContent('recommend'),
      },
      {
        key: 'latest',
        label: '最新',
        children: getTabContent('latest'),
      },
    ];

    // 为不同分类添加特定的标签页
    if (showHot || category === 'recommended') {
      baseItems.push({
        key: 'hot',
        label: '热门',
        children: getTabContent('hot'),
      });
    }

    return baseItems;
  };

  const handleTabChange = (key: string) => {
    console.log('Tab changed:', key, 'Category:', category);
    onTabChange?.(key);
  };

  return (
    <Tabs 
      items={getTabItems()} 
      activeKey={activeKey}
      onChange={handleTabChange}
      className={className}
      style={style}
    />
  );
};

export default ArticleTabs; 