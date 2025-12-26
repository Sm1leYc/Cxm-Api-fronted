import {
  generateCurlCommand,
  getInterfaceInfoById,
  invokeInterfaceInfo,
  applyTempSecret
} from "@/services/yuanapi-bdckend/interfaceInfoController";

import { useParams} from "@@/exports";
import { PageContainer } from '@ant-design/pro-components';
import {
  Badge,
  Card,
  Descriptions,
  Divider,
  Form,
  Grid,
  Row,
  Col,
  Input,
  Alert,
  message,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Switch,
  Modal,
} from 'antd';
import { InterfaceRequestMethodEnum } from "@/enum/commonEnum";
import { errorCode } from "@/enum/ErrorCodeEnum";
import ProCard from "@ant-design/pro-card";
import { Button ,Empty} from 'antd';
import { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  CopyOutlined,
  CrownOutlined,
  FireOutlined,
  InfoCircleOutlined, KeyOutlined, LinkOutlined,
} from '@ant-design/icons';

import { Column } from "rc-table";
import React,{ useEffect,useState } from "react";
import ReactJson from 'react-json-view';
import ReactMarkdown from 'react-markdown';
import { Tabs } from 'antd';

import { useNavigate } from 'react-router-dom';

// @ts-ignore
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';

import CodeHighlighting from "@/components/CodeHighlighting";
import {ClockCircleOutlined, FileTextOutlined} from "@ant-design/icons";
import {useModel} from "@umijs/max";

import { Collapse, InputNumber } from 'antd';

const { Panel } = Collapse;

// 设置 Java 语言的语法高亮
SyntaxHighlighter.registerLanguage('java', java);

/**
 * 接口详情
 * @constructor
 */

const requestColumns: ColumnsType<API.RequestParamsRemarkVO> = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '必填',
    key: 'isRequired',
    dataIndex: 'isRequired',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '说明',
    dataIndex: 'remark',
  },
];


const responseColumns: ColumnsType<API.RequestParamsRemarkVO> = [
  {
    title: '名称',
    dataIndex: 'name',

  },
  {
    title: '类型',
    dataIndex: 'type',

  },
  {
    title: '说明',
    dataIndex: 'remark',

  },
];

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfoVO>();
  const [requestExample, setRequestExample] = useState<API.RequestParamsRemarkVO[]>()
  const params = useParams();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [costTime, setCostTime] = useState<any>();
  const [size, setSize] = useState<any>();
  // const formRef = useRef<ProFormInstance>(null);
  const [form] = Form.useForm();

  const { Paragraph, Text } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const {initialState} = useModel('@@initialState');
  const {loginUser} = initialState || {}

  const [curlCommand, setCurlCommand] = useState('');
  const [showCurlModal, setShowCurlModal] = useState(false);

  const [tempSecret, setTempSecret] = useState(''); // 新增：临时密钥状态
  const [useTempSecret, setUseTempSecret] = useState(false); // 新增：是否使用临时密钥
  const [secretLoading, setSecretLoading] = useState(false); // 新增：密钥申请加载状态

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: '16px'
  };

  let isJson = false;
  let jsonData = null;

  const [exampleIsJson, setExampleIsJson] = useState(false);
  const [exampleIsJsonData, setExampleIsJsonData] = useState<any>(null);

  const [javaCode, setJavaCode] = useState<any>();

  const navigate = useNavigate();

  // 加载数据
  const loadData = async () => {
    if (!params.id){
      message.error('参数不存在');
      return;
    }

    setLoading(true);
    try {
      const res = await getInterfaceInfoById({
        id: params.id
      });

      if (!res.data?.name) {
        navigate('/404');
      }

      setData(res.data);
      setJavaCode(res.data?.exampleCode);
      setRequestExample(res.data?.requestParamsRemark);

      try {
        setExampleIsJsonData(JSON.parse(res.data?.responseExample)) ; // 解析为 JSON
        setExampleIsJson(true)
      } catch (e) {
        setExampleIsJson(false)
      }

    } catch (error: any){
      message.error('加载接口失败，' + error.message);
    }
    setLoading(false);
  }

  useEffect( () => {
    loadData();
  }, [])

  // 生成cURL命令的函数
  const handleGenerateCurl = async () => {
    if (!params.id || !data) return;

    if (!loginUser) {
      navigate('/user/login');
    }

    try {
      const formValues = form.getFieldsValue();
      const userRequestParams = {};

      if (formValues.userRequestParams) {
        requestExample?.forEach((item, index) => {
          const value = formValues.userRequestParams[index]?.value;
          if (value !== undefined && value !== null && value.trim() !== '') {
            userRequestParams[item.name] = value.trim();
          }
        });
      }

      const res = await generateCurlCommand({
        id: params.id,
        method: data.method,
        host: data.host,
        url: data.url,
        userRequestParams,
        tempSecret,
      });

      if (res.data) {
        setCurlCommand(res.data);
        setShowCurlModal(true);
      } else {
        message.error('生成cURL命令失败');
      }
    } catch (error) {
      message.error('生成cURL命令出错');
      console.error(error);
    }
  };

