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
      <div style={{
        // height: '100vh', // 去掉该高度则会有盒子自己撑开
      }}>
        {/* <Layout> */}
        <AppHeader
          funcs={appMenu.topMenu} active={appMenu.topActive} top={'首页'}
          appMenu={appMenu}
        />
        <div className='content'>
          <div className="content-container">
            <Outlet />
          </div>
        </div>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
        {/* </Layout> */}
      </div>

    </React.Fragment>

  );
};

export default App;