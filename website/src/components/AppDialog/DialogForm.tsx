import React, { useEffect } from 'react';
import { Form, Input, FormInstance, Row, Col } from 'antd';

interface FormField {
  name: string;
  label: string;
  rules?: any[];
  component: React.ReactNode;  // 允许传入不同类型的表单组件，如 Input, Select 等
  disabled?: boolean;
  span?: number;  // 每个字段占用的列数
}

interface DialogFormProps {
  initialValues?: any;
  fields: FormField[];  // 动态传入表单项配置
  onFormInstanceReady: (form: FormInstance) => void;
  layout?: 'horizontal' | 'vertical' | 'inline';  // 可选布局
  onSubmit?: (values: any) => void;  // 可选提交逻辑
}

const DialogForm: React.FC<DialogFormProps> = ({
  initialValues,
  fields,
  onFormInstanceReady,
  layout = 'vertical',
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    onFormInstanceReady(form);
  }, [form, onFormInstanceReady]);

  const handleFinish = (values: any) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Form
      layout={layout}
      form={form}
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      <Row gutter={[16, 16]}>
        {fields.map((field) => (
          <Col span={field.span || 24} key={field.name}> {/* 默认占一行 */}
            <Form.Item
              name={field.name}
              label={field.label}
              rules={field.rules}
            >
              {React.cloneElement(field.component as React.ReactElement, {
                disabled: field.disabled,
              })}
            </Form.Item>
          </Col>
        ))}
      </Row>
    </Form>
  );
};

export default DialogForm;
