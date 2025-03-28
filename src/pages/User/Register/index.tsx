import Footer from '@/components/Footer';
import {
  userRegister
} from "@/services/yuanapi-bdckend/userController";
import {Link, useParams} from '@@/exports';
import {
  AlipayCircleOutlined,
  LockOutlined,
  RedditOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {LoginForm, ProFormCheckbox, ProFormText} from '@ant-design/pro-components';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {Helmet, history} from '@umijs/max';
import {Form, message, Tabs} from 'antd';
import React, {useEffect, useState} from 'react';
import Settings from '../../../../config/defaultSettings';

const ActionIcons = () => {
  const langClassName = useEmotionCss(({token}) => {
    return {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    };
  });
  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={langClassName}/>
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={langClassName}/>
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={langClassName}/>
    </>
  );
};

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const [invitationCode, setInvitationCode] = useState<string>('');
  const [form] = Form.useForm();
  const params = useParams()
  const [timing, setTiming] = useState(0);

  useEffect(() => {
    if (params.id) {
      setInvitationCode(params.id);
      form.setFieldsValue(invitationCode)
    }
  }, [params.id]);

  useEffect(() => {
    form.setFieldsValue({invitationCode});
  }, [invitationCode]);
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const doRegister = (res: any) => {
    if (res.data && res.code === 0) {
      message.success('注册成功');
      setTimeout(() => {
        history.push('/user/login');
      }, 100);
    } else {
      message.error(res.message);
    }
  }

  const handleSubmit = async (values: API.UserRegisterRequest) => {
    try {
      // 登录
      const res = await userRegister({
        ...values,
      });
      doRegister(res)
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'注册账号'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          form={form}
          submitter={
            {
              searchConfig: {
                submitText: "注册"
              }
            }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          title="Cxm-API 接口开放平台"
          logo={<img alt="logo" src="/logo.svg"/>}
          subTitle={'Cxm-API 免费接口开放平台'}
          initialValues={{
            invitationCode: invitationCode
          }}
          // actions={['其他登录方式 :', <ActionIcons key="icons"/>]}
          onFinish={async (values) => {
            if (type === "account") {
              await handleSubmit(values as API.UserRegisterRequest);
            }
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '平台账号注册',
              },
              // {
              //   key: 'email',
              //   label: '邮箱账号注册',
              // }
            ]}
          />
          {type === 'account' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <RedditOutlined/>,
                }}
                placeholder={'昵称'}
              />
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'账号(字母、数字、下划线，3-20字符)'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请确认密码'}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项！',
                  },
                ]}
              />
            </>
          )}
          <ProFormCheckbox
            initialValue={true}
            name="agreeToAnAgreement"
            rules={[
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error("同意协议后才可以注册"));
                  }
                  return Promise.resolve();
                },
                required: true,
              })]}
          >
            同意并接受《<a
            target={"_blank"}
            href={"https://gitee.com/Ymcc1/statement/blob/master/%E9%9A%90%E7%A7%81%E5%8D%8F%E8%AE%AE.md"}
            rel="noreferrer">隐私协议</a>》《<a
            target={"_blank"}
            href={"https://gitee.com/Ymcc1/statement/blob/master/%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.md"}
            rel="noreferrer">用户协议</a>》
          </ProFormCheckbox>
          <div
            style={{
              marginTop: -18,
            }}
          >
            <Link
              to={'/user/login'}
              style={{
                float: 'right',
              }}
            >
              已有账号?点击前往登录
            </Link>
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Register;
