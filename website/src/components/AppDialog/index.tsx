import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, FormInstance, ModalProps } from 'antd';
import DialogForm from './DialogForm';

interface AppDialogProps extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  initialValues?: any;
  record?: any; // 新增 record 属性
  onSubmit: (values: any) => void;
  fields: any[]; // 动态表单字段
  title?: string;
  dialogFormLayout?: 'horizontal' | 'vertical' | 'inline'; // 可选的表单布局
  dialogProps?: any; // 可选的 DialogForm 额外属性
  setFormInstance: (formInstance: FormInstance) => void; // 调用者传递的 formInstance 管理
  onOk?: () => void; // 可选的 onOk
  onCancel?: () => void; // 可选的 onCancel
  isEditing?: boolean; // 是否为编辑模式，用于控制变化检测
  loading?: boolean;
}

const AppDialog = forwardRef((props: AppDialogProps, ref) => {
  const {
    initialValues,
    record = {}, // 将 record 设为默认空对象
    onSubmit,
    title = '创建文章分类',
    fields,
    dialogFormLayout = 'vertical',
    dialogProps,
    setFormInstance,
    onOk: propsOnOk,
    onCancel: propsOnCancel,
    isEditing = false,
    loading = false, // 新增 loading 状态，默认值为 false
    ...modalProps
  } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false); // 追踪表单变化
  const [formInstance, setInternalFormInstance] = useState<FormInstance | null>(null);

  const showModel = (isOpen: boolean, data?: any) => {
    setOpen(isOpen);
    setIsFormChanged(false); // 打开时禁用按钮
    if (isOpen && formInstance) {
      formInstance.setFieldsValue(data || initialValues || {}); // 设置表单初始值
    }
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

  const handleFieldsChange = (_: any, allFields: any[]) => {
    if (isEditing) {
      // 比较当前字段值和 record 中的值来检测是否发生变化
      const isChanged = allFields.some(field => field.value !== record?.[field.name[0]]);
      setIsFormChanged(isChanged);
    }
  };

  const handleOk = propsOnOk || defaultOnOk;
  const handleCancel = propsOnCancel || (() => formInstance?.resetFields());

  useEffect(() => {
    if (formInstance) {
      setFormInstance(formInstance); // 将 formInstance 传递给外部
      if (initialValues) {
        formInstance.setFieldsValue(initialValues); // 设置初始值
      }
    }
  }, [formInstance, setFormInstance, initialValues]);

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
      loading={loading}
      okButtonProps={{ disabled: isEditing && !isFormChanged }} // 初次打开时禁用按钮，仅在编辑模式检查变化状态
      onCancel={handleCancel}
      onOk={handleOk}
      destroyOnClose
      // styles={{ body: { padding: '20px' } }} // 使用 styles.body 设置内容内边距
      {...modalProps}
    >
      <DialogForm
        fields={fields}
        layout={dialogFormLayout}
        initialValues={initialValues}
        onFormInstanceReady={setInternalFormInstance}
        onFieldsChange={handleFieldsChange} // 监听字段变化
        {...dialogProps}
      />
    </Modal>
  );
});

export default AppDialog;
