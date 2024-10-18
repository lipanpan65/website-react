import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, FormInstance } from 'antd';

interface FormValues {
  id?: number;  // id 是可选属性
  [key: string]: any;  // 允许有其他任意属性
}

interface AppModelProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  title?: string;
  onOk?: () => void;
  onCancel?: () => void;
  formComponent?: React.FC<any>; // 可选的表单组件
}

const AppModel = forwardRef((props: AppModelProps, ref) => {
  const {
    initialValues,
    onSubmit,
    title = '创建表单',
    onOk: propsOnOk,
    onCancel: propsOnCancel,
    formComponent: FormComponent, // 如果不传 formComponent 则渲染自定义的内容
  } = props;

  const [formInstance, setFormInstance] = useState<FormInstance | null>(null);
  const [modalState, setModalState] = useState<{ open: boolean; formValues: FormValues }>({
    open: false,
    formValues: {},
  });

  useEffect(() => {
    if (formInstance) {
      formInstance.setFieldsValue(modalState.formValues);
    }
  }, [formInstance, modalState.formValues]);

  const showModel = (open: boolean, data: any = {}) => {
    setModalState({ open, formValues: data });
  };

  const defaultOnOk = async () => {
    try {
      const values = await formInstance?.validateFields();
      if (modalState.formValues?.id) values.id = modalState.formValues.id;
      onSubmit(values);
    } catch (e) {
      console.error('Validation failed:', e);
    }
  };

  const defaultOnCancel = () => {
    formInstance?.resetFields();
    setModalState((prevState) => ({ ...prevState, open: false }));
  };

  const handleOk = propsOnOk || defaultOnOk;
  const handleCancel = propsOnCancel || defaultOnCancel;

  useImperativeHandle(ref, () => ({
    showModel,
  }));

  return (
    <Modal
      open={modalState.open}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
      afterOpenChange={(open) => formInstance?.setFieldsValue(modalState.formValues)}
    >
      {/* 如果没有传递 formComponent 则渲染默认提示 */}
      {FormComponent ? (
        <FormComponent
          initialValues={initialValues}
          onFormInstanceReady={setFormInstance}
          isUpdate={!!modalState.formValues?.id}
        />
      ) : (
        <div>请设置表单内容</div>
      )}
    </Modal>
  );
});

export default AppModel;
