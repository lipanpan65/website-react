import * as React from 'react'
import ArticleTabs from '@/components/ArticleTabs'

const Recommended: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>('recommend');

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // 这里可以添加获取对应数据的逻辑
    console.log('Recommended tab changed to:', key);
  };

  return (
    <ArticleTabs 
      category="recommended"
      // showHot={true} // 是否显示热门标签，默认不显示
      activeKey={activeTab}
      onTabChange={handleTabChange}
      // customItems={[
      //   { key: 'featured', label: '精选', content: '精选内容' }
      // ]}
    />
  );
};

export default Recommended;
