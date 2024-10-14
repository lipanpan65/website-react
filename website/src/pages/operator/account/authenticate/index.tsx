import * as React from 'react'
// import { Table, theme } from 'antd'

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';

import {
  Navigate,
  useLocation,
  useRoutes,
  useNavigate
} from 'react-router-dom'

import './index.css'
import { ceil } from 'lodash';


const Authenticate = () => {

  const navigate = useNavigate()

  const handleLinkTo = () => {
    navigate('/')
  }
  
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <React.Fragment>
      <div className='auth-wrapper'>
        {/* <span onClick={handleLinkTo}>
          用户登陆页面
        </span> */}
        <div style={{
          width: "20%",
          padding: "1rem 3rem",
          backgroundColor: "#fff",
          borderRadius: 8
          // margin: '0 auto'
        }}>
          <h2 style={{ textAlign: 'center' }}>用户登陆</h2>
          <Form
            name="login"
            initialValues={{ remember: true }}
            style={{ maxWidth: 560 }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名！' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住密码</Checkbox>
                </Form.Item>
                <a href="">忘记密码</a>
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit">
                登陆
              </Button>

              or <a href="">还没有账号？立即注册</a>
            </Form.Item>
          </Form>
        </div>

      </div>
    </React.Fragment>
  )
}

export default Authenticate
