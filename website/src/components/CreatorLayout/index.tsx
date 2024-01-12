
import * as React from 'react'
import BaseLayout from '../BaseLayout'
import { Layout, Flex, Menu } from 'antd'

const { Header, Footer, Sider, Content } = Layout

import './index.css'

const layoutStyle = {
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
  textAlign: 'center',
  // minHeight: 120,
  minHeight: '80vh',
  lineHeight: '120px',
  color: '#fff',
  // backgroundColor: '#0958d9',
};

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#1677ff',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  // backgroundColor: '#4096ff',
};

const CreatorLayout: React.FC = () => {
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
            {/* <div className="demo-logo" /> */}
            {/* <Menu
                theme="dark"
                mode="horizontal"
                items={items}
                onClick={onClick}
                style={{ flex: 1, minWidth: 0 }}
              ></Menu> */}
          </Header>
          <Content style={contentStyle}>

          </Content>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
        {/* </Flex> */}
      </React.Fragment>
    </BaseLayout>
  )
}

export default CreatorLayout
