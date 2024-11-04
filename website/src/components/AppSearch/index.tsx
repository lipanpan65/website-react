import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Button, FormInstance, Select, ButtonProps, SelectProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

// 表单项配置接口
interface FormItemConfig {
  name: string;
  placeholder?: string;
  rules?: any[];
  type?: 'input' | 'select';
  options?: { label: string; value: string | number }[];
  width?: string | number;
  span?: number;
  onPressEnter?: (key: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (value: any, name: string) => void; // 新增 onChange 属性
  selectConfig?: SelectConfig;
  [key: string]: any;
}

// 按钮配置接口
interface ButtonConfig extends Omit<ButtonProps, 'children'> {
  label: string;
}

// Select 配置接口
interface SelectConfig extends Omit<SelectProps<any>, 'children'> {
  options: { label: string; value: string | number  }[];
}

// AppSearch 组件 props 接口
interface AppSearchProps {
  onFormInstanceReady: (form: FormInstance) => void;
  setQueryParams?: (params: any) => void;
  initialParams?: Record<string, any>;
  formItems: FormItemConfig[];
  buttonConfig: ButtonConfig;
  itemSpacing?: number;
  innerSpacing?: number;
}

const AppSearch: React.FC<AppSearchProps> = ({
  onFormInstanceReady,
  setQueryParams,
  initialParams = {},
  formItems,
  buttonConfig,
  itemSpacing = 16,
  innerSpacing = 16,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    onFormInstanceReady(form);
    if (Object.keys(initialParams).length > 0) {
      form.setFieldsValue(initialParams);
    }
  }, [form, onFormInstanceReady, initialParams]);

  const handlePressEnter = (key: string, event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault(); // 防止默认提交行为
    const value = event.currentTarget.value.trim(); // 去掉输入的空格

    if (setQueryParams) {
      setQueryParams((prevQueryParams: Record<string, any>) => ({
        ...prevQueryParams,
        [key]: value,
      }));
    }
  };

  const handleSelectChange = (key: string, value: any) => {
    if (setQueryParams) {
      setQueryParams((prevQueryParams: Record<string, any>) => ({
        ...prevQueryParams,
        [key]: value,
      }));
    }
  };

  return (
    <Form form={form}>
      <Row gutter={[innerSpacing, 16]} className="app-search" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Col>
          <Button icon={buttonConfig.icon || <SearchOutlined />} {...buttonConfig}>
            {buttonConfig.label}
          </Button>
        </Col>
        {formItems.map((item) => {
          const { name, type, options, onPressEnter, onChange, rules, width, placeholder, span, selectConfig, ...rest } = item;
          return (
            <Col key={name} span={span} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Form.Item name={name} rules={rules || [{ required: false }]} style={{ width: width || '100%', margin: 0 }} {...rest}>
                {type === 'select' && selectConfig ? (
                  <Select
                    placeholder={placeholder || '请选择...'}
                    {...selectConfig}
                    style={{ width: '100%' }}
                    onChange={(value) => (onChange ? onChange(value, name) : handleSelectChange(name, value))} // 默认 onChange 事件
                  >
                    {options?.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    placeholder={placeholder || '请输入...'}
                    allowClear
                    style={{ width: '100%' }}
                    onPressEnter={(e) => (onPressEnter ? onPressEnter(name, e) : handlePressEnter(name, e))}
                  />
                )}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    </Form>
  );
};

export default AppSearch;
