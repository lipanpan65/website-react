// src/hooks/__tests__/useFormRefComplete.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Form, Input, Button } from 'antd';
import { useFormRef } from '../useFormRef';

// 创建一个测试组件
const TestCompleteComponent = () => {
  const { 
    formRef, 
    formValues, 
    handleFormInstanceReady, 
    handleValuesChange 
  } = useFormRef({
    initialValues: { name: '默认值' },
    onValuesChange: (values) => {
      console.log('表单值变化:', values);
    }
  });

  return (
    <div>
      <Form
        ref={formRef}
        initialValues={{ name: '默认值' }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="name" label="名称">
          <Input data-testid="name-input" />
        </Form.Item>
        <Form.Item name="age" label="年龄">
          <Input data-testid="age-input" />
        </Form.Item>
      </Form>
      <div data-testid="form-values">{JSON.stringify(formValues)}</div>
    </div>
  );
};

describe('useFormRef - 完整版本', () => {
  it('应该正确设置初始值', () => {
    render(<TestCompleteComponent />);
    const input = screen.getByTestId('name-input');
    expect(input).toHaveValue('默认值');
  });

  it('应该能够监听表单值变化', async () => {
    render(<TestCompleteComponent />);
    const nameInput = screen.getByTestId('name-input');
    const ageInput = screen.getByTestId('age-input');
    const formValuesDisplay = screen.getByTestId('form-values');

    // 输入值
    fireEvent.change(nameInput, { target: { value: '新名称' } });
    fireEvent.change(ageInput, { target: { value: '25' } });

    // 验证表单值显示
    expect(formValuesDisplay).toHaveTextContent(JSON.stringify({ name: '新名称', age: '25' }));
  });

  it('应该能够处理多个字段的值变化', async () => {
    render(<TestCompleteComponent />);
    const nameInput = screen.getByTestId('name-input');
    const ageInput = screen.getByTestId('age-input');

    // 输入多个值
    fireEvent.change(nameInput, { target: { value: '测试名称' } });
    fireEvent.change(ageInput, { target: { value: '30' } });

    // 验证输入值
    expect(nameInput).toHaveValue('测试名称');
    expect(ageInput).toHaveValue('30');
  });

  it('应该能够重置表单值', async () => {
    render(<TestCompleteComponent />);
    const nameInput = screen.getByTestId('name-input');
    const formRef = screen.getByRole('form');

    // 输入值
    fireEvent.change(nameInput, { target: { value: '测试名称' } });

    // 重置表单
    fireEvent.reset(formRef);

    // 验证值是否重置为初始值
    expect(nameInput).toHaveValue('默认值');
  });
});