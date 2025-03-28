import React from 'react';
import { Tooltip, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';


const ContactAuthor = () => {
  const imageUrl = 'https://example.com/path/to/your/image.jpg'; // 替换为你的图片 URL

  const content = (
    <div>
      <img src={imageUrl} alt="Contact Author" style={{ width: 200, height: 200 }} />
    </div>
  );

  return (
    <Tooltip title={content} placement="right">
      <Button type="link" icon={<UserOutlined />}>联系作者</Button>
    </Tooltip>
  );
};

export default ContactAuthor;
