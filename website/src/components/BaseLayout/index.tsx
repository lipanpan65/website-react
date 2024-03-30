import * as React from 'react'

import {
  NavLink,
  Outlet
} from "react-router-dom"

import {
  Breadcrumb,
  Layout,
  Menu,
  theme
} from 'antd'

import AppHeader from '../AppLayout/AppHeader';

import { routeMap } from '@/routes'

const { Header, Content, Footer } = Layout;

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

// const BaseLayout: React.FC = (props: any) => {
const BaseLayout: any = (props: any) => {
  const {
    token: {
      // colorBgContainer, 
      borderRadiusLG
    },
  } = theme.useToken();
  console.log('BaseLayout===>', props)
  const [leftMenu, setLeftMenu] = React.useState<any>(() => {
    console.log("initleftmenu===>", routeMap)
    /**
     * 
     * [
    {
        "id": "1",
        "name": "首页",
        "icon": {
            "type": {},
            "key": null,
            "ref": null,
            "props": {},
            "_owner": null,
            "_store": {}
        },
        "url": "/user/article",
        "hash": "#/user/article",
        "childs": [
            {
                "id": "11",
                "name": "首页概览",
                "url": "/user/article/overview",
                "hash": "#/user/article/overview",
                "icon": {
                    "type": {},
                    "key": null,
                    "ref": null,
                    "props": {},
                    "_owner": null,
                    "_store": {}
                },
                "parent": []
            },
            {
                "id": "12",
                "name": "研发",
                "url": "/user/article/develop",
                "hash": "#/user/article/develop",
                "icon": {
                    "type": {},
                    "key": null,
                    "ref": null,
                    "props": {},
                    "_owner": null,
                    "_store": {}
                }
            }
        ]
    },
    {
        "id": "2",
        "name": "创作者中心",
        "icon": {
            "type": {},
            "key": null,
            "ref": null,
            "props": {},
            "_owner": null,
            "_store": {}
        },
        "url": "/user/creator",
        "hash": "#/user/creator",
        "childs": [
            {
                "id": "21",
                "name": "首页",
                "url": "/user/creator/overview",
                "hash": "#/user/creator/overview",
                "icon": {
                    "type": {},
                    "key": null,
                    "ref": null,
                    "props": {},
                    "_owner": null,
                    "_store": {}
                }
            },
            {
                "id": "22",
                "name": "内容管理",
                "icon": {
                    "type": {},
                    "key": null,
                    "ref": null,
                    "props": {},
                    "_owner": null,
                    "_store": {}
                },
                "childs": [
                    {
                        "id": "221",
                        "name": "文章管理",
                        "url": "/user/creator/overview",
                        "hash": "#/user/creator/overview",
                        "icon": {
                            "type": {},
                            "key": null,
                            "ref": null,
                            "props": {},
                            "_owner": null,
                            "_store": {}
                        }
                    }
                ]
            }
        ]
    },
    {
        "id": "3",
        "name": "专题",
        "icon": {
            "type": {},
            "key": null,
            "ref": null,
            "props": {},
            "_owner": null,
            "_store": {}
        },
        "url": "/user/subjects",
        "hash": "#/user/subjects",
        "childs": [
            {
                "id": "11",
                "name": "首页概览",
                "url": "/user/article/overview",
                "hash": "#/user/article/overview",
                "icon": {
                    "type": {},
                    "key": null,
                    "ref": null,
                    "props": {},
                    "_owner": null,
                    "_store": {}
                }
            },
            {
                "id": "12",
                "name": "研发",
                "url": "/user/article/develop",
                "hash": "#/user/article/develop",
                "icon": {
                    "type": {},
                    "key": null,
                    "ref": null,
                    "props": {},
                    "_owner": null,
                    "_store": {}
                }
            }
        ]
    }
]
     * 
     */
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



  return (
    <React.Fragment>
      <AppHeader funcs={leftMenu.funcs} active={leftMenu.topActive} top={'创作者中心'} />
      {props.children}
      {/* <Outlet /> */}
    </React.Fragment>
  )
}

export default BaseLayout