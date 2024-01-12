
import * as React from 'react'
import BaseLayout from '../BaseLayout'
import { Layout, Flex, Menu, Row, Col, theme } from 'antd'

const { Header, Footer, Sider, Content } = Layout

import './index.css'
import { Outlet } from 'react-router-dom'

const layoutStyle = {
  // width: '100%'
  // borderRadius: 8,
  // overflow: 'hidden',
  // width: 'calc(50% - 8px)',
  // maxWidth: 'calc(50% - 8px)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  textAlign: 'center',
  // color: '#fff',
  height: 64,
  // paddingInline: 48,
  lineHeight: '64px',
  // backgroundColor: '#4096ff',
};

const contentStyle: React.CSSProperties = {
  // textAlign: 'center',
  minHeight: 540,
  // minHeight: '80vh',
  // lineHeight: '120px',
  // color: '#fff',
  // backgroundColor: '#0958d9',
  // padding: '0 48px'
};

// style={{ padding: '0 48px' }}

const siderStyle: React.CSSProperties = {
  // textAlign: 'center',
  // lineHeight: '120px',
  // color: '#fff',
  // backgroundColor: '#1677ff',
  padding: '12px 0'
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  // backgroundColor: '#4096ff',
};

const CreatorLayout: React.FC = () => {

  const {
    token: { colorBgContainer,
      borderRadiusLG },
  } = theme.useToken();

  return (
    <BaseLayout>
      <React.Fragment>
        {/* <Flex gap="default" wrap="wrap"> */}
        <Layout style={layoutStyle}>
          <Header
            // style={headerStyle}
            // style={{ border: '1px solid yellow' }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div className="demo-logo" />
          </Header>
          <Layout style={{
            paddingTop: '1rem',
            width: 'calc(50% - 8px)',
            margin: 'auto'
          }}>
            <Sider width="20%" style={{ ...siderStyle, background: colorBgContainer, marginRight: '1rem', borderRadius: borderRadiusLG }}>
              
            </Sider>
            <Content style={{ ...contentStyle, borderRadius: borderRadiusLG }}>
              {/* Outlet 相当于组件 */}
              <Outlet />
            </Content>
          </Layout>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
        {/* </Flex> */}
      </React.Fragment>
    </BaseLayout>
  )
}

export default CreatorLayout
