import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { message } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import 'highlight.js/styles/github.css';  // 引入高亮样式
import hljs from 'highlight.js';

interface AppCodeProps {
  language?: string;
  value?: string;
  title?: string;
  children?: ReactNode;
  showLineNumbers?: boolean;
}

const AppCode: React.FC<AppCodeProps> = ({
  language = 'javascript',
  value = '',
  title = '代码示例',
  children,
  showLineNumbers = true
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const codeRef = useRef<HTMLElement>(null);
  const [lineHeight, setLineHeight] = useState(20);  // 初始行高设为 20px

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);

      // 获取代码内容的实际行高
      const computedLineHeight = window.getComputedStyle(codeRef.current).lineHeight;
      const parsedLineHeight = parseFloat(computedLineHeight);
      if (!isNaN(parsedLineHeight)) {
        setLineHeight(parsedLineHeight);  // 设置行高为计算得到的值
      }
    }
  }, [value, children]);

  const codeContent = value || (children ? children.toString() : '');

  // 修正行号计算
  const getLineNumbers = (code: string) => {
    const lines = code.split('\n');
    return lines.map((_, index) => index + 1);
  };

  const lineNumbers = getLineNumbers(codeContent);

  // 计算行号宽度，使用 em 单位确保对齐
  const getLineNumberWidth = () => {
    const maxDigits = Math.max(...lineNumbers).toString().length;
    return `${maxDigits + 1.5}em`;  // 动态调整宽度，预留额外空间
  };

  // 复制代码功能
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
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
    <div style={{
      position: 'relative',
      margin: '16px 0',
      backgroundColor: '#f6f8fa',
      borderRadius: '4px',
      border: '1px solid #ccc',
      overflow: 'hidden',
    }}>
      {/* 折叠按钮和标题 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ccc',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapse();
          }}
        >
          <CaretRightOutlined
            rotate={isCollapsed ? 0 : 90}
            style={{ fontSize: '16px', color: '#1890ff', marginRight: '5px', transition: 'transform 0.3s' }}
          />
          <span style={{ fontWeight: 'bold', color: '#000', fontSize: '14px' }}>
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
            marginLeft: 'auto',
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
      </div>

      {/* 代码行号和内容 */}
      {!isCollapsed && (
        <div style={{ display: 'flex', maxWidth: '100%' }}>
          {showLineNumbers && (
            <div style={{
              textAlign: 'right',
              padding: '8px',
              userSelect: 'none',
              color: '#999',
              borderRight: '1px solid #ccc',
              backgroundColor: '#eaeaea',
              width: getLineNumberWidth(),
              minWidth: getLineNumberWidth(),
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}>
              {lineNumbers.map(num => (
                <div key={num} style={{ height: `${lineHeight}px`, lineHeight: `${lineHeight}px` }}>
                  {num}
                </div>
              ))}
            </div>
          )}

          {/* 代码内容 */}
          <pre style={{
            border: 'none',
            margin: 0,
            padding: '7px',
            backgroundColor: '#f6f8fa',
            width: '100%',
            overflow: 'auto',
          }}>
            <code
              ref={codeRef}
              className={`language-${language}`}
              style={{ display: 'block', whiteSpace: 'pre-wrap', lineHeight: `${lineHeight}px` }}
            >
              {codeContent}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default AppCode;
