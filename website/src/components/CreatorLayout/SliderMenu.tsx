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

interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  childs?: MenuItem[];
}

// interface MenuItem {
//   id: string;
//   name: string;
//   url: string;
//   icon: React.ReactNode;
// }

interface VerticalMenuProps {
  // appMenu: MenuItem[];
  appMenu: {
    topMenu: MenuItem[];
    topActive: MenuItem | null;
    leftMenu: MenuItem[];
    leftActive: MenuItem | null;
  };
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

  const {
    token: { colorBgContainer,
      borderRadiusLG },
  } = theme.useToken();

  // 缓存生成的菜单项
  // const items = React.useMemo(() => (
  //   appMenu.leftMenu.map((item: MenuItem) => ({
  //     key: item.id,  // 使用 URL 作为唯一标识
  //     icon: item.icon,
  //     label: item.name,
  //   }))
  // ), [appMenu.leftMenu]);

  const items: MenuProps['items'] = React.useMemo(() => generateMenuItems(appMenu.leftMenu), [appMenu.leftMenu]);


  console.log("VerticalMenu", items)

  // 设置当前选中的菜单项
  // const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

  const defaultSelectedKeys = appMenu.leftActive ? [appMenu.leftActive.id] : [];



  // React.useEffect(() => {
  //   const currentPath = location.pathname;
  //   const activeItem: any = appMenu.find((item: any) => item.url === currentPath);
  //   if (activeItem) {
  //     setSelectedKeys([activeItem.url]);
  //   }
  // }, [location.pathname, appMenu]);

  // const handleMenuClick = (e: { key: string }) => {
  //   setSelectedKeys([e.key]);
  //   navigate(e.key);
  // };

  return (
    <React.Fragment>
      <Menu
        style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}
        mode="inline"
        items={items}
        selectedKeys={defaultSelectedKeys}
      // onClick={handleMenuClick}
      />
    </React.Fragment>
  )
}

// 动态生成菜单项
const generateMenuItems = (menuData: MenuItem[]): MenuProps['items'] =>
  menuData.map((item) => ({
    key: item.id,
    icon: item.icon,
    label: <Link to={item.url}>{item.name}</Link>,
    children: item.childs?.map((subItem) => ({
      key: subItem.id,
      icon: subItem.icon,
      label: <Link to={subItem.url}>{subItem.name}</Link>,
    })),
  }));

export default VerticalMenu