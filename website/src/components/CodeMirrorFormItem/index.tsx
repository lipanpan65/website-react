import React from 'react';
import { Form, FormItemProps } from 'antd';
import CodeMirrorEditor from '@/components/CodeMirrorEditor';

interface CodeMirrorFormItemProps extends FormItemProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string | number;
}

const CodeMirrorFormItem: React.FC<CodeMirrorFormItemProps> = ({ value = '', onChange = () => { }, height = 200, ...restProps }) => {
  return (
    <Form.Item {...restProps}>
      <CodeMirrorEditor value={value} onChange={onChange} />
    </Form.Item>
  );
};

export default CodeMirrorFormItem;
