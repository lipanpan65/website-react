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


const App: React.FC = () => {
  const {
    token: {
      // colorBgContainer, 
      borderRadiusLG
    },
  } = theme.useToken();

  console.log("App Main")

  const appMenu = React.useMemo(() => initializeAppMenu(window.location.hash), [window.location.hash]);


  // const [appMenu, setAppMeun] = React.useState<any>(() => {
  //   let [topMenu, topActive, leftMenu, , leftActive]: any = [AppRoute]
  //   if (topMenu) {
  //     topMenu.every((top: any) => {
  //       if (matchPath(top.hash, window.location.hash)) {
  //         topActive = top
  //         leftMenu = top.childs
  //         if (leftMenu) {
  //           leftActive = getLeftActive(leftMenu, window.location.hash);
  //         }
  //         return false;
  //       }
  //       return true
  //     })
  //   }
  //   return {
  //     topMenu, topActive,
  //     leftMenu, leftActive
  //   }
  // })

  

  return (
    <React.Fragment>
      <AppHeader
        // funcs={appMenu.topMenu}
        // active={appMenu.topActive}
        // top={'首页'}
        appMenu={appMenu}
      />
      <div className='container-wrapper'>
        <Outlet />
      </div>
    </React.Fragment>
  );
};

// 初始化菜单信息
const initializeAppMenu = (currentPath: string): AppMenu => {
  const topMenu: MenuItem[] = AppRoute;
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
  return { topMenu, topActive, leftMenu, leftActive };
};

export default App;