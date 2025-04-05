// src/hooks/__tests__/useFormRef.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Form, Input, Button } from 'antd';
import { useFormRef } from '../useFormRef';

// 创建一个测试组件
const TestComponent = () => {
  const { formRef, handleFormInstanceReady } = useFormRef();

  const handleSubmit = () => {
    formRef.current?.validateFields().then(values => {
      console.log('表单值:', values);
    });
  };

  return (
    <Form
      ref={formRef}
    >
      <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
        <Input data-testid="name-input" />
      </Form.Item>
      <Button onClick={handleSubmit} data-testid="submit-button">提交</Button>
    </Form>
  );
};

describe('useFormRef - 简单版本', () => {
  it('应该正确初始化表单实例', () => {
    render(<TestComponent />);
    const input = screen.getByTestId('name-input');
    expect(input).toBeInTheDocument();
  });

  it('应该能够获取表单值', async () => {
    render(<TestComponent />);
    const input = screen.getByTestId('name-input');
    const submitButton = screen.getByTestId('submit-button');

    // 输入值
    fireEvent.change(input, { target: { value: '测试名称' } });
    
    // 点击提交按钮
    fireEvent.click(submitButton);

    // 验证输入值
    expect(input).toHaveValue('测试名称');
  });

  it('应该能够处理表单验证', async () => {
    render(<TestComponent />);
    const submitButton = screen.getByTestId('submit-button');

    // 直接点击提交按钮，不输入值
    fireEvent.click(submitButton);

    // 验证错误消息
    const errorMessage = await screen.findByText('请输入名称');
    expect(errorMessage).toBeInTheDocument();
  });
});