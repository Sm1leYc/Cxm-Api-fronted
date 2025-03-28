import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { Button } from 'antd';

export const DocumentationButton = () => {
  return (
    <Button
      type="primary"
      onClick={() => {
        window.open('http://doc.ymcapi.xyz/');
      }}
      style={{
        marginLeft: 2, // 根据需要调整按钮的位置
      }}
    >
      开发者文档
    </Button>
  );
};
