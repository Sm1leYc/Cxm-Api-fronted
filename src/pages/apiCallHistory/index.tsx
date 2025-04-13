import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  Drawer,
  Tag,
  Button,
  Descriptions,
  Divider,
  Switch,
  Tabs,
  message,
  Space,
  Popconfirm,
  Empty,
  Typography,
  Card,
  Row,
  Col, Statistic,
} from 'antd';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import moment from 'moment';
import React, { useRef, useState, useEffect } from 'react';
import {
  listApiCallHistory,
  updateLoggingStatus,
  deleteApiCallHistory,
  getApiCallHistoryById
} from "@/services/yuanapi-bdckend/apiCallHistoryController";
import { useModel } from "@@/exports";
import { getUserVoById } from "@/services/yuanapi-bdckend/userController";
import ReactJson from "react-json-view";
import './custom-styles.css';
import {
  ApiOutlined, CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import {useNavigate} from "react-router-dom";

const TableList: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<API.ApiCallHistory | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>();
  const [logEnabled, setLogEnabled] = useState(true);
  const { TabPane } = Tabs;
  const { Text } = Typography;
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    avgDuration: 0
  });

  const navigate = useNavigate();

  const handleDelete = async (id: any) => {
    try {
      const res = await deleteApiCallHistory({ id });
      if (res.code === 0) {
        message.success('删除成功');
        // 刷新表格数据
        actionRef.current?.reload();
        fetchStatistics();
      } else {
        message.error(`删除失败: ${res.message}`);
      }
    } catch (error) {
      message.error(`删除失败: ${error.message}`);
    }
  };

  const handleRowClick = async (record: any) => {
    setLoading(true);
    try {
      // 调用详情接口获取最新数据
      const res = await getApiCallHistoryById({ id: record.id });
      if (res.data) {
        setSelectedRecord(res.data);
        setDrawerVisible(true);
      } else {
        message.error('获取API调用历史失败');
      }
    } catch (error) {
      message.error('获取API调用历史失败');
      // console.error('Error fetching detail:', error);
    }finally {
      setLoading(false);
    }
  };

  const getUserInfo = async (id: any) => {
    try {
      return getUserVoById({ id }).then((res) => {
        if (res.data) {
          setInitialState((s: any) => ({ ...s, loginUser: res.data }));
          setLogEnabled(res.data.loggingEnabled === 1);
        }
      });
    } catch (error: any) {
      message.error("登录失败，" + error.message);
      return;
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await listApiCallHistory({
        userId: initialState?.loginUser?.id,
        current: 1,
        pageSize: 1000, // 获取足够的数据计算统计信息
      });

      if (res?.data?.records) {
        const data = res.data;
        const successCount = data.records?.filter(r => r.status === '1').length;
        const totalDuration = data.records?.reduce((sum, record) => sum + (Number(record.duration) || 0), 0);;
        const total = Number(data.total);

        setStats({
          total: total,
          success: successCount ? successCount : 0,
          failed: successCount ? total - successCount : 0,
          avgDuration: (total && totalDuration )? Math.round(totalDuration / total) : 0
        });
      }
    } catch (error) {
      console.error('获取统计数据失败', error);
    }
  };

  useEffect(() => {
    try {
      getUserInfo(initialState?.loginUser?.id);
      fetchStatistics();
    } catch (e: any) {
      console.log(e);
    }
  }, []);


  const handleSwitchChange = async (checked) => {
    if (!initialState?.loginUser) {
      message.warning("更新状态失败，请先登录！")
      navigate('/user/login');
      return;
    }

    try {
      const res = await updateLoggingStatus({
        loggingEnabled: checked,
        userId: initialState?.loginUser?.id,
      });
      if (res.data){
        setLogEnabled(checked);
        if (checked){
          message.success( '记录日志已开启！');
          message.success( '您的调用历史将被保留7天！');
        } else {
          message.warning( '记录日志已关闭！');
        }
      } else {
        message.error("更新记录日志状态失败" + res.message);
      }

    } catch (error) {
      message.error('更新记录日志状态失败');
    }
  };

  const columns: ProColumns<API.ApiCallHistory>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: 'traceId',
      dataIndex: 'traceId',
      key: 'traceId',
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: '请求时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      valueType: 'dateTime',
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#1890ff' }} />
          {moment(record.timestamp).format('YYYY-MM-DD HH:mm:ss')}
        </Space>
      ),
    },
    {
      title: '接口名称',
      dataIndex: 'interfaceName',
      key: 'interfaceName',
    },
    {
      title: '调用方法',
      dataIndex: 'httpMethod',
      render: (method) => (
        <Tag color="blue" style={{ textTransform: 'uppercase' }}>
          {method}
        </Tag>
      ),
      width: 100,
      valueEnum: {
        GET: { text: 'GET', status: 'GET' },
        POST: { text: 'POST', status: 'POST' },
        PUT: { text: 'PUT', status: 'PUT' },
        DELETE: { text: 'DELETE', status: 'DELETE' },
      },
    },
    {
      title: '响应码',
      dataIndex: 'responseCode',
      key: 'responseCode',
      hideInSearch: true,
      hideInTable: true,
      // render: (text) => <Tag color={text === 0 ? 'green' : 'red'}>{text}</Tag>,
    },
    {
      title: '调用IP',
      dataIndex: 'clientIp',
      key: 'clientIp',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      hideInSearch: true,
      sorter: (a, b) => a.duration - b.duration,
      render: (text) => (
        <Space>
          <span>{text}</span>
          <span style={{ color: '#8c8c8c' }}>ms</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        0: {
          text: '失败',
          status: 'Error',
        },
        1: {
          text: '成功',
          status: 'Success',
        },
      },
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleRowClick(record)}>
            详情
          </Button>
          <Popconfirm
            title="删除数据"
            key="remove"
            description="确认删除该条调用历史？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => {
              handleDelete(record.id)
            }}
          >
            <a key="remove" style={{ color: 'red' }}>
              删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];


  return (
    <PageContainer>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}>
            <Statistic
              title={<Text strong>总调用次数</Text>}
              value={stats.total}
              prefix={<ApiOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}>
            <Statistic
              title={<Text strong>成功调用</Text>}
              value={stats.success}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              suffix={<Text type="secondary" style={{ fontSize: '14px' }}>{stats.total ? `(${Math.round(stats.success / stats.total * 100)}%)` : ''}</Text>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}>
            <Statistic
              title={<Text strong>失败调用</Text>}
              value={stats.failed}
              valueStyle={{ color: '#ff4d4f', fontWeight: 'bold' }}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              suffix={<Text type="secondary" style={{ fontSize: '14px' }}>{stats.total ? `(${Math.round(stats.failed / stats.total * 100)}%)` : ''}</Text>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}>
            <Statistic
              title={<Text strong>平均响应时间</Text>}
              value={stats.avgDuration}
              valueStyle={{ color: '#722ed1', fontWeight: 'bold' }}
              prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
              suffix="ms"
            />
          </Card>
        </Col>
      </Row>

      {/* 表格区域 */}
      <Card
        bordered={false}
        style={{
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
          marginBottom: 24
        }}
      >
      <ProTable<API.ApiCallHistory, API.PageParams>
        headerTitle="API调用历史"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        options={{
          density: false,
          setting: false,
        }}
        toolBarRender={() => (
          <Space>
            <Switch
              checked={logEnabled}
              onChange={handleSwitchChange}
              checkedChildren="记录日志"
              unCheckedChildren="不记录日志"
              key="switch"
            />
          </Space>
        )}
        request={
          async (params, sort, filter) => {
          const res: any = await listApiCallHistory({
            userId: initialState?.loginUser?.id,
            ...params,
          });
          return {
            data: res?.data?.records || [],
            success: res?.data ? true : false,
            total: res?.data?.total || 0,
          };
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      </Card>

      <Drawer
        loading={loading}
        title="API调用详情"
        width={window.innerWidth * 0.8}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {selectedRecord && (
          <>
            <Descriptions  title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff', fontSize: '20px' }} />
                <Typography.Title level={4} style={{ margin: 0, marginRight: '8px' }}>
                  基础详情
                </Typography.Title>
                <Tag color="blue" style={{ fontSize: '14px' }}>
                  traceId:{selectedRecord.traceId}
                </Tag>
              </div>
            } bordered>
              <Descriptions.Item label="调用接口">{selectedRecord.interfaceName}</Descriptions.Item>
              <Descriptions.Item label="调用路径">{selectedRecord.requestPath}</Descriptions.Item>
              <Descriptions.Item label="请求时间">{moment(selectedRecord.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
              <Descriptions.Item label="调用方法">
                <Tag color="blue">{selectedRecord.httpMethod}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="响应码">
                <Tag color={selectedRecord.responseCode === 0 ? 'green' : 'red'}>
                  {selectedRecord.responseCode}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="调用IP">{selectedRecord.clientIp}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedRecord.status === '1' ? 'green' : 'red'}>
                  {selectedRecord.status === '1' ? '成功' : '失败'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="调用耗时">{selectedRecord.duration} ms</Descriptions.Item>
              <Descriptions.Item label="数据大小">{selectedRecord.size} KB</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Tabs defaultActiveKey="1">
              <TabPane tab="Request Headers" key="1">
                <pre className="custom-pre">{selectedRecord.requestHeaders}</pre>
              </TabPane>
              <TabPane tab="Request Body" key="2">
                <pre className="custom-pre">{selectedRecord.requestBody}</pre>
              </TabPane>
              <TabPane tab="Response Headers" key="3">
                <pre className="custom-pre">{selectedRecord.responseHeaders}</pre>
              </TabPane>
              <TabPane tab="Response Body" key="4">
                <div style={{ maxHeight: '400px', overflowY: 'auto', backgroundColor: '#f6f8fa', padding: '16px', borderRadius: '8px' }}>
                  {selectedRecord.responseBody ? (
                    (() => {
                      let isJson = false;
                      let jsonData = null;

                      try {
                        jsonData = JSON.parse(selectedRecord.responseBody); // 尝试解析 JSON
                        isJson = true;
                      } catch (e) {
                        isJson = false; // 解析失败
                      }

                      return isJson ? (
                        <ReactJson
                          src={jsonData}
                          name={false}
                          displayDataTypes={false}
                          style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                          enableClipboard={true}
                        />
                      ) : (
                        <div
                          style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            color: '#333',
                          }}
                        >
                          {/*{selectedRecord.responseBody}*/}
                          <ReactMarkdown>{selectedRecord.responseBody}</ReactMarkdown>
                        </div>
                      );
                    })()
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Empty description="暂无响应数据" />
                    </div>
                  )}
                </div>
              </TabPane>
            </Tabs>
          </>
        )}
      </Drawer>


    </PageContainer>
  );
};

export default TableList;
