import * as React from 'react';
import logo from '@/logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Layout, MenuProps, Space, Button, Avatar, Dropdown } from 'antd';
import {
  IdcardOutlined,
  FileTextOutlined,
  HomeOutlined,
  InteractionOutlined
} from '@ant-design/icons';

const { Header } = Layout;

interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
}

interface AppHeaderProps {
  appMenu: {
    topMenu: MenuItem[];
    topActive: MenuItem | null;
  };
}

const AppHeader: React.FC<AppHeaderProps> = ({ appMenu }) => {
  const { topMenu = [], topActive } = appMenu;
  const navigate = useNavigate();

  console.log("AppHeader.AppHeader", topActive)

  // 动态生成菜单项
  const items = React.useMemo(() => (
    topMenu.map((item) => ({
      key: item.id,
      icon: item.icon,
      label: <Link to={item.url}>{item.name}</Link>,
    }))
  ), [topMenu]);



  const [selectedKeys, setSelectedKeys] = React.useState<string[]>(topActive ? [topActive.id] : []);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const activeItem = topMenu.find((item) => item.id === e.key);
    setSelectedKeys(activeItem ? [activeItem.id] : []);
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
    <Header className='header-container'>
      <div className="header-content" style={{
        display: 'flex'
      }}>
        <div className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">皮皮虾教程</span>
        </div>
        <Menu
          selectedKeys={selectedKeys}
          theme="dark"
          mode="horizontal"
          items={items}
          onClick={handleMenuClick}
          className="menu"
        />
        <Space className="header-actions">
          <Button type='primary' onClick={() => navigate(`/user/article/editor/new`)}>写文章</Button>
          <Dropdown menu={{ items: userMenuItems }}>
            <Avatar className="avatar">李</Avatar>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
