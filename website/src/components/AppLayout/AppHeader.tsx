import * as React from 'react'

import {
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
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        ></Menu>
      </Header>

      {/* <Row>
        <Col span={22}>
          </Menu>
        </Col>
      </Row> */}
    </React.Fragment>
  )
}


export default AppHeader