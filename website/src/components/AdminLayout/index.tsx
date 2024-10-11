import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';

import AdminHeader from './AdminHeader';

import {
  Link,
  NavLink,
  Outlet
} from "react-router-dom"

import { AdminRoute } from '@/routes'
import { getLeftActive, matchPath } from '@/utils';


const { Header, Content, Sider } = Layout;

const MenuLable = (v: any) => <Link to={`${v.url}`}>{v.name}</Link>


const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

const AdminLayout: React.FC = () => {
  console.log("Admin Layout")
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = React.useState(false);

  const [appMenu, setAppMeun] = React.useState<any>(() => {
    let [topMenu, topActive, leftMenu, leftActive]: any = [AdminRoute]
    if (topMenu) {
      topMenu.every((top: any) => {
        if (matchPath(top.hash, window.location.hash)) {
          topActive = top
          leftMenu = top.childs
          if (leftMenu) {
            leftActive = getLeftActive(leftMenu, window.location.hash);
          }
          return false;
        }
        return true
      })
    }
    console.log("============================")
    console.log("AdminLayout.topMenu", topMenu, topActive)
    console.log("AdminLayout.leftMenu", leftMenu, leftActive)
    console.log("============================")

    return {
      topMenu, topActive,
      leftMenu, leftActive
    }
  })

  // const [items, setItems] = React.useState<any>(() => {
  //   return appMenu.leftMenu.map((v: any) => {
  //     return {
  //       key: v.id,
  //       icon: v.icon,
  //       label: MenuLable(v)
  //     }
  //   })
  // })

  const onCollapsed = (collapsed: boolean) => {
    setCollapsed(collapsed)
  }

  return (
    <Layout>
      <AdminHeader
        collapsed={collapsed}
        onCollapsed={onCollapsed}
        funcs={appMenu.topMenu}
        active={appMenu.topActive}
        top={'首页'}
        appMenu={appMenu}
      />
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }} trigger={null} collapsible collapsed={collapsed}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items2}
          />
        </Sider>
        <div>
          <Outlet />
        </div>
        {/* <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              // padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            Content
          </Content>
        </Layout> */}
      </Layout>
    </Layout>
  );
};

export default AdminLayout;