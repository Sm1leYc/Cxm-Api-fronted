import {
  getUserVoById, signIn,
  updateUser,
  // getCaptchaUsingGet,
  updatePwd, updateSk
} from '@/services/yuanapi-bdckend/userController';
import {useModel} from '@@/exports';
import {requestConfig} from "@/requestConfig";
import {
  CommentOutlined,
  FieldTimeOutlined,
  LoadingOutlined,
  LockOutlined,
  PlusOutlined,
  UserOutlined,
  VerifiedOutlined, CopyOutlined,
} from '@ant-design/icons';
import {PageContainer} from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Modal,
  Row,
  Input,
  Tooltip,
  Typography,
  Upload,
  UploadFile,
  UploadProps, Space,
} from 'antd';
import {RcFile, UploadChangeParam} from 'antd/es/upload';
import React, {useEffect, useState} from 'react';
import moment from "moment";

const avatarStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
};


const Profile: React.FC = () => {
  const [data, setData] = useState<API.UserVO>({});
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false); // 专门用于签到的loading状态
  const [imageUrl, setImageUrl] = useState<string>();
  const unloadFileTypeList = ["image/jpeg", "image/webp", "image/jpg",  "image/png", "image/gif"]

  // 新增 state 控制密码修改的 Modal 显示
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    try {
      getUserInfo(initialState?.loginUser?.id);
    } catch (e: any) {
      console.log(e);
    }
  }, []);

  /**
   * 上传前校验
   * @param file 文件
   */
  const beforeUpload = async (file: RcFile) => {
    const fileType = unloadFileTypeList.includes(file.type)
    if (!fileType) {
      message.error('仅允许上传 JPG/PNG 格式的文件!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件最大上传大小为 2MB!');
      return false;
    }

    return fileType && isLt2M;
  };

  // 签到
  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      const response = await signIn({
        userId: initialState?.loginUser?.id,
      });

      if (response.code === 0) {
        message.success('签到成功，积分 +100');

        // 更新前端显示的积分信息
        setData((prevData) => ({
          ...prevData,
          points: (prevData.points || 0) + 100,
        }));
      } else {
        message.error("签到失败，" + response.message);
      }
    } catch (error : any) {
      message.error("签到失败，" + error.message);

      return ;
    } finally {
      setSigningIn(false);
    }
  };

  // 获取用户信息
  const getUserInfo = async (id: any) => {
    try {
      return getUserVoById({ id }).then((res : any) => {
        if (res.data) {
          setInitialState((s: any) => ({ ...s, loginUser: res.data }));
          setData(res.data);
          setImageUrl(res.data.userAvatar);
        }
      });
    } catch (error : any) {
      message.error("登录失败，" + error.message);
      return ;
    }
  };

  // 更新用户头像
  const updateUserAvatar = async (id: number, userAvatar: string) => {
    // 更新用户头像
    const res = await updateUser({
      id,
      userAvatar,
    });
    if (res.code !== 0) {
      message.error(`更新用户头像失败`);
    } else {
      getUserInfo(id);
    }
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success('复制成功');
      })
      .catch(() => {
        message.error('复制失败');
      });
  };

  // 打开和关闭 Modal 的方法
  const showPasswordModal = () => setIsPasswordModalVisible(true);

  const handlePasswordModalCancel = () => {
    setIsPasswordModalVisible(false);
    setNewPassword('');
    setConfirmPassword('');
  };

