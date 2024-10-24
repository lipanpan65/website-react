import * as React from 'react'
import type { MenuProps } from 'antd';
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom"

import { Layout, Flex, Menu, Row, Col, theme } from 'antd'

// type MenuItem = Required<MenuProps>['items'][number];


interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
}

interface VerticalMenuProps {
  appMenu: MenuItem[];
}


// const MenuLable = (v: any) => v.url ? <Link to={`${v.url}`}>{v.name}</Link> : v.name

// const matchPath = (menuUrl: any, curPath: any) => curPath.indexOf(menuUrl) === 0

// const getLeftActive = (func: any, curPath: any, parent = []) => {
//   console.log("getLeftActive func curPath parent", func, curPath, parent)
//   let active: any;
//   func.every((item: any) => {
//     if (item.childs) {
//       // 递归调用获取 activate,如果菜单存在子级菜单则 parent 即为 item 本身
//       active = getLeftActive(item.childs, curPath, item)
//       if (active) {
//         // 如果层级嵌套可能存在多个 item
//         if (!Array.isArray(active.parent)) {
//           active.parent = [active.parent]
//         }
//         active.parent = parent
//         return false;
//       }
//       return true
//     } else {
//       if (matchPath(item.hash, curPath)) {
//         item.parent = parent;
//         active = item;
//         return false;
//       }
//       return true;
//     }
//   })
//   return active;
// }

// const getMenuTree = (funcs: any, curPath: any, parent = []) => {

// }


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
// const formatTree = (data: any) => {
//   const newData = data.map((v: any) => {
//     const newItem: any = {
//       key: v.id,
//       icon: v.icon,
//       label: MenuLable(v)
//     }
//     if (v.childs?.length > 0) {
//       newItem.children = formatTree(v.childs)
//     }
//     return newItem
//   })
//   return newData
// }

const VerticalMenu: React.FC<VerticalMenuProps> = ({ appMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 缓存生成的菜单项
  const items = React.useMemo(() => (
    appMenu.map((item: any) => ({
      key: item.url,  // 使用 URL 作为唯一标识
      icon: item.icon,
      label: item.name,
    }))
  ), [appMenu]);

  console.log("VerticalMenu", items)

  // 设置当前选中的菜单项
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    const currentPath = location.pathname;
    const activeItem: any = appMenu.find((item: any) => item.url === currentPath);
    if (activeItem) {
      setSelectedKeys([activeItem.url]);
    }
  }, [location.pathname, appMenu]);

  const handleMenuClick = (e: { key: string }) => {
    setSelectedKeys([e.key]);
    navigate(e.key);
  };

  return (
    <React.Fragment>
      <Menu
        mode="vertical"
        items={items}
        selectedKeys={selectedKeys}
        onClick={handleMenuClick}
      />
    </React.Fragment>
  )

}

export default VerticalMenu