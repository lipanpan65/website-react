import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { CopyOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

// 生成随机密码的函数
const generateRandomPassword = (length: number = 12): string => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

interface AppPassInputProps {
  length?: number; // 可配置生成密码的长度，默认为 12
}

const AppPassInput: React.FC<AppPassInputProps> = ({ length = 12 }) => {
  const [password, setPassword] = useState<string>(''); // 存储密码
  const [visible, setVisible] = useState<boolean>(false); // 控制密码是否显示

  // 生成随机密码并设置值
  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword(length);
    setPassword(newPassword);
    message.success('密码已生成！');
  };
  
  // 切换密码显示/隐藏
  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  // 复制密码到剪贴板
  const handleCopyPassword = () => {
    if (!password) { // 仅当密码非空时才允许复制
      message.error('没有密码可复制');
      return;
    }
    navigator.clipboard.writeText(password);
    message.success('密码已复制！');
  };

  // 输入框获取焦点时自动生成密码
  const handleFocus = () => {
    if (!password) { // 仅当密码为空时才生成密码
      handleGeneratePassword();
    }
  };

  return (
    <Input
      value={password}
      onChange={(e) => setPassword(e.target.value)} // 让用户可以编辑密码
      onFocus={handleFocus} // 聚焦时生成密码
      type={visible ? 'text' : 'password'}
      placeholder="请输入密码"
      allowClear
      suffix={ // suffix
        <>
          <Button
            icon={visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={togglePasswordVisibility}
            type="text"
            size="small"
            style={{ padding: 0, marginRight: 4 }} // 减小按钮间距
            disabled={!password} // 密码为空时禁用复制按钮
          />
          <Button
            // styles={{ : 'none' }}
            disabled={!password} // 密码为空时禁用复制按钮
            icon={<CopyOutlined />}
            onClick={handleCopyPassword}
            type="text"
            size="small"
            style={{ padding: 0 }}

          />
        </>
      }
    />
  );
};

export default AppPassInput;
