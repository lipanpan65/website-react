import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Button, FormInstance, Select, ButtonProps, SelectProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PermissionOptions, usePermission } from '@/hooks/usePermission';
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
  requiredRoles?: string[];
  requiredPermissions?: string[];
  permissionOptions?: PermissionOptions;
}

// Select 配置接口
interface SelectConfig extends Omit<SelectProps<any>, 'children'> {
  options: { label: string; value: string | number }[];
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
  const { hasAccess } = usePermission();
  const [form] = Form.useForm();
  const formRef = React.useRef(form);

  const hasButtonPermission = hasAccess(
    buttonConfig.requiredRoles,
    buttonConfig.requiredPermissions,
    buttonConfig.permissionOptions
  );


  const memoizedOnFormInstanceReady = React.useCallback(() => {
    onFormInstanceReady(formRef.current);
  }, [onFormInstanceReady]);

  useEffect(() => {
    memoizedOnFormInstanceReady();
    if (Object.keys(initialParams).length > 0) {
      formRef.current.setFieldsValue(initialParams);
    }
  }, [memoizedOnFormInstanceReady, initialParams]);


  // handlePressEnter 函数处理搜索输入框按下回车键的事件
  // 参数:
  // - key: 表单字段名称
  // - event: 键盘事件对象
  const handlePressEnter = (key: string, event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const value = event.currentTarget.value.trim(); // 获取输入值并去除首尾空格

    // 如果传入了 setQueryParams 函数,则更新查询参数
    if (setQueryParams) {
      setQueryParams((prevQueryParams: Record<string, any>) => ({
        ...prevQueryParams, // 保留之前的查询参数
        [key]: value, // 使用当前字段名和值更新参数
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

  console.log("hasButtonPermission", hasButtonPermission)

  return (
    <Form form={form}>
      {/* gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} */}
      <Row gutter={[innerSpacing, 16]} className="app-search" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Col>
          <Button icon={buttonConfig.icon || <SearchOutlined />} {...buttonConfig} disabled={!hasButtonPermission}>
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
