import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '蚂蚁集团体验技术部出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={<>
        <>
          {`${currentYear} ${defaultMessage}`} |{' '}
          <a target="_blank" href="https://beian.miit.gov.cn/" rel="noreferrer">冀ICP备2024082166号-1</a>
        </>

      </>}
    />
  );
};

export default Footer;
