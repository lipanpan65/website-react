import React from 'react';
import { Form, Input, Row, Col, Button, FormInstance, Select } from 'antd';

const { Option } = Select;

interface FormItemConfig {
  name: string;
  placeholder?: string;
  rules?: any[];
  type?: 'input' | 'select';
  options?: { label: string; value: string | number }[];
  width?: string | number;
  span?: number;  // 新增可选的 span 属性
  onPressEnter?: (key: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
  [key: string]: any;  // 允许有其他任意属性
}

// interface ButtonConfig {
//   label: string;
//   type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
//   onClick: (event: React.MouseEvent<HTMLElement>) => void;
//   [key: string]: any;  // 允许其他任意属性
// }

interface ButtonConfig {
  label: string;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';  // 限制为 Button 允许的类型
  // onClick: (event: React.MouseEvent<HTMLElement>) => void;
  // onClick: (event: React.MouseEvent<HTMLElement>) => void;
  [key: string]: any;  // 允许其他任意属性
}
interface AppSearchProps {
  onFormInstanceReady: (form: FormInstance) => void;
  setQueryParams: (params: any) => void;
  formItems: FormItemConfig[];
  buttonConfig: ButtonConfig;  // 动态按钮配置
  itemSpacing?: number;
  innerSpacing?: number;
}

const AppSearch: React.FC<AppSearchProps> = ({
  onFormInstanceReady,
  setQueryParams,
  formItems,
  buttonConfig,
  itemSpacing = 16,
  innerSpacing = 16,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    onFormInstanceReady(form);
  }, [form, onFormInstanceReady]);

  const handlePressEnter = (key: string, event: React.KeyboardEvent<HTMLInputElement>) => {
    setQueryParams((prevQueryParams: any) => ({
      ...prevQueryParams,
      [key]: event.currentTarget.value,
    }));
  };

  const searchStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',  // 允许子元素换行
  };

  const colStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // 确保内容水平居中
  };

  return (
    <React.Fragment>
      <Form form={form}>
        <Row gutter={[innerSpacing, 16]} className="app-search" style={searchStyle}>
          <Col style={colStyle}>
            <Button type={buttonConfig.type || 'primary'} {...buttonConfig}>
              {buttonConfig.label}
            </Button>
          </Col>
          {formItems.map((item) => {
            const { name, type, options, onPressEnter, rules, width, placeholder, span, ...rest } = item;
            return (
              <Col key={name} style={colStyle} {...(span ? { span } : {})}>
                <Form.Item
                  name={name}
                  rules={rules || [{ required: false }]}
                  style={{
                    width: width || '100%',
                    margin: 0,  // 移除默认 margin
                  }}
                  {...rest}
                >
                  {type === 'select' && options ? (
                    <Select
                      placeholder={placeholder || '请选择...'}
                      {...rest}
                      style={{ width: '100%' }}>
                      {options.map((option) => (
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
                      onPressEnter={(e) =>
                        onPressEnter ? onPressEnter(name, e) : handlePressEnter(name, e)
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default AppSearch;
