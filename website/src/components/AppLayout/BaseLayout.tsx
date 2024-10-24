import React from 'react';
import { Layout } from 'antd';
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
}) => (
  <div style={layoutStyle}>
    {nested ? (
      <Layout>
        {header && <Header>{header}</Header>}
        <Content >
          <Layout className='app-layout'>
            {sider && <Sider>{sider}</Sider>}
            <Outlet />
          </Layout>
        </Content>
        {footer && <Footer>{footer}</Footer>}
      </Layout>
    ) : (
      <>
        {header && <Header>{header}</Header>}
        <Layout>
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

export default BaseLayout;
