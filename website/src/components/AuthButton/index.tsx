import React, { useState, ReactNode, cloneElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';

interface AuthButtonProps {
  isAuthenticated: boolean;
  requiredRole?: string;
  userRole?: string;
  button?: ReactNode;
  children?: ReactNode;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  isAuthenticated,
  requiredRole,
  userRole,
  button,
  children
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  // const handleButtonClick = () => {
  //   if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
  //     setIsModalVisible(true);
  //   } else {
  //     navigate('/protected-route');
  //   }
  // };

  const handleButtonClick = (e: React.MouseEvent) => {
    // 权限不足时阻止默认行为
    if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
      e.preventDefault(); // 阻止 Link 或 a 标签的默认跳转
      setIsModalVisible(true);
    }
    // 权限通过时不阻止，让 Link 或 a 标签自行跳转
  };

  const renderButton = () => {
    if (button) {
      // 判断是否为 Link 组件
      const isLink = (button as React.ReactElement).type === Link;
      
      return cloneElement(button as React.ReactElement, {
        onClick: (e: any) => {
          handleButtonClick(e); // 先执行权限校验
          if (isLink && isAuthenticated && requiredRole === userRole) {
            // 权限通过时，手动触发 Link 的跳转（可选）
            // 或依赖 Link 自身的 to 属性跳转
          }
        },
      });
    }
    return (
      <button onClick={handleButtonClick}>
        {children || '登陆'}
      </button>
    );
  };


  const handleLoginSuccess = () => {
    setIsModalVisible(false);
    navigate('/protected-route');
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