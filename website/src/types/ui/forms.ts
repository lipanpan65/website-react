/**
 * 输入框组件属性
 */
export interface InputProps {
    name: string;
    label?: string;
    type?: 'text' | 'email' | 'password' | 'number';
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
  }
  
  /**
   * 选择框组件属性
   */
  export interface SelectProps {
    name: string;
    label?: string;
    value?: string | number;
    options: Array<{
      label: string;
      value: string | number;
      disabled?: boolean;
    }>;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    onChange?: (value: string | number) => void;
    className?: string;
  }
  
  /**
   * 复选框组件属性
   */
  export interface CheckboxProps {
    name: string;
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
  }