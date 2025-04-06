import * as React from 'react';
import logo from '@/logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Layout, MenuProps, Space, Button, Avatar, Dropdown } from 'antd';
import {
  IdcardOutlined,
  FileTextOutlined,
  HomeOutlined,
  InteractionOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import AuthButton from '../AuthButton';
import { useAuth } from '@/hooks/useAuth';
import { clearCookies } from '@/utils/cookie';
import { api } from '@/api';

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
  const { isAuthenticated, userRole, username, name } = useAuth();


  const requiredRole = 'admin';   // 需要的角色


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

  const handleLogout = async () => {
    if (isAuthenticated) {
      const data = {
        username: username
      }
      const res = await api.auth.logout(data)
      console.log("res===>", res)
      if (res.success) {
        clearCookies()
        navigate('/')
        window.location.reload()
      }
    }

    // clearCookies()
    // navigate('/')
    // window.location.reload()
  }

  // const handleLogout = () => {
  //   console.log("handleLogout")

  //   clearCookies()
  //   navigate('/')
  //   window.location.reload()
  // }


  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user',
      label: name,
      icon: <IdcardOutlined />,
    },
    {
      key: 'edit',
      label: (
        <AuthButton
          isAuthenticated={isAuthenticated}
          requiredRole={requiredRole}
          userRole={userRole}
          link={<Link to="/user/article/editor/new">写文章</Link>}
        />
      ),
      icon: <FileTextOutlined />,
    },
    {
      key: 'creator',
      label: (
        <AuthButton
          isAuthenticated={isAuthenticated}
          requiredRole={requiredRole}
          userRole={userRole}
          link={<Link to="/user/creator/overview">创作者中心</Link>}
        />
      ),
      icon: <HomeOutlined />,
    },
    {
      key: 'admin',
      label: <Link to="/operator/workbench">后台管理</Link>,
      icon: <InteractionOutlined />,
    },
    {
      key: 'logout',
      label: <span onClick={handleLogout} style={{ cursor: 'pointer' }}>退出</span>,
      icon: <LogoutOutlined />,
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
          <AuthButton
            isAuthenticated={isAuthenticated}
            requiredRole={requiredRole}
            userRole={userRole}
            button={<Button type='primary' onClick={() => navigate(`/user/article/editor/new`)}>写文章</Button>}
          />
          {isAuthenticated && (
            <Dropdown menu={{ items: userMenuItems }}>
              <Avatar className="avatar">{name ? name[0] : ''}</Avatar>
            </Dropdown>
          )}
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;

