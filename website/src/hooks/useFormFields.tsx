import { useState, useCallback } from 'react';
// import { FormField } from '../types/dialog';



import { Rule } from 'antd/es/form';


interface FormField {
  name: string;
  label: string;
  rules?: Rule[];
  component: React.ReactNode;
  disabled?: boolean;
  span?: number;
  defaultValue?:string
}


export const useFormFields = (fields: FormField[]) => {
  const [visibleFields, setVisibleFields] = useState<FormField[]>(fields);

  const updateFieldVisibility = useCallback((fieldName: string, isVisible: boolean) => {
    setVisibleFields(prev => 
      prev.map(field => 
        field.name === fieldName 
          ? { ...field, hidden: !isVisible }
          : field
      )
    );
  }, []);

  const getFieldValue = useCallback((fieldName: string) => {
    const field = visibleFields.find(f => f.name === fieldName);
    return field?.defaultValue;
  }, [visibleFields]);

  return {
    visibleFields,
    updateFieldVisibility,
    getFieldValue
  };
};