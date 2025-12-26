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
  Col,
  Statistic,
  Badge, Spin, Tooltip
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
  getApiCallHistoryById, getRecentMonthsStats
} from "@/services/yuanapi-bdckend/apiCallHistoryController";
import { useModel } from "@@/exports";
import { getUserVoById } from "@/services/yuanapi-bdckend/userController";
import ReactJson from "react-json-view";
import './custom-styles.css';
import {
  ApiOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  CodeOutlined,
  FileTextOutlined,
  FileMarkdownOutlined, AreaChartOutlined
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import {useNavigate} from "react-router-dom";
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Select } from 'antd';
const { Option } = Select;


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

  const [chartDrawerVisible, setChartDrawerVisible] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('calls');
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [monthData, setMonthData] = useState<Record<string, API.DailyStatsDto[]>>({});
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('');

  const navigate = useNavigate();

  // 初始化加载数据
  useEffect(() => {
    fetchFixedMonthsData();
  }, []);

  const fetchFixedMonthsData = async () => {
    setLoading(true);
    try {
      const res = await getRecentMonthsStats();
      if (res.code === 0 && res.data) {
        setMonthData(res.data);
        // 默认选中第一个月份
        const firstKey = Object.keys(res.data)[0];
        setSelectedMonthKey(firstKey);
      }
    } finally {
      setLoading(false);
    }
  };

// 月份选择器渲染
  const renderMonthSelector = () => {
    const monthKeys = Object.keys(monthData);
    if (monthKeys.length === 0) return null;

    return (
      <Select
        value={selectedMonthKey}
        onChange={setSelectedMonthKey}
        style={{ width: 200 }}
      >
        {monthKeys.map(key => (
          <Option key={key} value={key}>{key}</Option>
        ))}
      </Select>
    );
  };

// 获取当前选中月份数据
  // 获取当前选中月份数据
  const getCurrentMonthData = () => {
    if (!selectedMonthKey || !monthData[selectedMonthKey]) {
      return {
        month: '无数据',
        dailyStats: []
      };
    }

    // 直接从月份键中提取月份名称（格式如 "2023年12月(2023-12)"）
    const monthName = selectedMonthKey.split('(')[0].trim();
    const monthKey = selectedMonthKey.match(/\((\d{4}-\d{2})\)/)?.[1] || '';

    return {
      month: monthName || monthKey || '未知月份',
      dailyStats: monthData[selectedMonthKey] || []
    };
  };
  // 调用次数图表配置
  const getCallChartOption = (data: { month: string; dailyStats: API.DailyStatsDto[] }) => {
    return {
      title: {
        text: `${data.month} API调用次数统计`,
        left: 'center',
        textStyle: {
          color: '#333',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any[]) => {
          const date = params[0].axisValue;
          const count = params[0].data;
          return `
          <div style="font-weight:bold">${date}</div>
          <div>调用次数: <span style="color:#1890ff;font-weight:bold">${count}</span></div>
        `;
        },
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: '#eee',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          color: '#666'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.dailyStats.map(item => item.date),
        axisLine: {
          lineStyle: {
            color: '#d9d9d9'
          }
        },
        axisLabel: {
          color: '#666',
          rotate: 45,
          margin: 15
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        name: '调用次数',
        nameTextStyle: {
          color: '#666',
          padding: [0, 0, 0, 40]
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d9d9d9'
          }
        },
        axisLabel: {
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#f0f0f0'
          }
        }
      },
      series: [{
        name: '调用次数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: data.dailyStats.map(item => item.callCount),
        itemStyle: {
          color: '#1890ff',
          borderColor: '#fff',
          borderWidth: 2
        },
        lineStyle: {
          width: 3,
          color: '#1890ff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.6)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: '#096dd9',
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      }],
      animationDuration: 2000,
      animationEasing: 'cubicOut'
    };
  };

