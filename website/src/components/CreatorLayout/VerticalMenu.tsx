import * as React from 'react'
import type { MenuProps } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Link
} from "react-router-dom"

import { Layout, Flex, Menu, Row, Col, theme } from 'antd'

type MenuItem = Required<MenuProps>['items'][number];

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


const MenuLable = (v: any) => v.url ? <Link to={`${v.url}`}>{v.name}</Link> : v.name

const matchPath = (menuUrl: any, curPath: any) => curPath.indexOf(menuUrl) === 0

const getLeftActive = (func: any, curPath: any, parent = []) => {
  console.log("getLeftActive func curPath parent", func, curPath, parent)
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

const getMenuTree = (funcs: any, curPath: any, parent = []) => {

}


// https://blog.csdn.net/qq_35770417/article/details/109803851

const dataToFlatten = (data: any) => {
  let arr: any = []
  data.forEach((item: any) => {
    console.log('item===>', item)
    arr.push({
      key: item.id,
      // icon: item.icon,
      // label: MenuLable(item)
      label: item.name
    })
    console.log('arr===>', arr)
    if (item.childs?.length) {
      arr = arr.concat(dataToFlatten(item.childs))
    }
  })
  return arr
}

/**
 * 对菜单的数据进行格式化
 * @param data 数组类型
 */
const formatTree = (data: any) => {
  const newData = data.map((v: any) => {
    const newItem: any = {
      key: v.id,
      icon: v.icon,
      label: MenuLable(v)
    }
    if (v.childs?.length > 0) {
      newItem.children = formatTree(v.childs)
    }
    return newItem
  })
  return newData
  // data.forEach((v: any) => {
  //   console.log('formatTree', v)
  //   return {
  //     key: v.id,
  //     // icon: v.icon,
  //     label: v.name
  //   }
  // })
  // return data
}

const VerticalMenu: any = (props: any) => {

  let { funcs = [], active = {} } = props,
    selectedKeys = [active.id];

  console.log('VerticalMenu===>', props)

  // const newFuncs = getLeftActive(funcs, window.location.hash)
  // console.log("newFuncs===>", newFuncs)
  // const items = funcs.map((v: any) => {
  //   console.log("v===>", v)
  //   return {
  //     key: v.id,
  //     icon: v.icon,
  //     // label: MenuLable(v)
  //     label: v.name
  //   }
  // })

  const newItems = formatTree(funcs)
  console.log('newItems===>', newItems)

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  const newItems2: any = [
    {
      key: '1',
      label: '菜单管理'
    },
    {
      key: '2',
      // type: 'group',
      label: '用户管理',
      children: [
        {
          key: '21',
          label: '权限管理'
        },
        {
          key: '22',
          label: '角色管理'
        },
      ]
    }
  ]


  return (
    <React.Fragment>
      <Menu
        onClick={onClick}
        // style={{ width: 256 }}
        defaultSelectedKeys={selectedKeys}
        // defaultOpenKeys={['sub1']}
        mode="inline"
        // items={items}
        items={newItems}
      // items={newItems2}
      />
    </React.Fragment>
  )

}

export default VerticalMenu