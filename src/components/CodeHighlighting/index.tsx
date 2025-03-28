import React, { useState } from 'react';
// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";

type tProps = {
  codeString?: string;
  language: 'txt' | 'javascript' | 'java' | 'axios' | undefined | string;
  showLineNumbers?: boolean;
};

const CodeHighlighting = (props: tProps) => {
  const { codeString = '', showLineNumbers = true, language = 'txt' } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  // 定义 handleCopy 函数
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString); // 使用浏览器的原生 API 复制文本
      setCopied(true); // 设置为已复制状态
      setTimeout(() => setCopied(false), 2000); // 2 秒后恢复默认状态
    } catch (err) {
      alert('复制失败，请手动复制！');
      console.error('复制失败:', err);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid #e1e4e8',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#f6f8fa',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 顶部操作栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '8px',
          backgroundColor: '#f0f2f5',
          borderBottom: '1px solid #e1e4e8',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            marginRight: 'auto',
            color: '#6a737d',
            fontWeight: 500,
          }}
        >
          {language.toUpperCase()}
        </span>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: copied ? '#52c41a' : '#1890ff',
            color: '#fff',
            border: 'none',
            transition: 'background-color 0.3s ease',
          }}
        >
          {copied ? <CheckOutlined /> : <CopyOutlined />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      {/* 代码高亮区域 */}
      <SyntaxHighlighter
        showLineNumbers={showLineNumbers}
        PreTag="div"
        language={language}
        lineNumberStyle={{ fontSize: 10 }}
        style={docco}
        customStyle={{
          padding: '16px',
          margin: 0,
          fontSize: '14px',
          fontFamily: 'monospace',
          backgroundColor: 'transparent',
        }}
      >
        {String(codeString).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeHighlighting;
