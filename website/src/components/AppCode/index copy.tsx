import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { message } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import 'highlight.js/styles/github.css';  // 你喜欢的代码高亮样式
import hljs from 'highlight.js';

interface AppCodeProps {
  language?: string;
  value?: string;
  title?: string;
  children?: ReactNode;
}

const AppCode: React.FC<AppCodeProps> = ({ language = 'javascript', value = '', title = '代码示例', children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);  // 折叠状态
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);  // 高亮代码
    }
  }, [value, children]);

  // 复制代码功能
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value || (children ? children.toString() : ''));
      message.success('代码已复制到剪贴板');
    } catch (err) {
      message.error('复制失败，请重试');
    }
  };

  // 切换折叠状态
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div style={{ position: 'relative', margin: '16px 0', backgroundColor: '#f6f8fa', borderRadius: '4px' }}>
      <pre style={{
        padding: isCollapsed ? '20px 30px 10px 30px' : '10px 30px',
        margin: 0,
        minHeight: '40px',
        overflow: isCollapsed ? 'hidden' : 'auto',
        position: 'relative',
      }}>
        {/* 折叠图标和标题 */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapse();
          }}
        >
          <CaretRightOutlined
            rotate={isCollapsed ? 0 : 90}
            style={{
              fontSize: '12px',
              color: '#1890ff',
              marginRight: '5px',
              transition: 'transform 0.3s',
            }}
          />
          <span style={{
            // fontWeight: 'bold',
            color: '#000',
            fontSize: '12px'
          }}>
            {title}
          </span>
        </div>

        {/* 复制功能 */}
        <span
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: '#1890ff',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#40a9ff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#1890ff')}
        >
          复制
        </span>

        {/* 代码块内容 */}
        {!isCollapsed && (
          <code ref={codeRef} className={`language-${language}`}>
            {value || children}
          </code>
        )}
      </pre>
    </div>
  );
};

export default AppCode;
