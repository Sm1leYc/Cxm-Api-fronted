import {
  getInterfaceInfoById,
  invokeInterfaceInfo
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
  Tag, Tooltip,
  Typography, Switch
} from "antd";
import { InterfaceRequestMethodEnum } from "@/enum/commonEnum";
import { errorCode } from "@/enum/ErrorCodeEnum";
import ProCard from "@ant-design/pro-card";
import { Button ,Empty} from 'antd';
import { ColumnsType } from "antd/es/table";
import {
  CrownOutlined,
  FireOutlined,
  InfoCircleOutlined, LinkOutlined,
} from '@ant-design/icons';

import { Column } from "rc-table";
import React,{ useEffect,useState } from "react";
import ReactJson from 'react-json-view';
import ReactMarkdown from 'react-markdown';

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


  const onFinish = async (values: any) => {
    if (!params.id){
      message.error('接口不存在');
      return;
    }

    if (!loginUser) {
      navigate('/user/login');
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
        autoRetry,
        connectTimeout,
        readTimeout,
        userRequestParams,
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

              <Form.Item>
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
              </Form.Item>
            </Card>


          </Form>

          <Divider />

          <Card
            title={
              <div className="custom-card-title">
                <Text strong style={{ fontSize: '16px' }}>
                  返回结果
                </Text>
                <Space
                  direction={isMobile ? 'vertical' : 'horizontal'}
                  size={isMobile ? 'small' : 'middle'}
                  style={{ marginTop: '8px' }}
                >
                  <Tag color="green" icon={<ClockCircleOutlined />}>
                    耗时：{costTime}ms
                  </Tag>
                  <Tag color="blue" icon={<FileTextOutlined />}>
                    大小：{size} KB
                  </Tag>
                </Space>
              </div>
            }
            loading={invokeLoading}
          >

            <Paragraph>
              {invokeRes ? (
                isJson ? (
                  <ReactJson
                    src={jsonData}
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
                  <div
                    style={{
                      backgroundColor: '#f6f8fa',
                      padding: '16px',
                      borderRadius: '8px',
                      wordBreak: 'break-word', // 保证长字符串不会溢出
                      whiteSpace: 'pre-wrap', // 保持换行格式
                    }}
                  >
                    <ReactMarkdown>{invokeRes}</ReactMarkdown>
                  </div>
                )
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Empty description="未发起调用，暂无请求信息" />
                </div>
              )}
            </Paragraph>

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
