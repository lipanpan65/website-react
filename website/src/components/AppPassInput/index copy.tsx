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

  // 生成密码并设置值
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
    navigator.clipboard.writeText(password);
    message.success('密码已复制到剪贴板');
  };

  // 输入框获取焦点时自动生成密码
  const handleFocus = () => {
    if (!password) { // 仅当密码为空时才生成密码
      handleGeneratePassword();
    }
  };

  return (
    // <div style={{ display: 'flex', flexDirection: 'column', width: 300, margin: '0 auto' }}>
      <Input
        value={password}
        allowClear
        onChange={(e) => setPassword(e.target.value)}
        onFocus={handleFocus} // 聚焦时生成密码
        type={visible ? 'text' : 'password'}
        placeholder="请输入密码"
        style={{ marginBottom: 10 }}
        suffix={
          <>
            {password && (
              <>
                <EyeOutlined
                  onClick={togglePasswordVisibility}
                  style={{ cursor: 'pointer', marginRight: 8 }}
                />
                <CopyOutlined
                  onClick={handleCopyPassword}
                  style={{ cursor: 'pointer' }}
                />
              </>
            )}
          </>
        }
        // addonAfter={
        //   <div style={{ display: 'flex' }}>
        //     <Button
        //       type='text'
        //       onClick={handleCopyPassword}
        //       icon={<CopyOutlined />}
        //       style={{ background: 'transparent', border: 'none' }} // 去掉按钮背景
        //       size="small"
        //       // style={{ marginRight: 5 }}
        //       disabled={!password} // 密码为空时禁用复制按钮
        //     />
        //     <Button
        //       type='text'
        //       onClick={togglePasswordVisibility}
        //       icon={visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        //       size="small"
        //       disabled={!password} // 密码为空时禁用显示/隐藏按钮
        //     />
        //   </div>
        // }
      />
    // </div>
  );
};

export default AppPassInput;
