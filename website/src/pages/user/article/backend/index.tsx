import * as React from 'react'
import ArticleTabs from '@/components/ArticleTabs'

const Backend: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>('recommend');

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // 这里可以添加获取对应数据的逻辑
    console.log('Backend tab changed to:', key);
  };

  return (
    <ArticleTabs 
      category="backend"
      activeKey={activeTab}
      onTabChange={handleTabChange}
    />
  );
};

export default Backend;