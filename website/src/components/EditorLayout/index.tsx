import * as React from 'react'

import { Layout, Flex, Menu, Row, Col, theme } from 'antd'
import { Outlet } from 'react-router-dom'

const { Header, Footer, Sider, Content } = Layout

const contentStyle: React.CSSProperties = {
  // textAlign: 'center',
  minHeight: 540,
  // minHeight: '80vh',
  // lineHeight: '120px',
  // color: '#fff',
  // backgroundColor: '#0958d9',
  // padding: '0 48px'
};

const EditorLayout: any = () => {
  
  const {
    token: {
      // colorBgContainer,
      borderRadiusLG
    },
  } = theme.useToken();

  return (
    <React.Fragment>
      <Layout style={{
        // paddingTop: '1rem',
        // width: 'calc(50% - 8px)',
        width: '100%',
        // margin: 'auto'
      }}>
        <Content style={{ ...contentStyle, borderRadius: borderRadiusLG }}>
          <Outlet />
        </Content>
      </Layout>
    </React.Fragment>
  )
}

export default EditorLayout