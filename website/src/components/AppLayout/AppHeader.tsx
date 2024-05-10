import * as React from 'react'

import {
  Button,
  Menu,
  Layout,
  MenuProps,
  Flex,
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
      // console.log(v)
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

  // console.log("items", items)

  const navigate = useNavigate()
  console.log("AppHeader.props===>", props)

  const [leftMunu, setLeftMenu] = React.useState<any>(() => {
    // console.log("=========")
    // console.log(top)
    // console.log("=========")

    // const leftMunu = menu.childs || []
    // console.log("leftMunu===>", leftMunu)
    // return leftMunu
  })

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
      label: <Link to={`/user/creator/overview`}>后台管理</Link>,
      icon: <HomeOutlined />,
    },
  ];

  // console.log("AppHeader.props===>", props)
  // console.log("items===>", items)
  return (
    <React.Fragment>
      <Header style={{
        display: 'flex',
        alignItems: 'center', // 文字上下巨中
      }}>
        {/* <Flex align='center' justify='center' style={{
          // width: 'calc(40%-16px)',
          // margin: 'auto'
        }}> */}
        <div className="demo-logo" onClick={handleLinkTo} />
        {/* <div> */}
        <Menu
          selectedKeys={selectedKeys}
          theme="dark"
          mode="horizontal"
          items={items}
          onClick={onClick}
          style={{
            flex: 1,
            minWidth: 0,
            // width: '400px',
            // width: 'calc(50%-16px)',
            // margin: 'auto'
          }}
        />
        {/* </div> */}
        <div>
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
        </div>
        <div>
        </div>
        {/* </Flex> */}
      </Header>
    </React.Fragment>
  )
}


export default AppHeader