// 复制cURL命令
  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    message.success('cURL命令已复制到剪贴板');
  };

  const applyForTempSecret = async () => {
    if (!params.id) return;

    try {
      const res = await applyTempSecret({
        interfaceId: params.id
      });

      if (res.code === 0 && res.data) {
        setTempSecret(res.data);
        message.success('临时密钥申请成功');
      } else {
        message.error('临时密钥申请失败: ' + res.message);
      }
    } catch (error) {
      message.error('申请临时密钥出错');
      console.error(error);
    }
  };


  const onFinish = async (values: any) => {
    if (!params.id){
      message.error('接口不存在');
      return;
    }

    if (!loginUser) {
      navigate('/user/login');
    }

    if (!tempSecret) {
      message.warning('请先获取临时密钥');
      return;
    }

    setInvokeLoading(true);

    // 获取连接超时和读取超时值
    const connectTimeout = values.connectTimeout
    const readTimeout = values.readTimeout
    const autoRetry = values.autoRetry;

    // 将Form.List的数据转换为参数对象
    const userRequestParams = {};
    if (values.userRequestParams) {
      requestExample?.forEach((item, index) => {
        const value = values.userRequestParams[index]?.value;
        // 只有当value存在且不为空字符串时才添加
        if (value !== undefined && value !== null && value.trim() !== '') {
          userRequestParams[item.name] = value.trim();
        }
      });
    }

    try {
      const res = await invokeInterfaceInfo({
        id: params.id,
        method: data?.method,
        host: data?.host,
        url:  data?.url,
        name: data?.name,
        requestPoint: data?.requiredPoints,
        autoRetry,
        connectTimeout,
        readTimeout,
        userRequestParams,
        tempSecret
      })

      setInvokeRes(res.data);
      setCostTime(res.costTime)
      setSize(res.size)

      // 外层code不是0时
      if (res.code === 0){
        message.success("请求成功");
      } else {
        message.error("接口调用失败，" + res.message);
      }

    } catch (error: any){
      message.error('操作失败，' + error.message);
    }
    setInvokeLoading(false);
  };

  useEffect(() => {
    if (requestExample) {
      form.setFieldsValue({
        userRequestParams: requestExample.map(item => ({
          value: item.defaultValue
        }))
      });
    }
  }, [requestExample, form]);

  try {
    jsonData = JSON.parse(invokeRes); // 解析为 JSON
    isJson = true;
  } catch (e) {
    isJson = false;
  }


  const renderRemarkAlert = (remarkContent, remarkType) => {
    const alertProps = remarkContent
      ? {
        message: "备注信息",
        description: remarkContent,
        type: remarkType || "info",
        style: {
          backgroundColor: "#e6f7ff",
          borderColor: "#91d5ff",
          borderRadius: "8px",
          marginTop: "16px",
        },
      }
      : {
        message: "备注信息",
        description: "暂无备注信息",
        type: "info",
        style: {
          backgroundColor: "#f6f6f6",
          borderColor: "#d9d9d9",
          borderRadius: "8px",
          marginTop: "16px",
        },
      };

    return <Alert {...alertProps} showIcon />;
  };

  return (
    <PageContainer title="查看接口">
      <Card>
        { data?.name ? (
          <>
          <Descriptions  title={
            <span style={titleStyle}>
                {data.name}
              {<Badge
                count={
                  data?.status === 1
                    ? '运行中'
                    : data?.status === 0
                      ? '已下线'
                      : data?.status === 2
                        ? '测试'
                        : '未知状态'
                }
                style={{
                  backgroundColor:
                    data?.status === 1
                      ? '#52c41a'
                      : data?.status === 0
                        ? '#f5222d'
                        : data?.status === 2
                          ? '#faad14'
                          : '#d9d9d9',
                  marginLeft: '8px',
                }}
              />}
              </span>
          }
                         column={1}
                         bordered
                         style={{
                           backgroundColor: '#fff'
                         }}
                         labelStyle={{
                           width: '120px',
                           padding: '12px 16px',
                           backgroundColor: '#fafafa'
                         }}
                         contentStyle={{
                           padding: '12px 16px'
                         }}
                         size="small"
          >
            <Descriptions.Item label="接口描述">
              <Tooltip title={data?.description || '暂无描述'}>
                <Text strong className="description-text">
                  <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  {data?.description || '暂无描述'}
                </Text>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="所需积分">
              <Tag icon={<CrownOutlined />} color="gold" className="custom-tag">
                {data?.requiredPoints || 0}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="调用次数">
              <Tag icon={<FireOutlined />} color="volcano" className="custom-tag">
                {data?.invokeCount || 0}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="请求主机">
              <Paragraph copyable>
                <Text strong className="host-text">
                  <LinkOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                  {data?.host || '未指定主机'}
                </Text>
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="请求路径">
              <Paragraph copyable>
                <Text type="secondary" className="url-text">
                  <InfoCircleOutlined style={{ marginRight: 8, color: '#faad14' }} />
                  {data?.url || '未指定路径'}
                </Text>
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="请求方法"><Tag
              color={InterfaceRequestMethodEnum[data?.method ?? 'default']}>{data?.method}</Tag></Descriptions.Item>
            {/*<Descriptions.Item label="调用类型">*/}
            {/*  <Tag*/}
            {/*    color={InterfaceTypeEnum[data?.type ?? 'default']}>{data?.type}</Tag></Descriptions.Item>*/}

            {/*<Descriptions.Item >*/}
            {/*  {renderRemarkAlert(data?.remarkContent, data?.remarkType)}*/}
            {/*</Descriptions.Item>*/}

          </Descriptions>

          {renderRemarkAlert(data?.remarkContent, data?.remarkType)}
          </>
        ) : (
          <>接口不存在</>
        )
        }
      </Card>

      <Card>
        <p className="highlightLine">接口详细描述请前往开发者在线文档查看：</p>

        <a href={data?.documentationUrl} target={"_blank"} rel="noreferrer">📘
          接口在线文档：{data?.name}</a>
      </Card>

      <Divider></Divider>

      <ProCard
        tabs={{
          type: 'card',
          tabBarStyle: { fontWeight: 'bold', fontSize: '16px' },
        }}
        split="vertical"
      >

        <ProCard.TabPane key="apiTab" tab="在线调用接口">
          <Form
            name="invoke"
            onFinish={onFinish}
            layout="vertical"
            form={form}
          >

            <Card title={"请求参数"} style={{ marginBottom: 16 }}>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={24}>
                  <Space>
                    <Button
                      type="primary"
                      onClick={applyForTempSecret}
                      loading={secretLoading}
                      icon={<KeyOutlined />}
                    >
                      {tempSecret ? '重新申请临时密钥' : '申请临时密钥'}
                    </Button>
                    {tempSecret && (
                      <Tooltip title={tempSecret}>
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          已获取临时密钥
                        </Tag>
                      </Tooltip>
                    )}
                  </Space>
                  {!tempSecret && (
                    <Alert
                      message="需要临时密钥才能调用接口"
                      type="warning"
                      showIcon
                      style={{ marginTop: 8 }}
                    />
                  )}
                </Col>
              </Row>

              <>
                <Row gutter={16}>
                  <Col xs={24} sm={16} md={12} lg={10}>

                    {/* 添加高级配置折叠面板 */}
                    <Collapse defaultActiveKey={[]} style={{ marginBottom: 16}}>
                      <Panel header="高级配置" key="1">
                        <Form.Item
                          name="interfaceUrl"
                          label={"apiUrl"}
                        >
                          <Input.Group compact>
                            <Input
                              value={data?.host + data?.url || ''}
                              style={{ backgroundColor: '#f5f5f5' }}
                              readOnly
                            />
                          </Input.Group>
                        </Form.Item>

                        <Row gutter={16}>
                          <Col span={24}>
                            <Form.Item
                              name="connectTimeout"
                              label={(
                                <>
                                  <span>连接超时时间</span>
                                  <Tooltip title={"连接到服务器的最大时间。单位：ms。默认5000"}>
                                    <InfoCircleOutlined style={{ marginLeft: 8, cursor: 'pointer' }} />
                                  </Tooltip>
                                </>
                              )}

                            >
                              <InputNumber
                                min={100}
                                max={10000}
                                step={1000}
                                style={{ width: '100%' }}
                                placeholder="请输入连接超时时间"
                              />
                            </Form.Item>

                            <Form.Item
                              name="readTimeout"
                              label={(
                                <>
                                  <span>读取超时时间</span>
                                  <Tooltip title={"等待服务器返回数据的最大时间。单位：ms。默认50000"}>
                                    <InfoCircleOutlined style={{ marginLeft: 8, cursor: 'pointer' }} />
                                  </Tooltip>
                                </>
                              )}

                            >
                              <InputNumber
                                min={1000}
                                max={100000}
                                step={10000}
                                style={{ width: '100%' }}
                                placeholder="请输入读取超时时间"
                              />
                            </Form.Item>

                            <Form.Item

                              name="autoRetry"
                              label={(
                                <>
                                  <span>自动重试</span>
                                  <Tooltip title={"SDK调用出现异常时，自动重试。重试3次，间隔2秒"}>
                                    <InfoCircleOutlined style={{ marginLeft: 8, cursor: 'pointer' }} />
                                  </Tooltip>
                                </>
                              )}
                              valuePropName="checked"
                              initialValue={false} // 默认关闭
                            >
                              <Switch />
                            </Form.Item>

                          </Col>
                        </Row>
                      </Panel>
                    </Collapse>

                  </Col>
                </Row>

                <Form.List name="userRequestParams">
                  {(fields, { add, remove }) => (
                    <>
                      {requestExample?.map((item, index) => (
                        <Row key={index} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                          <Col xs={24} sm={16} md={12} lg={10}>
                            <Form.Item
                              label={(
                                <>
                                  <span>{item.name}</span>
                                  <Tooltip title={item.remark}>
                                    <InfoCircleOutlined style={{ marginLeft: 8, cursor: 'pointer' }} />
                                  </Tooltip>
                                </>
                              )}
                              name={[index, 'value']}
                              rules={[{ required: item.isRequired === 'yes', message: `缺少${item.name}值` }]}
                            >
                              <Input allowClear placeholder={`请输入${item.name}`} />
                            </Form.Item>
                          </Col>
                        </Row>
                      ))}
                    </>
                  )}
                </Form.List>
              </>

              <>
                <Modal
                  title="cURL命令"
                  open={showCurlModal}
                  onCancel={() => setShowCurlModal(false)}
                  footer={[
                    <Button key="regenerate" type="primary" onClick={handleGenerateCurl}>
                      重新生成
                    </Button>,
                    <Button key="close" onClick={() => setShowCurlModal(false)}>
                      关闭
                    </Button>,
                  ]}
                  width={800}
                  bodyStyle={{ paddingTop: 12 }}
                >
                  <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="SDK cURL" key="1">
                      <Alert
                        message="SDK调用方式说明"
                        description={
                          <div style={{ lineHeight: '24px' }}>
                            <p><strong>1. 命令说明：</strong>此命令使用SDK签名方式，适合长期集成使用</p>
                            <p><strong>2. 安全机制：</strong>通过AccessKey和SecretKey生成签名</p>
                            <p><strong>3. X-Nonce：</strong>随机字符串，5分钟内防重放</p>
                            <p><strong>4. X-Timestamp：</strong>时间戳（服务端会校验±5分钟时效）</p>
                            <p><strong>5. X-Sign：</strong>基于请求参数和SecretKey生成的签名值</p>
                          </div>
                        }
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                      <div style={{ position: 'relative', border: '1px solid #f0f0f0', borderRadius: 4 }}>
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => {
                            navigator.clipboard.writeText(curlCommand.sdkCurl);
                            message.success('SDK cURL命令已复制到剪贴板');
                          }}
                          size="small"
                          style={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
                        />
                        <SyntaxHighlighter
                          language="bash"
                          style={{
                            maxHeight: '400px',
                            overflow: 'auto',
                            marginBottom: 0,
                            borderRadius: 4,
                            background: '#f6f8fa'
                          }}
                        >
                          {curlCommand.sdkCurl}
                        </SyntaxHighlighter>
                      </div>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="临时密钥 cURL" key="2">
                      <Alert
                        message="临时密钥调用方式说明"
                        description={
                          <div style={{ lineHeight: '24px' }}>
                            <p><strong>1. 命令说明：</strong>此命令使用临时密钥方式，适合短期测试使用</p>
                            <p><strong>2. 安全机制：</strong>通过临时密钥(TempSecret)进行鉴权</p>
                            <p><strong>3. 有效期：</strong>临时密钥有效期为2小时</p>
                            <p><strong>4. 注意事项：</strong>过期后需要重新申请临时密钥</p>
                          </div>
                        }
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                      <div style={{ position: 'relative', border: '1px solid #f0f0f0', borderRadius: 4 }}>
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => {
                            navigator.clipboard.writeText(curlCommand.tempSecretCurl);
                            message.success('临时密钥 cURL命令已复制到剪贴板');
                          }}
                          size="small"
                          style={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
                        />
                        <SyntaxHighlighter
                          language="bash"
                          style={{
                            maxHeight: '400px',
                            overflow: 'auto',
                            marginBottom: 0,
                            borderRadius: 4,
                            background: '#f6f8fa'
                          }}
                        >
                          {curlCommand.tempSecretCurl}
                        </SyntaxHighlighter>
                      </div>
                    </Tabs.TabPane>
                  </Tabs>
                </Modal>

                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={invokeLoading}
                      disabled={invokeLoading}
                      style={{
                        height: '40px',
                        borderRadius: '6px',
                        fontWeight: 500
                      }}
                    >
                      发送请求
                    </Button>
                    <Button
                      onClick={handleGenerateCurl}
                      style={{
                        height: '40px',
                        borderRadius: '6px',
                        fontWeight: 500
                      }}
                    >
                      生成cURL命令
                    </Button>
                  </Space>
                </Form.Item>
              </>


            </Card>


          </Form>

          <Divider />

          <Card
            title={
              <div className="custom-card-title">
                <Text strong style={{ fontSize: '18px', color: '#1f1f1f' }}>
                  返回结果
                </Text>
                <Space
                  direction={isMobile ? 'vertical' : 'horizontal'}
                  size={isMobile ? 'small' : 'middle'}
                  style={{ marginTop: isMobile ? '8px' : '0' }}
                >
                  <Tag
                    color="geekblue"
                    icon={<ClockCircleOutlined />}
                    style={{
                      borderRadius: '12px',
                      padding: '0 10px',
                      fontWeight: 500
                    }}
                  >
                    耗时: {costTime}ms
                  </Tag>
                  <Tag
                    color="cyan"
                    icon={<FileTextOutlined />}
                    style={{
                      borderRadius: '12px',
                      padding: '0 10px',
                      fontWeight: 500
                    }}
                  >
                    大小: {size} KB
                  </Tag>
                </Space>
              </div>
            }
            loading={invokeLoading}
            extra={
              invokeRes && (
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      isJson ? JSON.stringify(jsonData, null, 2) : invokeRes
                    );
                    message.success('已复制到剪贴板');
                  }}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    borderRadius: '4px',
                    backgroundColor: '#f0f7ff',
                    borderColor: '#91caff'
                  }}
                >
                  复制结果
                </Button>
              )
            }
            style={{
              borderRadius: '8px',
              border: '1px solid #e8e8e8',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              position: 'relative'
            }}
            headStyle={{
              backgroundColor: '#f9f9f9',
              borderBottom: '1px solid #f0f0f0',
              borderRadius: '8px 8px 0 0'
            }}
            bodyStyle={{
              padding: invokeRes ? '0' : '20px',
              backgroundColor: '#fafafa',
              minHeight: '200px',
              borderRadius: '0 0 8px 8px'
            }}
          >
            {invokeRes ? (
              <div style={{
                padding: '16px',
                maxHeight: '500px',
                overflow: 'auto'
              }}>
                {isJson ? (
                  <ReactJson
                    src={jsonData}
                    name={false}
                    displayDataTypes={false}
                    iconStyle="circle"
                    theme="summerfruit:inverted"
                    style={{
                      backgroundColor: 'transparent',
                      padding: '12px',
                      borderRadius: '6px',
                    }}
                    enableClipboard={false}
                    collapseStringsAfterLength={80}
                    displayObjectSize={false}
                    indentWidth={2}
                  />
                ) : (
                  <div
                    style={{
                      backgroundColor: '#fefefe',
                      padding: '16px',
                      borderRadius: '6px',
                      border: '1px solid #f0f0f0',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: '#24292e'
                    }}
                  >
                    <ReactMarkdown>
                      {invokeRes}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px'
              }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Text type="secondary" style={{ fontSize: '15px' }}>
                      未发起调用，暂无请求信息
                    </Text>
                  }
                />
                <Button
                  type="primary"
                  ghost
                  onClick={() => form.submit()}
                  style={{ marginTop: '16px' }}
                >
                  立即测试
                </Button>
              </div>
            )}
          </Card>


        </ProCard.TabPane>

        <ProCard.TabPane key="doc" tab="接口文档">
          <Descriptions>

            <Descriptions.Item label="请求参数说明"  span={4}/>
            <Descriptions.Item span={4}>
              <Table
                pagination={{
                  hideOnSinglePage: true,
                }}
                columns={requestColumns}
                dataSource={data?.requestParamsRemark}
              />
            </Descriptions.Item>

            <Descriptions.Item label="响应参数说明" span={4}/>
            <Descriptions.Item span={4}>
              <Table
                pagination={{
                  hideOnSinglePage: true,
                }}
                columns={responseColumns}
                dataSource={data?.responseParamsRemark}
                size={"small"}
              />
            </Descriptions.Item>

            <Descriptions.Item label="响应示例"  span={4}/>
            <Descriptions.Item span={4}>
              {exampleIsJson ? (
                <ReactJson
                  src={exampleIsJsonData}
                  name={false}
                  displayDataTypes={false}
                  style={{
                    backgroundColor: '#f6f8fa',
                    padding: '16px',
                    borderRadius: '8px',
                  }}
                  enableClipboard={true}
                />
              ) : (
                <pre style={{
                  backgroundColor: '#f6f8fa',
                  padding: '16px',
                  borderRadius: '8px',
                  overflow: 'auto'
                }}>
                  {data?.responseExample}
                </pre>
              )}
            </Descriptions.Item>

          </Descriptions>
        </ProCard.TabPane>

        <ProCard.TabPane key="errorCode" tab="错误码">
          <Table
            dataSource={errorCode} pagination={false} style={{maxWidth: 800}} size={"small"}
          >
            <Column
              title="参数名称"
              dataIndex="name"
              key="name"
              align="center"
              render={(text) => (
                <Tooltip title={text}>
                  <strong>{text}</strong>
                </Tooltip>
              )}
              ellipsis
            />
            <Column
              title="错误码"
              dataIndex="code"
              key="code"
              align="center"
              sorter={(a, b) => a.code - b.code}
            />
            <Column
              title="描述"
              dataIndex="des"
              key="des"
              align="left"
              ellipsis
              sorter={(a, b) => a.des.localeCompare(b.des)}
              render={(text) => (
                <Tooltip title={text}>
                  <span>{text}</span>
                </Tooltip>
              )}
            />
          </Table>
        </ProCard.TabPane>

        <ProCard.TabPane key="sampleCode" tab="示例代码">
          <CodeHighlighting codeString={javaCode} language={"java"}/>
        </ProCard.TabPane>

      </ProCard>
    </PageContainer>
  );
};



export default Index;
