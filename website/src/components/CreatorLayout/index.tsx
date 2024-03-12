import * as React from 'react'
import BaseLayout from '../BaseLayout'
import type { MenuProps } from 'antd';
import { Layout, Flex, Menu, Row, Col, theme } from 'antd'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import VerticalMenu from './VerticalMenu';
import './index.css'
import { Outlet } from 'react-router-dom'
import { routeMap } from '../../routes'
import AppHeader from '../AppLayout/AppHeader';

type MenuItem = Required<MenuProps>['items'][number];

const { Header, Footer, Sider, Content } = Layout

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
  ]),

  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),

  { type: 'divider' },

  getItem('Navigation Three', 'sub4', <SettingOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
  getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
];

console.log('==============================')
console.log('items====>', items)
console.log('==============================')

const layoutStyle = {
  // width: '100%'
  // borderRadius: 8,
  // overflow: 'hidden',
  // width: 'calc(50% - 8px)',
  // maxWidth: 'calc(50% - 8px)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  textAlign: 'center',
  // color: '#fff',
  height: 64,
  // paddingInline: 48,
  lineHeight: '64px',
  // backgroundColor: '#4096ff',
};

const contentStyle: React.CSSProperties = {
  // textAlign: 'center',
  // minHeight: 540,
  minHeight: '100vh',
  
  // minHeight: '80vh',
  // lineHeight: '120px',
  // color: '#fff',
  // backgroundColor: '#0958d9',
  // padding: '0 48px'
};

// style={{ padding: '0 48px' }}

const siderStyle: React.CSSProperties = {
  // textAlign: 'center',
  // lineHeight: '120px',
  // color: '#fff',
  // backgroundColor: '#1677ff',
  padding: '12px 0'
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  // backgroundColor: '#4096ff',
};

const matchPath = (menuUrl: any, curPath: any) => curPath.indexOf(menuUrl) === 0

const getLeftActive = (func: any, curPath: any, parent = []) => {
  console.log("getLeftActive func curPath parent", func, curPath, parent)
  let active: any;
  func.every((item: any) => {
    // console.log("item", item, "curPath", curPath)
    if (item.childs) {
      // 递归调用获取 activate,如果菜单存在子级菜单则 parent 即为 item 本身
      active = getLeftActive(item.childs, curPath, item)
      if (active) {
        // 如果层级嵌套可能存在多个 item
        if (!Array.isArray(active.parent)) {
          active.parent = [active.parent]
        }
        active.parent = parent
        return false;
      }
      return true
    } else {
      if (matchPath(item.hash, curPath)) {
        item.parent = parent;
        active = item;
        return false;
      }
      return true;
    }
  })
  return active;
}


const CreatorLayout: React.FC = () => {

  const [leftMenu, setLeftMenu] = React.useState<any>(() => {
    // console.log("initleftmenu===>", routeMap)
    const newRoteMap = routeMap.filter((v: any) => v.name === '创作者中心')
    console.log('newRoteMap===>', newRoteMap)
    let [funcs, leftFuncs, topActive, leftActive]: any = [newRoteMap]
    if (funcs) {
      funcs.every((top: any) => {
        if (matchPath(top.hash, window.location.hash)) {
          topActive = top;
          leftFuncs = top.childs;
          if (funcs) {
            leftActive = getLeftActive(leftFuncs, window.location.hash);
          }
          return false;
        }
        return true;
      })
    }
    console.log("CreatorLayout funcs", funcs)
    console.log("CreatorLayout leftFuncs", leftFuncs)
    console.log("CreatorLayout topActive", topActive)
    console.log("CreatorLayout leftActive", leftActive)
    return { funcs, leftFuncs, topActive, leftActive }
  })

  const {
    token: { colorBgContainer,
      borderRadiusLG },
  } = theme.useToken();

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  return (
    <BaseLayout>
      <React.Fragment>
        {/* <Flex gap="default" wrap="wrap"> */}
        <Layout style={layoutStyle}>
          {/* <Header
            // style={headerStyle}
            // style={{ border: '1px solid yellow' }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div className="demo-logo" />
          </Header> */}
          <AppHeader funcs={leftMenu.funcs} active={leftMenu.topActive} top={'创作者中心'} />
          <Layout style={{
            paddingTop: '1rem',
            // minHeight: '100vh',
            width: 'calc(50% - 8px)',
            margin: 'auto'
          }}>
            <Sider width="20%" style={{ ...siderStyle, background: colorBgContainer, marginRight: '1rem', borderRadius: borderRadiusLG }}>
              <VerticalMenu funcs={leftMenu.leftFuncs} active={leftMenu.leftActive} />
            </Sider>
            <Content style={{ ...contentStyle, borderRadius: borderRadiusLG }}>
              {/* Outlet 相当于组件 */}
              <Outlet />
            </Content>
          </Layout>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
        {/* </Flex> */}
      </React.Fragment>
    </BaseLayout>
  )
}

export default CreatorLayout
