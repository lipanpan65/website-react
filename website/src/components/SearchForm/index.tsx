import React, { useEffect } from 'react';
import { Form, Input, Row, Col, Button, FormInstance, Select, ButtonProps, SelectProps } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { PermissionOptions, usePermission } from '@/hooks/usePermission';
const { Option } = Select;

// 表单项配置接口
interface SearchFormItemConfig {
  name: string;
  placeholder?: string;
  rules?: any[];
  type?: 'input' | 'select' | 'dateRange' | 'number';
  options?: { label: string; value: string | number }[];
  width?: string | number;
  span?: number;
  allowClear?: boolean;
  selectConfig?: SearchSelectConfig;
  [key: string]: any;
}

// 按钮配置接口
interface SearchButtonConfig extends Omit<ButtonProps, 'children' | 'onClick'> {
  label: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  permissionOptions?: PermissionOptions;
  onClick?: (formValues: any) => void;
}

// Select 配置接口
interface SearchSelectConfig extends Omit<SelectProps<any>, 'children' | 'onChange'> {
  options: { label: string; value: string | number }[];
}

// SearchForm 组件 props 接口
interface SearchFormProps {
  onFormInstanceReady: (form: FormInstance) => void;
  onSearch?: (values: any) => void;           // 搜索回调
  onReset?: () => void;                       // 重置回调
  onFieldChange?: (fieldName: string, value: any, allValues: any) => void; // 字段变化回调
  initialValues?: Record<string, any>;        // 改名为 initialValues 更符合 Form 的命名习惯
  formItems: SearchFormItemConfig[];
  searchButton?: SearchButtonConfig;          // 搜索按钮配置
  resetButton?: SearchButtonConfig;           // 重置按钮配置
  extraButtons?: SearchButtonConfig[];        // 额外按钮
  loading?: boolean;                          // 加载状态
  disabled?: boolean;                         // 禁用状态
  itemSpacing?: number;
  rowSpacing?: number;                        // 改名为 rowSpacing 更明确
  layout?: 'horizontal' | 'vertical' | 'inline'; // 增加 inline 布局
  submitOnEnter?: boolean;                    // 回车时是否提交表单
  realTimeSearch?: boolean;                   // 是否实时搜索
  debounceDelay?: number;                     // 防抖延迟时间
  className?: string;                         // 自定义样式类
  style?: React.CSSProperties;               // 自定义样式
}

/**
 * SearchForm - 可配置的搜索表单组件
 * 
 * 功能特性：
 * - 支持多种表单项类型（输入框、下拉框、日期范围等）
 * - 内置权限控制
 * - 支持实时搜索和防抖
 * - 灵活的按钮配置
 * - 响应式布局
 */
