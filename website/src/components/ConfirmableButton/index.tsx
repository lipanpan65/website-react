import React from 'react';
import { Button, message, Modal, ButtonProps } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

interface ConfirmableButtonProps extends ButtonProps {
  onSubmit: () => Promise<any>;
  confirmTitle?: string;
  confirmContent?: string;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

const ConfirmableButton: React.FC<ConfirmableButtonProps> = ({
  onSubmit,
  confirmTitle = '确认操作',
  confirmContent = '确定要执行此操作吗？',
  loadingMessage = '操作进行中...',
  successMessage = '操作成功',
  errorMessage = '操作失败，请重试',
  children,
  ...buttonProps
}) => {
  const handleClick = () => {
    Modal.confirm({
      title: confirmTitle,
      icon: <ExclamationCircleFilled />,
      content: confirmContent,
      onOk: async () => {
        message.loading({ content: loadingMessage, key: 'confirmableButton', duration: 0 });
        try {
          await onSubmit();
          message.success({ content: successMessage, key: 'confirmableButton' });
        } catch (error) {
          message.error({ content: errorMessage, key: 'confirmableButton' });
        } finally {
          message.destroy('confirmableButton'); // 确保在操作完成后销毁加载状态
        }
      },
    });
  };

  return (
    <Button size='small' onClick={handleClick} {...buttonProps}>
      {children || '确认操作'}
    </Button>
  );
};

export default ConfirmableButton;
