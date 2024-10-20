import * as React from 'react'

import {
  theme
} from 'antd'

import AppHeader from '../AppLayout/AppHeader';
import { getLeftActive, matchPath } from '@/utils'

import { AppRoute } from '@/routes'

const BaseLayout: any = (props: any) => {
  const {
    token: {
      // colorBgContainer, 
      borderRadiusLG
    },
  } = theme.useToken();

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
        // funcs={appMenu.topMenu} active={appMenu.topActive} top={'创作者中心'}
        appMenu={appMenu}
      />
      {props.children}
      {/* <Outlet /> */}
    </React.Fragment>
  )
}

export default BaseLayout