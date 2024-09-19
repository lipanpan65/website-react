import * as React from 'react'
import logo from '@/logo.svg'
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

import { FileTextOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];

const { Header } = Layout

const MenuLable = (v: any) => <Link to={`${v.url}`}>{v.name}</Link>

const AppHeader: any = (props: any) => {
  let { funcs = [], active = {}, top, appMenu } = props
  // selectedKeys = [active.id];
  // const { appMenu } = props
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

  const [selectedKeys, setSelectedKeys] = React.useState(() => {
    return topActive?.id
  })

  const navigate = useNavigate()

  const handleLinkTo = () => {
    navigate('/')
  }

  const onClick: MenuProps['onClick'] = (e) => {
    const { key } = e
    topMenu.filter((v: any) => v.id === key)
    setSelectedKeys((preSelectedKeys: any) => {
      const active = topMenu.find((v: any) => v.id === key)
      console.log("active", active)
      return active?.id
    })
  };

  const items2: MenuProps['items'] = [
    {
      key: 'user',
      label: '李盼盼',
      icon: <UserOutlined />,
    },
    {
      key: 'edit',
      label: <Link to={`/user/article/editor/new`}>写文章</Link>,
      icon: <FileTextOutlined />,
    },
    {
      key: 'delete',
      label: <Link to={`/user/creator/overview`}>创作者中心</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: 'admin',
      label: <Link to={`/operator/workbench`}>后台管理</Link>,
      icon: <HomeOutlined />,
    },
  ];

  return (
    <React.Fragment>
      <div className="navbar">
        <Header className='container'>
          <img src={logo} className='logo' onClick={handleLinkTo} style={{
            margin: '0px'
          }} />
          <span
            onClick={handleLinkTo}
            style={{
              fontSize: '1.5em',
              fontWeight: 'bold',
              color: 'white',
              marginInlineEnd: '16px'
            }}>皮皮虾教程</span>
          <Menu
            selectedKeys={selectedKeys}
            theme="dark"
            mode="horizontal"
            items={items}
            onClick={onClick}
            style={{
              flex: 1,
              minWidth: 0,
            }}
          />
          <Space>
            <Button type='primary' onClick={() => navigate(`/user/article/editor/new`)}>写文章</Button>
            {/* <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} size={'default'}>U</Avatar> */}
            <React.Fragment>
              <Dropdown menu={{
                items: items2,
                onClick: (e: any) => console.log(e)
              }}>
                <Avatar style={{ backgroundColor: ColorList[0], verticalAlign: 'middle' }} size="default" gap={GapList[0]}>
                  {/* {UserList[0]} */}
                  李
                </Avatar>
              </Dropdown>
            </React.Fragment>
          </Space>
        </Header>
      </div>
    </React.Fragment>
  )
}


export default AppHeader