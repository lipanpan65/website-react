import React, { useMemo } from 'react';
import { Layout, Button, Menu, theme } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import logo from '@/logo.svg';

const { Header } = Layout;

interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
}

interface AdminHeaderProps {
  collapsed: boolean;
  onCollapsed: (collapsed: boolean) => void;
  appMenu: {
    topMenu: MenuItem[];
    topActive: MenuItem | null;
  };
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onCollapsed, appMenu }) => {
  const navigate = useNavigate();
  // const { colorBgContainer } = theme.useToken();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { topMenu, topActive } = appMenu;

  // 生成菜单项并缓存
  const items: MenuProps['items'] = useMemo(
    () => topMenu.map((v) => ({
      key: v.id,
      icon: v.icon,
      label: <Link to={v.url}>{v.name}</Link>,
    })),
    [topMenu]
  );

  // 默认选择的菜单项
  const defaultSelectedKeys = topActive ? [topActive.id] : [];

  const handleLinkTo = () => {
    navigate('/');
  };

  return (
    <div className="admin-navbar">
      <Header style={{ display: 'flex', alignItems: 'center', }}>
        <img
          src={logo}
          alt="Logo"
          className='logo'
          onClick={handleLinkTo}
          style={{ margin: '0px', cursor: 'pointer' }}
        />
        <span
          onClick={handleLinkTo}
          style={{
            fontSize: '1.5em',
            fontWeight: 'bold',
            color: 'white',
            marginInlineEnd: '16px',
            cursor: 'pointer',
          }}
        >
          皮皮虾教程
        </span>
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
          defaultSelectedKeys={defaultSelectedKeys}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
    </div>
  );
};

export default AdminHeader;