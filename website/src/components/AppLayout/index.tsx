import * as React from 'react'

import {
  Breadcrumb,
  Layout,
  Menu,
  theme
} from 'antd'

import {
  NavLink,
  Outlet
} from "react-router-dom"

import { routeMap } from '../../routes'

import AppHeader from './AppHeader'

import './index.css'

const { Header, Content, Footer } = Layout;

const items = new Array(5).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const matchPath = (menuUrl: any, curPath: any) => curPath.indexOf(menuUrl) === 0

const getLeftActive = (func: any, curPath: any, parent = []) => {
  let active: any;
  func.every((item: any) => {
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

const App: React.FC = () => {
  const {
    token: {
      // colorBgContainer, 
      borderRadiusLG
    },
  } = theme.useToken();

  console.log("App Main")

  const [appMenu, setAppMeun] = React.useState<any>(() => {
    let [topMenu, topActive, leftMenu, , leftActive]: any = [routeMap]
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
    return {
      topMenu, topActive,
      leftMenu, leftActive
    }
  })

  console.log(appMenu)


  const [leftMenu, setLeftMenu] = React.useState<any>(() => {
    let [funcs, leftFuncs, topActive, leftActive]: any = [routeMap]
    if (funcs) {
      funcs.every((top: any) => {
        if (matchPath(top.hash, window.location.hash)) {
          topActive = top;
          leftFuncs = top.childs;
          // if (funcs) {
          if (leftFuncs) {
            leftActive = getLeftActive(leftFuncs, window.location.hash);
          }
          return false;
        }
        return true;
      })
    }
    return { funcs, leftFuncs, topActive, leftActive }
  })

  // React.useEffect(() => {
  //   console.log("leftMenu===>", leftMenu)
  // }, [leftMenu])

  // React.useEffect(() => {
  //   console.log("routeMap===>", leftMenu)
  // }, [])

  return (
    <Layout>
      <AppHeader
        funcs={appMenu.topMenu} active={appMenu.topActive} top={'首页'}
        appMenu={appMenu}
      />
      <Content style={{ padding: '0 48px' }}>
        {/* <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
        {/* <main className='index-container container'>
        </main> */}
        <div
          style={{
            // background: colorBgContainer,
            minHeight: '100vh',
            // padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  );
};

export default App;