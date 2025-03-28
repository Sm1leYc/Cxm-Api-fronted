import Footer from '@/components/Footer';
import { DocumentationButton } from '@/components/RightContent';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import Settings from '../config/defaultSettings';
import { requestConfig } from './requestConfig';
import React, {useState} from 'react';
import { AvatarDropdown, AvatarName } from './components/RightContent/AvatarDropdown';
import { getLoginUser } from "@/services/yuanapi-bdckend/userController";
import {FloatButton, Form, Input, message, Modal, Radio} from 'antd';
import { FormOutlined, GithubOutlined, PlusOutlined, QqOutlined, UpOutlined} from '@ant-design/icons'; // 导入图标
import qq from '@/../public/icons/qq.jpg';
import {feedbackInterfaceInfo} from "@/services/yuanapi-bdckend/feedbackController";
import {useNavigate} from "react-router-dom";

const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<InitialState> {
  // 当页面首次加载时，获取要全局保存的数据，比如用户登录信息
  const state: InitialState = {
    loginUser: undefined,
    settings: Settings
  };
  try {
    const res = await getLoginUser();
    if (res.data) {
      state.loginUser = res.data;
    }
  } catch (error) {
    history.push(loginPath);
  }
  return state;
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const sendFeedback = async (values: API.FeedbackInterfaceInfoRequest) => {
    if (!initialState?.loginUser) {
      navigate('/user/login');
    }

    // 这里调用你的API发送请求
    try {
      const res = await feedbackInterfaceInfo({
        ...values,
      });
      if (res.data) {
        message.success('反馈提交成功');
      } else {
        message.error('反馈提交失败:' + res.message);
      }
    } catch (error) {
      message.error('反馈提交失败');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // 发送请求到后台
      await sendFeedback({ ...values });
      setIsModalVisible(false);
      form.resetFields();
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };

  return {
    actionsRender: () => [<DocumentationButton key="doc" />],
    avatarProps: {
      src: initialState?.loginUser?.userAvatar ? initialState?.loginUser?.userAvatar :
        "https://ymc-4869-1312786139.cos.ap-beijing.myqcloud.com/images/d2473f92-afb0-44a0-9c5a-0ebe99587fe7.jpeg",
      title: initialState?.loginUser ? <AvatarName/> : "我是一个游客",
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    // waterMarkProps: {
    //   content: initialState?.loginUser?.userName,
    // }, 水印
    footerRender: () => <Footer />,

    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    menuHeaderRender: undefined,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      return (
        <>
          {children}

          {/* 悬浮按钮 */}
          <FloatButton.Group trigger="click" style={{ right: 24, bottom: 30 }} icon={<PlusOutlined/>}>
            <FloatButton
              tooltip={"查看本站技术及源码，欢迎 star"}
              icon={<GithubOutlined/>}
              onClick={() => {
                window.open("https://github.com/Sm1leYc/Cxm-Api.git", "_blank");
              }
              }
            />
            <FloatButton
              tooltip={<img src={qq} alt="QQ" width="120"/>}
              icon={<QqOutlined/>}
            />
            <FloatButton
              tooltip="反馈建议和问题"
              icon={<FormOutlined />}
              onClick={showModal} // 点击显示反馈弹窗
            />
            <FloatButton
              tooltip="返回顶部"
              shape="circle"
              icon={<UpOutlined />}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' }); // 手动滚动到顶部
              }}
            />
          </FloatButton.Group>

          <Modal title="反馈" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form form={form} layout="vertical">
              <Form.Item
                label="反馈类型"
                name="feedbackType"
                rules={[{ required: true, message: '请选择反馈类型' }]}
              >
                <Radio.Group>
                  <Radio value="suggestion">功能建议</Radio>
                  <Radio value="bug">Bug报告</Radio>
                  <Radio value="other">其他</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="反馈内容"
                name="feedbackContent"
                rules={[{ required: true, message: '请填写反馈内容' }]}
              >
                <Input.TextArea placeholder="请详细描述您的反馈" />
              </Form.Item>

              <Form.Item
                label="联系方式"
                name="contact"
              >
                <Input placeholder="请输入您的邮箱(其他联系方式请备注)" />
              </Form.Item>

            </Form>
          </Modal>

          {/* 设置按钮 */}
          {/*<SettingDrawer*/}
          {/*  disableUrlParams*/}
          {/*  enableDarkTheme*/}
          {/*  settings={initialState?.settings}*/}
          {/*  onSettingChange={(settings) => {*/}
          {/*    setInitialState((preInitialState) => ({*/}
          {/*      ...preInitialState,*/}
          {/*      settings,*/}
          {/*    }));*/}
          {/*  }}*/}
          {/*/>*/}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = requestConfig;
