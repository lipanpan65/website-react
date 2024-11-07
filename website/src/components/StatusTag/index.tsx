import React from 'react';
import { Tag } from 'antd';

// 将键的类型定义为字符串，避免类型冲突
const STATUS_COLORS: { [key: string]: string } = {
  '1': 'green',
  '0': 'red'
};

const STATUS_TEXTS: { [key: string]: string } = {
  '1': '启用',
  '0': '禁用'
};

interface StatusTagProps {
  status: number; // 状态可以是 0 或 1
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  // 将数字类型的 status 转换为字符串类型
  const statusKey = String(status);
  
  return (
    <Tag color={STATUS_COLORS[statusKey]}>
      {STATUS_TEXTS[statusKey]}
    </Tag>
  );
};

export default StatusTag;
