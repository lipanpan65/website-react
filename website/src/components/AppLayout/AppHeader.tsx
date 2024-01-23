import * as React from 'react'

import {
  Button,
  Row,
  Col,
  Menu,
  Layout,
  MenuProps,
  Flex,
  Avatar,
  Space
} from 'antd'

// import { Button, Flex, Segmented } from 'antd';

import {
  Link,
  useNavigate,
} from "react-router-dom"

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];

const { Header } = Layout

const MenuLable = (v: any) => <Link to={`${v.url}`}>{v.name}</Link>

const AppHeader: any = (props: any) => {

  console.log("AppHeader===>", props)

  const navigate = useNavigate()

  let { funcs = [], active = {} } = props,
    selectedKeys = [active.id];
  console.log("selectedKeys===>", selectedKeys)

  const items = funcs.filter((v: any) => v.name === '首页').map((v: any) => {
    return {
      key: v.id,
      icon: v.icon,
      label: MenuLable(v)
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
      <Header style={{
        display: 'flex',
        alignItems: 'center', // 文字上下巨中
        // border: '1px solid red',
        // width:'500px'
      }}>
        {/* <Flex align='center' justify='center' style={{
          // width: 'calc(40%-16px)',
          // margin: 'auto'
        }}> */}
        <div className="demo-logo" />
        {/* <div> */}
        <Menu
          selectedKeys={selectedKeys}
          theme="dark"
          mode="horizontal"
          items={items}
          onClick={onClick}
          style={{
            flex: 1,
            minWidth: 0,
            // width: '400px',
            // width: 'calc(50%-16px)',
            // margin: 'auto'
          }}
        />
        {/* </div> */}
        <div>
          <Space>
            <Button type='primary' onClick={() => navigate(`/user/article/editor/new`)}>写文章</Button>
            {/* <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} size={'default'}>U</Avatar> */}
            <Avatar style={{ backgroundColor: ColorList[0], verticalAlign: 'middle' }} size="large" gap={GapList[0]}>
              {/* {UserList[0]} */}
              李
            </Avatar>
          </Space>
        </div>
        <div>
        </div>
        {/* </Flex> */}
      </Header>
    </React.Fragment>
  )
}


export default AppHeader