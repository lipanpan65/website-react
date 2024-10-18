import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, FormInstance, ModalProps } from 'antd';
import DialogForm from './DialogForm';

interface AppDialogProps extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  initialValues?: any;
  onSubmit: (values: any) => void;
  fields: any[];  // 动态表单字段
  title?: string;
  dialogFormLayout?: 'horizontal' | 'vertical' | 'inline';  // 可选的表单布局
  dialogProps?: any;  // 可选的 DialogForm 额外属性
  setFormInstance: (formInstance: FormInstance) => void;  // 调用者传递的 formInstance 管理
  onOk?: () => void;  // 可选的 onOk
  onCancel?: () => void;  // 可选的 onCancel
}

const AppDialog = forwardRef((props: AppDialogProps, ref) => {
  const { initialValues, onSubmit, title = '创建文章分类', fields, dialogFormLayout = 'vertical', dialogProps, setFormInstance, onOk: propsOnOk, onCancel: propsOnCancel, ...modalProps } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [formInstance, setInternalFormInstance] = useState<FormInstance | null>(null);  // 内部存储 formInstance

  const showModel = (open: boolean, data?: any) => {
    setOpen(open);
  };

  const defaultOnOk = async () => {
    if (!formInstance) {
      console.error('Form instance is not available');
      return;
    }
    try {
      const values = await formInstance.validateFields();
      onSubmit(values);
    } catch (e) {
      console.error('Validation failed:', e);
    }
    setOpen(false);
  };

  const defaultOnCancel = () => {
    formInstance?.resetFields();
    setOpen(false);
  };

  const handleOk = propsOnOk || defaultOnOk;
  const handleCancel = propsOnCancel || defaultOnCancel;

  useEffect(() => {
    if (formInstance) {
      setFormInstance(formInstance);  // 将 formInstance 传递给外部
    }
  }, [formInstance, setFormInstance]);

  useImperativeHandle(ref, () => ({
    onOk: handleOk,
    onCancel: handleCancel,
    setOpen,
    showModel,
  }));

  return (
    <Modal
      open={open}
      title={title}
      okButtonProps={{ autoFocus: true }}
      onCancel={handleCancel}
      onOk={handleOk}
      destroyOnClose
      {...modalProps}  // 传递 Modal 其他属性
    >
      <DialogForm
        fields={fields}
        layout={dialogFormLayout}  // 传递 dialogFormLayout
        onFormInstanceReady={setInternalFormInstance}  // 使用内部函数存储表单实例
        {...dialogProps}  // 传递额外的 DialogForm 属性
      />
    </Modal>
  );
});

export default AppDialog;