// 积分消耗图表配置
  const getPointChartOption = (data: { month: string; dailyStats: API.DailyStatsDto[] }) => {
    return {
      title: {
        text: `${data.month} 积分消耗统计`,
        left: 'center',
        textStyle: {
          color: '#333',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any[]) => {
          const date = params[0].axisValue;
          const points = params[0].data;
          return `
          <div style="font-weight:bold">${date}</div>
          <div>消耗积分: <span style="color:#52c41a;font-weight:bold">${points}</span></div>
        `;
        },
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: '#eee',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          color: '#666'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.dailyStats.map(item => item.date),
        axisLine: {
          lineStyle: {
            color: '#d9d9d9'
          }
        },
        axisLabel: {
          color: '#666',
          rotate: 45,
          margin: 15
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        name: '消耗积分',
        nameTextStyle: {
          color: '#666',
          padding: [0, 0, 0, 40]
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d9d9d9'
          }
        },
        axisLabel: {
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#f0f0f0'
          }
        }
      },
      series: [{
        name: '积分消耗',
        type: 'bar',
        barWidth: '60%',
        data: data.dailyStats.map(item => item.pointCost),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#52c41a' },
            { offset: 1, color: '#a0d911' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#389e0d' },
              { offset: 1, color: '#7cb305' }
            ])
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            return params.value > 0 ? params.value : '';
          },
          color: '#389e0d'
        }
      }],
      animationDuration: 2000,
      animationEasing: 'elasticOut'
    };
  };

  const handleDelete = async (id: any) => {
    try {
      const res = await deleteApiCallHistory({ id });
      if (res.code === 0) {
        message.success('删除成功');
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
      const res = await getApiCallHistoryById({ id: record.id });
      if (res.data) {
        setSelectedRecord(res.data);
        setDrawerVisible(true);
      } else {
        message.error('获取API调用历史失败');
      }
    } catch (error) {
      message.error('获取API调用历史失败');
    } finally {
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
        pageSize: 1000,
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

      // 设置自动刷新
      const interval = setInterval(() => {
        if (logEnabled && !drawerVisible) {
          actionRef.current?.reload();
          fetchStatistics();
        }
      }, 30000);

      return () => clearInterval(interval);
    } catch (e: any) {
      console.log(e);
    }
  }, [logEnabled, drawerVisible]);


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
      valueType: 'dateTimeRange',
      // hideInTable: true,
      search: {
        transform: (value) => ({
          startTime: value[0],
          endTime: value[1]
        })
      },
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
    },
    {
      title: '调用IP',
      dataIndex: 'clientIp',
      key: 'clientIp',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '消耗积分',
      dataIndex: 'requestPoint',
      key: 'requestPoint',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '耗时(ms)',
      dataIndex: 'duration',
      key: 'duration',
      hideInSearch: true,
      sorter: (a, b) => a.duration - b.duration,
      render: (text) => (
        <Space>
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Badge
          status={record.status === '1' ? 'success' : 'error'}
          text={record.status === '1' ? '成功' : '失败'}
        />
      ),
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
      fixed: 'right',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleRowClick(record)}
            title="查看详情"
          />
          <Popconfirm
            title="删除数据"
            key="remove"
            description="确认删除该条调用历史？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="link"
              icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
              title="删除记录"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 尝试解析JSON
  const tryParseJson = (str: string) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  };

  return (
    <PageContainer
      title="API调用历史管理"
      className="api-history-container"
      header={{ style: { background: '#f0f5ff', borderRadius: '8px' } }}
    >
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          {
            title: '总调用次数',
            value: stats.total,
            icon: <ApiOutlined style={{ color: '#1890ff' }} />,
            color: '#1890ff',
            suffix: ''
          },
          {
            title: '成功调用',
            value: stats.success,
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            color: '#52c41a',
            suffix: stats.total ? `(${Math.round(stats.success / stats.total * 100)}%)` : ''
          },
          {
            title: '失败调用',
            value: stats.failed,
            icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
            color: '#ff4d4f',
            suffix: stats.total ? `(${Math.round(stats.failed / stats.total * 100)}%)` : ''
          },
          {
            title: '平均响应时间',
            value: stats.avgDuration,
            icon: <ClockCircleOutlined style={{ color: '#722ed1' }} />,
            color: '#722ed1',
            suffix: 'ms'
          }
        ].map((stat, index) => (
          <Col xs={24} sm={12} md={6} lg={6} key={index}>
            <Card
              hoverable
              className="stats-card"
              style={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
                transition: 'all 0.3s'
              }}
              bodyStyle={{ padding: '16px 24px' }}
            >
              <Statistic
                title={<Text strong style={{ color: '#595959' }}>{stat.title}</Text>}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{
                  color: stat.color,
                  fontWeight: 'bold',
                  fontSize: '24px'
                }}
                suffix={<Text type="secondary" style={{ fontSize: '14px' }}>{stat.suffix}</Text>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 新增图表按钮 */}
      <Row style={{ marginBottom: 16, textAlign: 'right' }}>
        <Col span={24}>
          <Button
            type="primary"
            icon={<AreaChartOutlined />}
            onClick={() => setChartDrawerVisible(true)}
          >
            查看调用统计图表
          </Button>
        </Col>
      </Row>

      {/* 图表抽屉 */}
      <Drawer
        title={  <Space>
          <span>API调用统计</span>
          <Tooltip title="统计存在约10分钟的延迟">
            <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
          </Tooltip>
        </Space>}
        width="80%"
        visible={chartDrawerVisible}
        onClose={() => setChartDrawerVisible(false)}
        bodyStyle={{ padding: 0 }}
        extra={renderMonthSelector()}
      >
        <Spin spinning={loading}>
          <Tabs activeKey={activeChartTab} onChange={setActiveChartTab}>
            <Tabs.TabPane tab="调用次数" key="calls">
              <ReactECharts
                option={getCallChartOption(getCurrentMonthData())}
                style={{ height: 'calc(100vh - 180px)', width: '100%' }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="积分消耗" key="points">
              <ReactECharts
                option={getPointChartOption(getCurrentMonthData())}
                style={{ height: 'calc(100vh - 180px)', width: '100%' }}
              />
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Drawer>

      {/* 表格区域 */}
      <Card
        bordered={false}
        className="table-card"
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
          className="api-history-table"
          scroll={{ x: 'max-content' }}
          rowClassName={(record) => record.status === '0' ? 'error-row' : ''}
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
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                  暂无API调用记录
                  <br />
                    {!logEnabled && <span style={{ color: '#ff4d4f' }}>(日志记录已关闭)</span>}
                </span>
                }
              >
                {!logEnabled && (
                  <Button type="primary" onClick={() => handleSwitchChange(true)}>
                    开启日志记录
                  </Button>
                )}
              </Empty>
            )
          }}
        />
      </Card>

      <Drawer
        loading={loading}
        title={
          <span>
            <InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            API调用详情
          </span>
        }
        width={window.innerWidth * 0.8}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        className="api-detail-drawer"
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Button
            type="primary"
            onClick={() => setDrawerVisible(false)}
          >
            关闭
          </Button>
        }
      >
        {selectedRecord && (
          <>
            <Descriptions title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography.Title level={5} style={{ margin: 0, marginRight: '8px' }}>
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
                <Tag color={selectedRecord.responseCode === 200 ? 'green' : 'red'}>
                  {selectedRecord.responseCode}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="调用IP">{selectedRecord.clientIp}</Descriptions.Item>
              <Descriptions.Item label="消耗积分">{selectedRecord.requestPoint}</Descriptions.Item>
              {/*<Descriptions.Item label="">*/}
              {/*  <Tag color={selectedRecord.status === '1' ? 'green' : 'red'}>*/}
              {/*    {selectedRecord.status === '1' ? '成功' : '失败'}*/}
              {/*  </Tag>*/}
              {/*</Descriptions.Item>*/}
              <Descriptions.Item label="调用耗时">{selectedRecord.duration} ms</Descriptions.Item>
              <Descriptions.Item label="数据大小">{selectedRecord.size} KB</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Tabs
              defaultActiveKey="1"
              tabBarStyle={{ marginBottom: 0 }}
              tabBarGutter={32}
            >
              <TabPane
                tab={
                  <span>
                    <CodeOutlined />
                    Request Headers
                  </span>
                }
                key="1"
              >
                <pre className="custom-pre">{selectedRecord.requestHeaders}</pre>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <FileTextOutlined />
                    Request Body
                  </span>
                }
                key="2"
              >
                <pre className="custom-pre">{selectedRecord.requestBody}</pre>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <CodeOutlined />
                    Response Headers
                  </span>
                }
                key="3"
              >
                <pre className="custom-pre">{selectedRecord.responseHeaders}</pre>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <FileMarkdownOutlined />
                    Response Body
                  </span>
                }
                key="4"
              >
                <div className="response-container">
                  {selectedRecord.responseBody ? (
                    <Tabs type="card">
                      <Tabs.TabPane tab="JSON视图" key="json">
                        {tryParseJson(selectedRecord.responseBody) ? (
                          <ReactJson
                            src={tryParseJson(selectedRecord.responseBody)}
                            theme="monokai"
                            displayObjectSize={false}
                            displayDataTypes={false}
                            style={{ padding: 16, borderRadius: 4 }}
                          />
                        ) : (
                          <div className="json-error">
                            <Text type="warning">非JSON格式数据</Text>
                          </div>
                        )}
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="原始数据" key="raw">
                        <pre className="response-raw">
                          {selectedRecord.responseBody}
                        </pre>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Markdown" key="markdown">
                        <div className="markdown-container">
                          <ReactMarkdown>
                            {selectedRecord.responseBody}
                          </ReactMarkdown>
                        </div>
                      </Tabs.TabPane>
                    </Tabs>
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
