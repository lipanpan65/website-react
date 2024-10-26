import React from 'react';
import BaseLayout from '@/components/AppLayout/BaseLayout';
import AppHeader from '../AppLayout/AppHeader';
import SliderMenu from './SliderMenu';
import { useAppMenu } from '@/hooks/state/useAppMenu';

const CreatorLayout: React.FC = () => {
  const { appMenu, shouldHideHeader } = useAppMenu({ visibleMenuIds: ["2"] });
  console.log("CreatorLayout", appMenu)

  // 使用 useEffect 监听路由变化，并更新页面标题
  React.useEffect(() => {
    // 获取当前激活的菜单项
    const { leftActive, topActive } = appMenu;
    // 更新 document.title
    const pageTitle = leftActive?.name || topActive?.name || '默认标题';
    document.title = pageTitle;
    console.log("Document title updated to: ", pageTitle);
  }, [appMenu]);  // 依赖 appMenu 的变化
  
  return (
    <BaseLayout
      header={!shouldHideHeader && <AppHeader appMenu={appMenu} />}
      sider={<SliderMenu appMenu={appMenu} />}
      nested={true}
    />
  );
};

export default CreatorLayout;
