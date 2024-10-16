import React from "react";
import { theme } from 'antd';

interface AppContainerProps {
  background?: string;
  borderRadius?: string;
  minHeight?: string;
  width?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const AppContainer: React.FC<AppContainerProps> = ({
  background,
  borderRadius,
  minHeight = '100vh', // 默认最小高度
  width = '100%',      // 默认宽度
  children,
  style = {},
  className = '',
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const containerStyle: React.CSSProperties = {
    background: background || colorBgContainer,
    borderRadius: borderRadius || borderRadiusLG,
    minHeight,
    width,
    ...style,
  };

  return (
    <div className={`container ${className}`} style={containerStyle}>
      {children}
    </div>
  );
};

export default AppContainer;
