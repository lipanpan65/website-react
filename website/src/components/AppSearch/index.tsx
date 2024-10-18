import React from 'react';
import { Form, Input, Row, Col, Button, FormInstance, Select, ButtonProps, SelectProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

// 定义表单项配置接口
interface FormItemConfig {
  name: string;
  placeholder?: string;
  rules?: any[];
  type?: 'input' | 'select';
  options?: { label: string; value: string | number }[];
  width?: string | number;
  span?: number;
  onPressEnter?: (key: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
  selectConfig?: SelectConfig;  // 新增 selectConfig 属性
  [key: string]: any;
}

// 定义按钮配置接口，扩展 ButtonProps 并排除 children
interface ButtonConfig extends Omit<ButtonProps, 'children'> {
  label: string;  // 按钮的显示文本
}

// 定义 Select 配置接口，扩展 SelectProps 并排除 children
interface SelectConfig extends Omit<SelectProps<any>, 'children'> {
  options: { label: string; value: string | number }[];  // 选项
}

// 定义 AppSearch 组件的 props 接口
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
            <Button
              icon={buttonConfig.icon || <SearchOutlined />}
              {...buttonConfig}  // 传递所有 Button 相关属性
            >
              {buttonConfig.label}  {/* 使用 label 作为按钮内容 */}
            </Button>
          </Col>
          {formItems.map((item) => {
            const { name, type, options, onPressEnter, rules, width, placeholder, span, selectConfig, ...rest } = item;
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
                  {type === 'select' && selectConfig ? (
                    <Select
                      placeholder={placeholder || '请选择...'}
                      {...selectConfig}  // 传递 selectConfig 中的所有属性
                      style={{ width: '100%' }}
                    >
                      {selectConfig.options.map((option) => (
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
