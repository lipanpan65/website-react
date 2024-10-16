import React from "react";
import { theme } from 'antd';

interface AppContainerProps {
  background?: string;
  borderRadius?: string;
  minHeight?: string;
  width?: string;
  children: React.ReactNode;
  style?: React.CSSProperties; // 外层容器样式
  contentStyle?: React.CSSProperties; // 内层内容容器样式
  className?: string;
}

const AppContainer: React.FC<AppContainerProps> = ({
  background,
  borderRadius,
  minHeight = '100vh', // 默认最小高度
  width = '100%',      // 默认宽度
  children,
  style = {},
  contentStyle = {},
  className = '',
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const containerStyle: React.CSSProperties = {
    padding: '16px', // 外层容器的默认样式
    ...style,
  };

  const innerContentStyle: React.CSSProperties = {
    background: background || colorBgContainer,
    borderRadius: borderRadius || borderRadiusLG,
    minHeight,
    width,
    ...contentStyle,
  };

  return (
    <div className={`container-wrap ${className}`} style={containerStyle}>
      <div style={innerContentStyle}>
        {children}
      </div>
    </div>
  );
};

export default AppContainer;
