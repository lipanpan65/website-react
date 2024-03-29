import * as React from 'react'

import {
  NavLink,
  Outlet
} from "react-router-dom"

import {
  Breadcrumb,
  Layout,
  Menu,
  theme
} from 'antd'

const { Header, Content, Footer } = Layout;



// const BaseLayout: React.FC = (props: any) => {
const BaseLayout: any = (props: any) => {
  const {
    token: {
      // colorBgContainer, 
      borderRadiusLG
    },
  } = theme.useToken();
  console.log('BaseLayout===>', props)

  

  return (
    <React.Fragment>
      {props.children}
      <Content style={{ padding: '0 48px' }}>
        {/* <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
        {/* <main className='index-container container'>
        </main> */}
        <div
          style={{
            // background: colorBgContainer,
            minHeight: '100vh',
            // padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Outlet />
    </React.Fragment>
  )
}

export default BaseLayout