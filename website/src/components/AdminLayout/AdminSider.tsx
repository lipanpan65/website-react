import * as React from "react";
import { Layout, Menu, theme } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  childs?: MenuItem[];
}

interface AdminSiderProps {
  collapsed: boolean;
  appMenu: {
    topMenu: MenuItem[];
    topActive: MenuItem | null;
    leftMenu: MenuItem[];
    leftActive: MenuItem | null;
  };
}

const AdminSider: React.FC<AdminSiderProps> = ({ collapsed, appMenu }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const location = useLocation();

  // 动态生成菜单项
  // const items: MenuProps['items'] = React.useMemo(() => generateMenuItems(appMenu.leftMenu), [appMenu.leftMenu]);
  const items: MenuProps['items'] = React.useMemo(() => generateMenuItems(appMenu.leftMenu), [appMenu.leftMenu]);

  // 自动选择当前路径对应的菜单项
  const defaultSelectedKeys = appMenu.leftActive ? [appMenu.leftActive.id] : [];
  // const defaultOpenKeys = appMenu.leftMenu.map((item) => item.id);
  return (
    <Sider
      width={200}
      style={{ background: colorBgContainer }}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <Menu
        mode="inline"
        selectedKeys={defaultSelectedKeys}  // 动态设置 selectedKeys
        // defaultSelectedKeys={defaultSelectedKeys}
        // defaultOpenKeys={defaultOpenKeys}
        style={{ height: '100%', borderRight: 0 }}
        items={items}
      />
    </Sider>
  );
};

// 动态生成菜单项
const generateMenuItems = (menuData: MenuItem[]): MenuProps['items'] =>
  menuData.map((item) => ({
    key: item.id,
    icon: item.icon,
    label: <Link to={item.url}>{item.name}</Link>,
    children: item.childs?.map((subItem) => ({
      key: subItem.id,
      icon: subItem.icon,
      label: <Link to={subItem.url}>{subItem.name}</Link>,
    })),
  }));

export default AdminSider;
