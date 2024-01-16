import * as React from 'react'
import type { MenuProps } from 'antd';

import {
  Link
} from "react-router-dom"

import { Layout, Flex, Menu, Row, Col, theme } from 'antd'
import { current } from '@reduxjs/toolkit';

type MenuItem = Required<MenuProps>['items'][number];


const MenuLable = (v: any) => <Link to={`${v.url}`}>{v.name}</Link>

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

const getMenuTree = (funcs: any, curPath: any, parent = []) => {

}


// https://blog.csdn.net/qq_35770417/article/details/109803851

const dataToFlatten = (data: any) => {
  let arr: any = []
  data.forEach((item: any) => {
    arr.push({
      id: item.id,
      pid: item.pid,
      title: item.title,
    })
    if (item.children?.length) {
      arr = arr.concat(dataToFlatten(item.children))
    }
  })
  return arr
}

const reRenderItem = (v: any) => {
  return {
    key: v.id,
    icon: v.icon,
    label: MenuLable(v)
  }
}


const VerticalMenu: any = (props: any) => {


  let { funcs = [], active = {} } = props,
    selectedKeys = [active.id];

  console.log('VerticalMenu===>', props)

  const newFuncs = getLeftActive(funcs, window.location.hash)
  console.log("newFuncs===>", newFuncs)
  // const items = newFuncs.map((v: any) => {
  //   console.log("v===>", v)
  //   return {
  //     key: v.id,
  //     icon: v.icon,
  //     label: MenuLable(v)
  //   }
  // })

  const items = newFuncs.map((v: any) => {
    let childrdn = []
    if (v.childs) {
      return reRenderItem(v.childrdn)
    }

  })


  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  return (
    <React.Fragment>
      <Menu
        onClick={onClick}
        // style={{ width: 256 }}
        defaultSelectedKeys={selectedKeys}
        // defaultOpenKeys={['sub1']}
        // mode="inline"
        items={items}
      />
    </React.Fragment>
  )

}

export default VerticalMenu