import { useCallback, useRef, useState } from 'react';
import { FormInstance } from 'antd';

interface UseFormRefProps {
  onValuesChange?: (values: any) => void;
  initialValues?: Record<string, any>;
}

export const useFormRef = ({ onValuesChange, initialValues }: UseFormRefProps = {}) => {
  const formRef = useRef<FormInstance | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues || {});

  const handleFormInstanceReady = useCallback((form: FormInstance) => {
    formRef.current = form;
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  const handleValuesChange = useCallback((changedValues: any, allValues: any) => {
    setFormValues(allValues);
    if (onValuesChange) {
      onValuesChange(allValues);
    }
  }, [onValuesChange]);

  return {
    formRef,
    formValues,
    handleFormInstanceReady,
    handleValuesChange
  };
}; 