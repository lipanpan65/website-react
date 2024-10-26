import React, { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';

interface AuthButtonProps {
  isAuthenticated: boolean;       // 用户是否已认证
  requiredRole?: string;          // 需要的权限角色
  userRole?: string;              // 用户当前角色
  button?: ReactNode;             // 自定义按钮作为参数
  children?: ReactNode;           // 支持传递子组件
}

const AuthButton: React.FC<AuthButtonProps> = ({ isAuthenticated, requiredRole, userRole, button, children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  // 点击按钮时的权限检查逻辑
  const handleButtonClick = () => {
    if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
      setIsModalVisible(true);  // 显示登录模态框
    } else {
      navigate('/protected-route');  // 跳转到受保护的路由
    }
  };

  // 渲染按钮，并注入 handleButtonClick 到 onClick 属性
  const renderButton = () => {
    // 优先渲染自定义按钮
    if (button) {
      return React.cloneElement(button as React.ReactElement, {
        onClick: handleButtonClick,  // 注入 handleButtonClick
      });
    }

    // 如果没有传递 button，渲染 children
    return (
      <button onClick={handleButtonClick}>
        {children || '登陆'}
      </button>
    );
  };

  const handleLoginSuccess = () => {
    setIsModalVisible(false);    // 登录成功后关闭模态框
    navigate('/protected-route');  // 跳转到受保护页面
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
