import * as React from 'react'

import {
  Button,
  Row,
  Col,
  Menu,
  Layout
} from 'antd'

const { Header } = Layout

const AppHeader: any = (props: any) => {
  let { funcs = [], active = {} } = props,
    selectedKeys = [active.id];

  let items = funcs.map((v: any) => {
    console.log("v===>", v)
    return {
      label: v.name,
      key: v.id,
      icon: v.icon
    }
  })

  console.log("AppHeader.props===>", props)
  console.log("items===>", items)
  return (
    <React.Fragment>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        // border: '1px solid red'
      }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        ></Menu>
        <div><Button type='primary' onClick={() => alert('路由跳转') }>写文章</Button></div>
      </Header>
      <Row>
        <Col flex={4}></Col>
        <Col flex={1}></Col>
      </Row>
      {/* <Row>
        <Col span={22}>
          </Menu>
        </Col>
      </Row> */}
    </React.Fragment>
  )
}


export default AppHeader