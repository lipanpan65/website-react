import * as React from 'react';
import { FloatButton, theme } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import { AppRoute } from '@/routes';
import { getLeftActive, matchPath } from '@/utils';
import './index.css';

interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  hash: string;
  childs?: MenuItem[];
}

interface AppMenu {
  topMenu: MenuItem[];
  topActive: MenuItem | null;
  leftMenu: MenuItem[];
  leftActive: MenuItem | null;
}


const AppLayout: React.FC = () => {
  const { token: { borderRadiusLG } } = theme.useToken();
  const location = useLocation();

  // 初始化菜单信息
  const appMenu = React.useMemo(() => initializeAppMenu(window.location.hash), [window.location.hash]);

  // 判断是否需要隐藏 AppHeader
  const shouldHideHeader = React.useMemo(() => {
    // 设定需要隐藏 Header 的路径
    const hiddenPaths = ['/user/article/editor/new', '/login', '/forgot-password'];
    return hiddenPaths.includes(location.pathname);
  }, [location.pathname]);
  
  const appLayoutStyle: React.CSSProperties = {
    // padding: '16px', // 外层容器的默认样式
    // height: '100vh',
    backgroundColor: 'pink'
  };

  return (
    <React.Fragment>
      {!shouldHideHeader && <AppHeader appMenu={appMenu} />}
      <div style={appLayoutStyle}>
        <Outlet />
        <FloatButton.BackTop />
      </div>
    </React.Fragment>
  );
};

// 初始化菜单信息
const initializeAppMenu = (currentPath: string): AppMenu => {
  const topMenu: MenuItem[] = AppRoute;
  let topActive: MenuItem | null = null;
  let leftMenu: MenuItem[] = [];
  let leftActive: MenuItem | null = null;

  topMenu.some((top) => {
    if (matchPath(top.hash, currentPath)) {
      topActive = top;
      leftMenu = top.childs || [];
      leftActive = getLeftActive(leftMenu, currentPath);
      return true;
    }
    return false;
  });

  return { topMenu, topActive, leftMenu, leftActive };
};

export default AppLayout;
