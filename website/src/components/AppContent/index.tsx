import React from "react";
import { theme } from 'antd';

interface AppContentProps {
  children: React.ReactNode;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
  className?: string;
}

const AppContent: React.FC<AppContentProps> = ({
  children,
  backgroundColor,
  padding = '16px',
  borderRadius,
  style = {},
  className = '',
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const containerStyle: React.CSSProperties = {
    // display: 'flex',              // 设置 flex 布局
    // flexDirection: 'column',      // 垂直方向排列子元素
    // gap: '10px',                  // 子元素之间的间隔
    backgroundColor: backgroundColor || colorBgContainer,
    padding: padding,
    borderRadius: borderRadius || borderRadiusLG,
    ...style,                     // 合并外部传入的其他样式
  };

  return (
    <div className={`content-wrap ${className}`} style={containerStyle}>
      {children}
    </div>
  );
};

export default AppContent;
