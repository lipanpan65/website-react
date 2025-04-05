import React, { useState, ReactNode, cloneElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import { Button } from 'antd';


export interface AuthButtonProps {
  isAuthenticated: boolean;
  requiredRole?: string;
  userRole?: string;
  link?: ReactNode;  // 用于 Link 类型的按钮
  button?: ReactNode;  // 用于普通按钮
  children?: ReactNode;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  isAuthenticated,
  requiredRole,
  userRole,
  link,
  button,
  children
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [targetPath, setTargetPath] = useState<string>(() => {
    if (link) {
      return (link as React.ReactElement)?.props?.to || '/';
    }
    return '/';
  });
  const navigate = useNavigate();

  const renderButton = () => {
    if (!isAuthenticated) {
      if (button) {
        // 如果是 Button 组件，在未登录状态下显示"立即登录"
        return cloneElement(button as React.ReactElement, {
          onClick: () => setIsModalVisible(true),
          children: '立即登录'
        });
      }
      // 如果是 Link，保持原有逻辑
      if (link) {
        return cloneElement(link as React.ReactElement, {
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            setIsModalVisible(true);
          }
        });
      }
      // 默认显示登录按钮
      return (
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          立即登录
        </Button>
      );
    }

    // 已登录状态下的处理
    if (button) {

      const originalOnClick = (button as React.ReactElement).props.onClick;
    
      return cloneElement(button as React.ReactElement, {
        onClick: (e: React.MouseEvent) => {
          // if (requiredRole && userRole !== requiredRole) {
          if (!isAuthenticated) {
            e.preventDefault();
            setIsModalVisible(true);
          } else {
            originalOnClick?.(e);
            // navigate(targetPath);
          }
        }
      });
    }

    if (link) {
      return cloneElement(link as React.ReactElement, {
        onClick: (e: React.MouseEvent) => {
          // if (requiredRole && userRole !== requiredRole) {
          if (!isAuthenticated) {
            e.preventDefault();
            setIsModalVisible(true);
          }
        }
      });
    }

    // return null;
  };

  const handleLoginSuccess = () => {
    setIsModalVisible(false);
    navigate(targetPath);
  };

  return (
    <>
      {renderButton()}
      <LoginModal
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default AuthButton;