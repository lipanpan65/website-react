import * as React from "react";
import logo from '@/logo.svg'
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';


import {
  Button,
  Menu,
  Layout,
  MenuProps,
  Avatar,
  Space,
  Dropdown
} from 'antd'

import {
  Link,
  useNavigate,
} from "react-router-dom"

const { Header } = Layout

const MenuLable = (v: any) => <Link to={`${v.url}`}>{v.name}</Link>


const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

// const AdminHeader: React.FC = (props: any) => {
const AdminHeader: any = (props: any) => {

  const navigate = useNavigate()

  let { funcs = [], active = {}, top, appMenu } = props

  const { topMenu = [], topActive } = appMenu

  const [items, setItems] = React.useState<any>(() => {
    return topMenu.map((v: any) => {
      return {
        key: v.id,
        icon: v.icon,
        label: MenuLable(v)
      }
    })
  })

  const [defaultSelectedKeys, setDefaultSelectedKeys] = React.useState(() => {
    return topActive?.id
  })

  const { collapsed, onCollapsed } = props

  const handleLinkTo = () => {
    navigate('/')
  }

  return (
    <React.Fragment>
      <div className="admin-navbar">
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} className='logo' onClick={handleLinkTo} style={{ margin: '0px' }} />
          <span
            onClick={handleLinkTo}
            style={{
              fontSize: '1.5em',
              fontWeight: 'bold',
              color: 'white',
              marginInlineEnd: '16px'
            }}>皮皮虾教程</span>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: 'white',
            }}
          />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
      </div>
    </React.Fragment>
  )
}

export default AdminHeader