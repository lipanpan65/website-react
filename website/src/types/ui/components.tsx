/**
 * 按钮组件属性
 */
export interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
  }
  
  /**
   * 模态框组件属性
   */
  export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
    footer?: React.ReactNode;
  }
  
  /**
   * 确认对话框属性
   */
  export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger';
  }