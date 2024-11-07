import React, { useEffect } from 'react';
import { Form, Input, FormInstance, Row, Col, FormProps } from 'antd';
import { Rule } from 'antd/es/form';

interface FormField {
  name: string;
  label: string;
  rules?: Rule[];
  component: React.ReactNode;
  disabled?: boolean;
  span?: number;
}

interface DialogFormProps extends Omit<FormProps, 'form' | 'onFinish'> {
  initialValues?: Record<string, any>;
  fields: FormField[];
  onFormInstanceReady: (form: FormInstance) => void;
  layout?: 'horizontal' | 'vertical' | 'inline';
  onSubmit?: (values: Record<string, any>) => void;
  onFieldsChange?: (changedFields: any[], allFields: any[]) => void; // 添加 onFieldsChange 属性
}

const DialogForm: React.FC<DialogFormProps> = ({
  initialValues,
  fields,
  onFormInstanceReady,
  layout = 'vertical',
  onSubmit,
  onFieldsChange, // 接收 onFieldsChange 回调
  ...formProps
}) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    onFormInstanceReady(form);
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, onFormInstanceReady, initialValues]);

  const handleFinish = (values: Record<string, any>) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Form
      layout={layout}
      form={form}
      onFinish={handleFinish}
      onFieldsChange={onFieldsChange} // 将 onFieldsChange 传递给 Form 组件
      {...formProps}
    >
      <Row gutter={[16, 16]}>
        {fields.map((field) => (
          <Col span={field.span || 24} key={field.name}>
            <Form.Item
              name={field.name}
              label={field.label}
              rules={field.rules}
            >
              {React.isValidElement(field.component) ? (
                React.cloneElement(field.component as React.ReactElement, {
                  disabled: field.disabled,
                })
              ) : (
                field.component
              )}
            </Form.Item>
          </Col>
        ))}
      </Row>
    </Form>
  );
};

export default DialogForm;
