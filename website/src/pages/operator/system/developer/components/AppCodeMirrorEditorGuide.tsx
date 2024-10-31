import React, { useState } from 'react';
import { Button, Form, Input, Modal, message } from 'antd';
import CodeMirrorEditor from '@/components/CodeMirrorEditor';

const ExamplePage: React.FC = () => {
  const [open, setOpen] = useState(false); // 控制 Modal 显示
  const [form] = Form.useForm(); // 创建 Ant Design 表单实例
  const [codeValue, setCodeValue] = useState(''); // CodeMirror 的初始值

  // 提交表单
  const handleFinish = (values: any) => {
    console.log('表单提交的值:', values);
    message.success('表单提交成功！');
    setOpen(false);
  };

  // 打开 Modal
  const showModal = () => {
    setOpen(true);
  };

  // 关闭 Modal
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>CodeMirror 示例页面</h2>
      <Button type="primary" onClick={showModal}>
        打开表单
      </Button>

      <Modal
        title="编辑器示例"
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()} // 确保表单提交被触发
        forceRender={true} // 确保初次渲染
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ cname: '', cvalue: '' }}
        >
          <Form.Item
            name="cname"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item
            name="cvalue"
            label="代码"
            rules={[
              { required: true, message: '请输入代码' },
              { validator: (_, value) => value.trim() ? Promise.resolve() : Promise.reject('代码不能为空') },
            ]}
          >
            <CodeMirrorEditor
              value={form.getFieldValue('cvalue') || ''}
              onChange={(newValue) => {
                form.setFieldsValue({ cvalue: newValue });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamplePage;
