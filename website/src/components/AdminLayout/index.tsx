import React, { useMemo, useState } from 'react';
import { Layout, theme } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSider from './AdminSider';
import { AdminRoute } from '@/routes';
import { matchPath, getLeftActive } from '@/utils';

const { Content } = Layout;

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

const AdminLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // 使用 useMemo 缓存菜单数据
  // const appMenu = useMemo(() => initializeAppMenu(location.pathname), [location.pathname]);
  const appMenu = useMemo(() => initializeAppMenu(window.location.hash), [window.location.hash]);

  const onCollapsed = (collapsed: boolean) => setCollapsed(collapsed);

  return (
    <Layout>
      <AdminHeader
        appMenu={appMenu}
        collapsed={collapsed}
        onCollapsed={onCollapsed}
      />
      <Layout>
        <AdminSider collapsed={collapsed} appMenu={appMenu} />
        {/* <div>
          <Outlet />
        </div> */}
        <Layout style={{
          // padding: '0 24px 24px'
        }}>
          <Content style={{
            // background: colorBgContainer, 
            // borderRadius: 0
          }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

// 初始化菜单信息
const initializeAppMenu = (currentPath: string): AppMenu => {
  const topMenu: MenuItem[] = AdminRoute;
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
  console.log("initializeAppMenu.currentPath===>", currentPath)
  console.log("initializeAppMenu.leftActive===>", leftActive)
  return { topMenu, topActive, leftMenu, leftActive };
};

export default AdminLayout;
