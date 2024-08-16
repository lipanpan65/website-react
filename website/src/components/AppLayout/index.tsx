import * as React from 'react'

import {
  Layout,
  theme
} from 'antd'

import {
  NavLink,
  Outlet
} from "react-router-dom"

import AppHeader from './AppHeader'
import { routeMap } from '@/routes'
import { getLeftActive, matchPath } from '@/utils'

import './index.css'

const { Header, Content, Footer } = Layout;

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

  // React.useEffect(() => {
  //   console.log("leftMenu===>", leftMenu)
  // }, [leftMenu])

  // React.useEffect(() => {
  //   console.log("routeMap===>", leftMenu)
  // }, [])

  return (
    <React.Fragment>
      <div className='containersss'>
        <Layout>
          <AppHeader
            funcs={appMenu.topMenu} active={appMenu.topActive} top={'首页'}
            appMenu={appMenu}
          />
          <Content
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 24
            }}
          >
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
            <div
              className='content'
              style={{
                // background: colorBgContainer,
                // minHeight: '100vh',
                // padding: 24,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>

      </div>

    </React.Fragment>

  );
};

export default App;