const SearchForm: React.FC<SearchFormProps> = ({
  onFormInstanceReady,
  onSearch,
  onReset,
  onFieldChange,
  initialValues = {},
  formItems,
  searchButton,
  resetButton,
  extraButtons = [],
  loading = false,
  disabled = false,
  itemSpacing = 16,
  rowSpacing = 16,
  layout = 'horizontal',
  submitOnEnter = true,
  realTimeSearch = false,
  debounceDelay = 300,
  className = '',
  style = {},
}) => {
  const { hasAccess } = usePermission();
  const [form] = Form.useForm();
  const formRef = React.useRef(form);

  // 搜索按钮权限检查
  const hasSearchPermission = searchButton ? hasAccess(
    searchButton.requiredRoles,
    searchButton.requiredPermissions,
    searchButton.permissionOptions
  ) : true;

  // 重置按钮权限检查
  const hasResetPermission = resetButton ? hasAccess(
    resetButton.requiredRoles,
    resetButton.requiredPermissions,
    resetButton.permissionOptions
  ) : true;

  // 初始化表单实例
  const memoizedOnFormInstanceReady = React.useCallback(() => {
    onFormInstanceReady(formRef.current);
  }, [onFormInstanceReady]);

  // 防抖搜索函数
  const debouncedSearch = React.useMemo(() => {
    if (!realTimeSearch || !onSearch) return null;
    
    let timeoutId: NodeJS.Timeout;
    return (values: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
          }
          return acc;
        }, {} as any);
        
        onSearch(filteredValues);
      }, debounceDelay);
    };
  }, [realTimeSearch, onSearch, debounceDelay]);

  // 初始化表单值
  useEffect(() => {
    memoizedOnFormInstanceReady();
    if (Object.keys(initialValues).length > 0) {
      formRef.current.setFieldsValue(initialValues);
    }
  }, [memoizedOnFormInstanceReady, initialValues]);

  // 表单提交处理
  const handleFinish = React.useCallback((values: any) => {
    console.log('SearchForm 提交:', values);
    
    // 过滤空值
    const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    onSearch?.(filteredValues);
  }, [onSearch]);

  // 重置处理
  const handleReset = React.useCallback(() => {
    form.resetFields();
    onReset?.();
  }, [form, onReset]);

  // 字段值变化处理
  const handleValuesChange = React.useCallback((changedValues: any, allValues: any) => {
    const fieldName = Object.keys(changedValues)[0];
    const fieldValue = changedValues[fieldName];
    
    // 调用字段变化回调
    onFieldChange?.(fieldName, fieldValue, allValues);
    
    // 实时搜索
    if (realTimeSearch && debouncedSearch) {
      debouncedSearch(allValues);
    }
  }, [onFieldChange, realTimeSearch, debouncedSearch]);

  // 回车键处理
  const handlePressEnter = React.useCallback((event: React.KeyboardEvent) => {
    if (submitOnEnter && !realTimeSearch) {
      event.preventDefault();
      form.submit();
    }
  }, [submitOnEnter, realTimeSearch, form]);

  // 渲染表单项
  const renderFormItem = (item: SearchFormItemConfig) => {
    const { 
      name, 
      type = 'input', 
      options, 
      rules, 
      width, 
      placeholder, 
      span, 
      selectConfig, 
      allowClear = true, 
      ...rest 
    } = item;
    
    return (
      <Col key={name} span={span} style={{ display: 'flex', alignItems: 'center' }}>
        <Form.Item 
          name={name} 
          rules={rules || []} 
          style={{ width: width || '100%', margin: 0 }}
          {...rest}
        >
          {type === 'select' ? (
            <Select
              placeholder={placeholder || '请选择...'}
              allowClear={allowClear}
              disabled={disabled}
              {...selectConfig}
              style={{ width: '100%' }}
            >
              {(selectConfig?.options || options)?.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          ) : type === 'number' ? (
            <Input
              type="number"
              placeholder={placeholder || '请输入数字...'}
              allowClear={allowClear}
              disabled={disabled}
              style={{ width: '100%' }}
              onPressEnter={handlePressEnter}
              {...rest}
            />
          ) : (
            <Input
              placeholder={placeholder || '请输入...'}
              allowClear={allowClear}
              disabled={disabled}
              style={{ width: '100%' }}
              onPressEnter={handlePressEnter}
              {...rest}
            />
          )}
        </Form.Item>
      </Col>
    );
  };

  // 渲染按钮
  const renderButtons = () => {
    const buttons = [];
    
    // 搜索按钮
    if (searchButton && !realTimeSearch) {
      buttons.push(
        <Button
          key="search"
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!hasSearchPermission || disabled}
          icon={searchButton.icon || <SearchOutlined />}
          {...searchButton}
        >
          {searchButton.label || '搜索'}
        </Button>
      );
    }
    
    // 重置按钮
    if (resetButton) {
      buttons.push(
        <Button
          key="reset"
          onClick={handleReset}
          disabled={!hasResetPermission || loading || disabled}
          icon={resetButton.icon || <ReloadOutlined />}
          {...resetButton}
        >
          {resetButton.label || '重置'}
        </Button>
      );
    }
    
    // 额外按钮
    extraButtons.forEach((buttonConfig, index) => {
      const hasPermission = hasAccess(
        buttonConfig.requiredRoles,
        buttonConfig.requiredPermissions,
        buttonConfig.permissionOptions
      );
      
      buttons.push(
        <Button
          key={`extra-${index}`}
          disabled={!hasPermission || disabled}
          {...buttonConfig}
          onClick={() => {
            const formValues = form.getFieldsValue();
            buttonConfig.onClick?.(formValues);
          }}
        >
          {buttonConfig.label}
        </Button>
      );
    });
    
    return buttons;
  };

  return (
    <div 
      className={`search-form ${className}`}
      style={style}
    >
      <Form 
        form={form} 
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
        layout={layout}
        disabled={disabled}
      >
        <Row 
          gutter={[itemSpacing, rowSpacing]} 
          style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
        >
          {/* 表单项 */}
          {formItems.map(renderFormItem)}
          
          {/* 按钮组 */}
          {renderButtons().length > 0 && (
            <Col style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {renderButtons()}
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
};

export default SearchForm;

// ==================== 导出类型定义 ====================
export type {
  SearchFormProps,
  SearchFormItemConfig,
  SearchButtonConfig,
  SearchSelectConfig,
};

// ==================== 使用示例 ====================
/*
// 基础搜索表单
<SearchForm
  onFormInstanceReady={onFormInstanceReady}
  onSearch={handleSearch}
  onReset={handleReset}
  initialValues={searchParams}
  loading={loading}
  formItems={[
    {
      name: 'keyword',
      placeholder: '请输入关键词...',
      type: 'input',
      width: 200,
    },
    {
      name: 'status',
      placeholder: '请选择状态',
      type: 'select',
      width: 150,
      selectConfig: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
  ]}
  searchButton={{ label: '搜索' }}
  resetButton={{ label: '重置' }}
  extraButtons={[
    {
      label: '新建',
      type: 'primary',
      onClick: () => showCreateModal(),
    },
  ]}
/>

// 实时搜索表单
<SearchForm
  onFormInstanceReady={onFormInstanceReady}
  onSearch={handleRealTimeSearch}
  onReset={handleReset}
  initialValues={searchParams}
  loading={loading}
  realTimeSearch={true}
  debounceDelay={500}
  formItems={[...]}
  resetButton={{ label: '清空' }}
/>
*/