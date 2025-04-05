// src/hooks/useDialogForm.ts
import { useState, useCallback, useEffect } from 'react';
import { FormInstance } from 'antd';

interface UseDialogFormProps {
  initialValues?: Record<string, unknown>;
  record?: Record<string, unknown>;
  isEditing?: boolean;
  onSubmit?: (values: Record<string, unknown>) => void;
}

interface UseDialogFormReturn {
  form: FormInstance | null;
  isFormChanged: boolean;
  handleFormInstanceReady: (instance: FormInstance) => void;
  handleFieldsChange: (changedFields: any, allFields: any[]) => void;
  resetForm: () => void;
  validateForm: () => Promise<Record<string, unknown> | null>;
  setFormValues: (values: Record<string, unknown>) => void;
}

export const useDialogForm = ({
  initialValues = {},
  record = {},
  isEditing = false,
  onSubmit
}: UseDialogFormProps = {}): UseDialogFormReturn => {
  const [form, setForm] = useState<FormInstance | null>(null);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const handleFormInstanceReady = useCallback((instance: FormInstance) => {
    setForm(instance);
    if (initialValues) {
      instance.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  const handleFieldsChange = useCallback((_: any, allFields: any[]) => {
    if (isEditing) {
      const isChanged = allFields.some(field => 
        field.value !== record?.[field.name[0]]
      );
      setIsFormChanged(isChanged);
    }
  }, [isEditing, record]);

  const resetForm = useCallback(() => {
    form?.resetFields();
    setIsFormChanged(false);
  }, [form]);

  const validateForm = useCallback(async (): Promise<Record<string, unknown> | null> => {
    if (!form) return null;
    try {
      return await form.validateFields();
    } catch (error) {
      console.error('Form validation failed:', error);
      return null;
    }
  }, [form]);

  const setFormValues = useCallback((values: Record<string, unknown>) => {
    if (form) {
      form.setFieldsValue(values);
    }
  }, [form]);

  useEffect(() => {
    if (form) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  return {
    form,
    isFormChanged,
    handleFormInstanceReady,
    handleFieldsChange,
    resetForm,
    validateForm,
    setFormValues
  };
};