import * as React from 'react'

import {
  theme
} from 'antd'

import {
  Outlet
} from "react-router-dom"

import AppHeader from './AppHeader'
import { AppRoute } from '@/routes'
import { getLeftActive, matchPath } from '@/utils'

import './index.css'

const App: React.FC = () => {
  const {
    token: {
      // colorBgContainer, 
      borderRadiusLG
    },
  } = theme.useToken();

  console.log("App Main")

  const [appMenu, setAppMeun] = React.useState<any>(() => {
    let [topMenu, topActive, leftMenu, , leftActive]: any = [AppRoute]
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

  return (
    <React.Fragment>
      <AppHeader
        funcs={appMenu.topMenu}
        active={appMenu.topActive}
        top={'首页'}
        appMenu={appMenu}
      />
      <div className='container-wrapper'>
        <Outlet />
      </div>
    </React.Fragment>
  );
};

export default App;