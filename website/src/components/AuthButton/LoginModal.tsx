import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { api } from '@/api';

interface LoginModalProps {
  open: boolean;               // 模态框是否打开
  onClose: () => void;         // 关闭模态框的回调
  onLoginSuccess: () => void;  // 登录成功的回调
}


const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onLoginSuccess }) => {
  const [form] = Form.useForm();
  
  // 模拟登录逻辑
  const handleLogin = async (values: { username: string; password: string }) => {
    const { username, password } = values;
    
    const response = await api.auth.login({ username, password })
    if (response && response.success) {
      console.log(response.data)
      onLoginSuccess()
      onClose()
    }
    // // 这里可以加入实际的登录逻辑，例如 API 调用
    // if (username === 'admin' && password === '123456') {
    //   onLoginSuccess();  // 登录成功后调用回调
    //   onClose();         // 关闭模态框
    // } else {
    //   // 显示登录失败的错误信息（动态的显示了用户信息）
    //   form.setFields([
    //     {
    //       name: 'password',
    //       errors: ['用户名或密码错误'],
    //     },
    //   ]);
    // }
  };

  return (
    <Modal
      title="请登录"
      open={open}         // 使用 open 替代 visible
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleLogin}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
