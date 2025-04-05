
import { FormInstance } from 'antd';



// import { FormField } from '../types/dialog';

import { Rule } from 'antd/es/form';


interface FormField {
  name: string;
  label: string;
  rules?: Rule[];
  component: React.ReactNode;
  disabled?: boolean;
  span?: number;
}

// 暂时没有使用到
export const validateFormFields = async (
  form: FormInstance,
  fields: FormField[]
): Promise<Record<string, unknown>> => {
  try {
    return await form.validateFields();
  } catch (error) {
    console.error('Form validation failed:', error);
    throw error;
  }
};

export const resetFormFields = (form: FormInstance) => {
  form.resetFields();
};

export const setFormValues = (
  form: FormInstance,
  values: Record<string, unknown>
) => {
  form.setFieldsValue(values);
};