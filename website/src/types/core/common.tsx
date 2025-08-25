/**
 * 选择器选项
 */
export interface SelectOption<T = any> {
    label: string;
    value: T;
    disabled?: boolean;
}

/**
 * 键值对类型
 */
export type KeyValuePair<T = any> = {
    key: string;
    value: T;
};

/**
 * 表单状态
 */
export interface FormState<T = any> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isValid: boolean;
    isSubmitting: boolean;
}
