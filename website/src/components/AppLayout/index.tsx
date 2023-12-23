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
  console.log("getLeftActive func curPath parent", func, curPath, parent)
  let active: any;
  func.every((item: any) => {
    console.log("item", item, "curPath", curPath)
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
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  // const [routesMap, setRoutesMap] = React.useState<any>(() => {
  //   return [routeMap];
  // });
  const [leftMenu, setLeftMenu] = React.useState<any>(() => {
    // console.log("initleftmenu===>", routeMap)
    let [funcs, leftFuncs, topActive, leftActive]: any = [routeMap]
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
    console.log("funcs", funcs)
    console.log("leftFuncs", leftFuncs)
    console.log("topActive", topActive)
    console.log("leftActive", leftActive)
    return { funcs, leftFuncs, topActive, leftActive }
  })

  React.useEffect(() => {
    console.log("leftMenu===>", leftMenu)
  }, [leftMenu])

  React.useEffect(() => {
    console.log("routeMap===>", leftMenu)
  }, [])

  return (
    <Layout>
      <AppHeader funcs={leftMenu.funcs} activate={leftMenu.topActive} />
      {/* <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header> */}
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
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