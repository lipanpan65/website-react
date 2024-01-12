import * as React from 'react'

import {
  Button,
  Row,
  Col,
  Menu,
  Layout,
  MenuProps
} from 'antd'

import {
  Link,
  NavLink,
  useNavigate,
  // NavLink,
} from "react-router-dom"


const { Header } = Layout

// const toReditArticle

const MenuLable = (v: any) => <NavLink to={`${v.url}`}>{v.name}</NavLink>

const AppHeader: any = (props: any) => {

  const navigate = useNavigate()

  let { funcs = [], active = {} } = props,
    selectedKeys = [active.id];

  const items = funcs.map((v: any) => {
    console.log("v===>", v)
    return {
      label: MenuLable(v),
      key: v.id,
      icon: v.icon
    }
  })

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    // setCurrent(e.key);

  };
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
          onClick={onClick}
          style={{ flex: 1, minWidth: 0 }}
        ></Menu>
        <div><Button type='primary' onClick={() => navigate(`/user/article/edit`)}>写文章</Button></div>
      </Header>
    </React.Fragment>
  )
}


export default AppHeader