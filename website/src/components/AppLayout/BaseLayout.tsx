import React from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

interface BaseLayoutProps {
  header?: React.ReactNode;
  sider?: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: React.CSSProperties;
  layoutStyle?: React.CSSProperties;
  nested?: boolean;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  header,
  sider,
  footer,
  contentStyle,
  layoutStyle,
  nested = false,
}) => {

  const {
    token: { colorBgContainer,
      borderRadiusLG },
  } = theme.useToken();

  return (
    <div style={layoutStyle}>
      {nested ? (
        <Layout style={{
          background: '#f2f0f5'
        }}>
          {header && <Header>{header}</Header>}
          <Content style={{
            background: '#f2f0f5'
          }}>
            <Layout className='app-layout'>
              {sider && <Sider
                style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}
              >{sider}</Sider>}
              <Outlet />
            </Layout>
          </Content>
          {footer && <Footer>{footer}</Footer>}
        </Layout>
      ) : (
        <>
          {header && <Header>{header}</Header>}
          <Layout style={{
            background: '#f2f0f5'
          }}>
            {sider && <Sider>{sider}</Sider>}
            <Content style={contentStyle}>
              <Outlet />
            </Content>
          </Layout>
          {footer && <Footer>{footer}</Footer>}
        </>
      )}
    </div>
  );
}
export default BaseLayout;