// 处理密码更新
  const handleUpdatePassword = async () => {
    if (newPassword.length < 8 || confirmPassword.length < 8) {
      message.error('密码长度不少于8位');
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    try {
      const response = await updatePwd({
        userPassword: newPassword,
        checkUserPassword: confirmPassword,
      });
      if (response?.data) {
        message.success('密码修改成功');
        setIsPasswordModalVisible(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        message.error('密码修改失败');
      }
    } catch (error) {
      message.error('修改密码时出错，请稍后重试');
    }
  };


  /**
   * 上传图片
   * @param info
   */
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      const response = info.file.response;

      if (response.code === 0) {
        message.success('上传成功');
        const id = initialState?.loginUser?.id as number;
        const userAvatar = response.data;
        setLoading(false);
        setImageUrl(userAvatar);
        updateUserAvatar(id, userAvatar);
      } else {
        // 处理 code !== 0 的情况
        message.error(`上传失败：${response.message || '未知错误'}`);
        setLoading(false);
      }
    } else if (info.file.status === 'error') {
      // 处理上传失败的网络或接口错误
      message.error('上传失败，请检查网络或稍后重试');
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // 重置秘钥
  const resetSecretKey = async () => {
    try {
        const res = await updateSk({
          userId: data?.id,
        });
        if (res.code === 0) {
          getUserInfo(data?.id);
          message.success('重置成功！');
        } else {
          message.error(res.message);
        }
    } catch (e: any) {
      message.error(e.message);
    }
  };
  return (
    <PageContainer>
      <Row gutter={24}>

        <Col span={24}>
          <Card title="个人信息"
                bordered={false}>
            <Row>
              <Col style={avatarStyle}>
                <Upload
                  name="file"
                  listType="picture-circle"
                  showUploadList={false}
                  action={`${requestConfig.baseURL}file/upload`}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={data?.userAvatar}
                      alt="avatar"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover', // 使图片充满容器
                        aspectRatio: '1 / 1', // 保持图像为正方形
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col>
                <CommentOutlined />
                <Tooltip title="账号用于登录以及区分于其他用户">
                  <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>我的账号：</span>
                </Tooltip>
                {data?.userAccount}
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col>
                <UserOutlined />
                <Tooltip title="这是您的昵称">
                  <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>我的昵称：</span>
                </Tooltip>
                {data?.userName}
              </Col>
            </Row>
            <Divider />
            <Row align="middle" justify="start">
              <Col>
                <VerifiedOutlined />
                <Tooltip title="积分用于调用API">
                  <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>我的积分：</span>
                </Tooltip>
                {data?.points}
              </Col>
              <Col style={{ marginLeft: '10px' }}>
                <Button type="primary" loading={signingIn} onClick={handleSignIn}>
                  签到
                </Button>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col>
                <FieldTimeOutlined />
                <Tooltip title="这是您的注册时间">
                  <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>注册时间：</span>
                </Tooltip>
                {moment(data?.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </Col>
            </Row>

            <Divider />
            <Row>
              <Col>
                <Button type="primary"
                        onClick={showPasswordModal}>
                  修改密码
                </Button>
              </Col>
            </Row>

            <Modal
              title="修改密码"
              visible={isPasswordModalVisible}
              onCancel={handlePasswordModalCancel}
              onOk={handleUpdatePassword}
            >
              <Input.Password
                placeholder="请输入新密码"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input.Password
                placeholder="请确认新密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ marginTop: 16 }}
              />
            </Modal>


          </Card>
        </Col>

        <Divider></Divider>

        <Col span={24}>
          <Card title="秘钥" bordered={false}>
            <Row>
              <Col>
                {/* accessKey */}
                <div style={{ marginBottom: 16 }}>
                  <LockOutlined />
                  <span style={{ fontWeight: 'bold', marginLeft: 8 }}>accessKey：</span>
                  {showKeys ? data?.accessKey : '••••••••••••••••'}
                  <Button
                    icon={<CopyOutlined />}
                    type="text"
                    onClick={() => copyToClipboard(data?.accessKey || '')}
                    style={{ marginLeft: 8 }}
                    disabled={!showKeys}
                  />
                </div>

                <Divider />

                {/* secretKey */}
                <div>
                  <LockOutlined />
                  <span style={{ fontWeight: 'bold', marginLeft: 8 }}>secretKey：</span>
                  {showKeys ? data?.secretKey : '••••••••••••••••'}
                  <Button
                    icon={<CopyOutlined />}
                    type="text"
                    onClick={() => copyToClipboard(data?.secretKey || '')}
                    style={{ marginLeft: 8 }}
                    disabled={!showKeys}
                  />
                </div>
              </Col>
            </Row>
            <Divider />
            <Space>
              <Button
                onClick={() => setShowKeys(!showKeys)}
                type="primary"
              >
                {showKeys ? '隐藏秘钥' : '显示秘钥'}
              </Button>
              <Button
                onClick={resetSecretKey}
                type="primary"
                danger
              >
                重置秘钥
              </Button>
            </Space>
          </Card>
        </Col>

        <Divider></Divider>

        <Col span={24}>
          <Card title="开发者SDK（在你的项目中使用SDK调用接口）" bordered={false}>
            <Button type="primary" onClick={() => { window.location.href = 'https://gitee.com/Ymcc1/cxm-api-sdk'; }}>
              Java SDK
            </Button>
          </Card>
        </Col>



      </Row>



    </PageContainer>
  );
};

export default Profile;
