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

import {
  FileTextOutlined,
  HomeOutlined,
  UserOutlined,
  InteractionOutlined,
  IdcardOutlined
} from '@ant-design/icons';

{/* <InteractionOutlined /> */ }

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];

const { Header } = Layout

// const MenuLable = (v: any) => <Link to={`${v.url}`}>{v.name}</Link>

const MenuLink = ({ url, name }: MenuItem) => <Link to={url}>{name}</Link>;


interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
}

interface AppHeaderProps {
  // collapsed: boolean;
  // onCollapsed: (collapsed: boolean) => void;
  appMenu: {
    topMenu: MenuItem[];
    topActive: MenuItem | null;
  };
}



const AppHeader: React.FC<AppHeaderProps> = ({ appMenu }) => {

  const { topMenu = [], topActive } = appMenu

  // 动态生成菜单项
  const items = React.useMemo(() => (
    topMenu.map((v) => ({
      key: v.id,
      icon: v.icon,
      label: <MenuLink {...v} />,
    }))
  ), [topMenu]);

  // const [items, setItems] = React.useState<any>(() => {
  //   return topMenu.map((v: any) => {
  //     return {
  //       key: v.id,
  //       icon: v.icon,
  //       label: MenuLable(v)
  //     }
  //   })
  // })

  const [selectedKeys, setSelectedKeys] = React.useState<string | null>(topActive?.id || null);
  // const [selectedKeys, setSelectedKeys] = React.useState(() => {
  //   return topActive?.id
  // })

  const navigate = useNavigate()

  const handleLinkTo = () => {
    navigate('/')
  }

  // const onClick: MenuProps['onClick'] = (e) => {
  //   const { key } = e
  //   topMenu.filter((v: any) => v.id === key)
  //   setSelectedKeys((preSelectedKeys: any) => {
  //     const active = topMenu.find((v: any) => v.id === key)
  //     console.log("active", active)
  //     return active?.id
  //   })
  // };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    const activeItem = topMenu.find((v) => v.id === key);
    setSelectedKeys(activeItem?.id || null);
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user',
      label: '李盼盼',
      icon: <IdcardOutlined />,
    },
    {
      key: 'edit',
      label: <Link to="/user/article/editor/new">写文章</Link>,
      icon: <FileTextOutlined />,
    },
    {
      key: 'creator',
      label: <Link to="/user/creator/overview">创作者中心</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: 'admin',
      label: <Link to="/operator/workbench">后台管理</Link>,
      icon: <InteractionOutlined />,
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
            // selectedKeys={selectedKeys}
            selectedKeys={[selectedKeys || '']}
            theme="dark"
            mode="horizontal"
            items={items}
            // onClick={onClick}
            onClick={handleMenuClick}
            style={{
              flex: 1,
              minWidth: 0,
            }}
          />
          <Space>
            <Button type='primary' onClick={() => navigate(`/user/article/editor/new`)}>写文章</Button>
            {/* <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} size={'default'}>U</Avatar> */}
            <React.Fragment>
              <Dropdown menu={{ items: userMenuItems }}>
                {/* <Avatar style={{ backgroundColor: ColorList[0], verticalAlign: 'middle' }} size="default" gap={GapList[0]}>
                  李
                </Avatar> */}
                <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="default" gap={4}>
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