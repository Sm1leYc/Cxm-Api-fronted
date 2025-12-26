import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import {
  message,
  Card,
  Typography,
  Badge,
  Row,
  Col,
  Input,
  Tag,
  Empty,
  Skeleton,
  Tooltip,
  Divider
} from 'antd';
import { history } from '@umijs/max';
import {
  FireOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { listInterfaceInfoByPage } from '@/services/yuanapi-bdckend/interfaceInfoController';
import './Index.css';

const { Text, Title } = Typography;
const { Search } = Input;

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchName, setSearchName] = useState<string>('');
  const pageSize = 50; // [!code ++] // 调整为较大的数值以加载所有数据

  // 加载数据
  const loadData = async (current = 1, size = pageSize, name = '') => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPage({
        current,
        pageSize: size,
        name,
      });
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error: any) {
      message.error('加载接口失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(currentPage, pageSize, searchName);
  }, [currentPage, searchName]);

  const onSearch = (value: string) => {
    setSearchName(value);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: number) => {
    const statusMap = {
      0: { text: '已下线', color: '#f5222d' },
      1: { text: '运行中', color: '#52c41a' },
      2: { text: '测试中', color: '#faad14' },
    };

    return statusMap[status] || { text: '未知状态', color: '#d9d9d9' };
  };

  const formatInvokeCount = (count: number): string => {
    if (!count && count !== 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  return (
    <PageContainer
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RocketOutlined style={{ color: '#1890ff', fontSize: 24, marginRight: 12 }} />
          <span style={{ fontSize: 22, fontWeight: 600 }}>免费接口</span>
        </div>
      }
      style={{ background: 'linear-gradient(to bottom, #f0f5ff 0%, #ffffff 100px)' }}
    >
      <Row justify="center" style={{ marginBottom: 40 }}>
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Search
            allowClear
            placeholder="输入接口名称、功能描述或关键词..."
            enterButton={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SearchOutlined style={{ marginRight: 6 }} /> 搜索接口
              </div>
            }
            size="large"
            maxLength={30}
            onSearch={onSearch}
            style={{
              width: '100%',
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.2)',
              borderRadius: 50
            }}
          />
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow: '0 6px 16px -8px rgba(0, 0, 0, 0.08), 0 9px 28px 0 rgba(0, 0, 0, 0.05)',
          background: 'transparent',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '24px 16px' }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Text strong style={{ fontSize: 16 }}>
              共发现 <span style={{ color: '#1890ff', fontWeight: 600 }}>{total}</span> 个接口
              {searchName && (
                <span>
                  ，"<Text style={{ color: '#ff4d4f' }}>{searchName}</Text>" 的搜索结果
                </span>
              )}
            </Text>
          </Col>
          <Col>
            <Tag icon={<ClockCircleOutlined />} color="geekblue">
              最后更新: {new Date().toLocaleDateString()}
            </Tag>
          </Col>
        </Row>

        <Skeleton
          loading={loading}
          active
          paragraph={{ rows: 8 }}
          avatar={{ shape: 'square' }}
          style={{ padding: 24 }}
        >
          {list.length > 0 ? (
            <Row gutter={[24, 24]}>
              {list.map((item) => {
                const apiLink = `/interface/${item.id}`;
                const status = getStatusBadge(item.status);

                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                    <Card
                      hoverable
                      onClick={() => history.push(apiLink)}
                      className="api-card"
                      style={{
                        height: '100%',
                        borderRadius: 12,
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        overflow: 'hidden',
                        border: '1px solid rgba(24, 144, 255, 0.1)',
                        background: 'linear-gradient(145deg, #ffffff, #f8fbff)'
                      }}
                      bodyStyle={{
                        padding: 16,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <Badge
                          color={status.color}
                          text={
                            <Title level={5} ellipsis style={{ margin: 0, fontSize: 16 }}>
                              {item.name}
                            </Title>
                          }
                        />
                      </div>

                      <Text
                        type="secondary"
                        style={{
                          fontSize: 14,
                          marginBottom: 16,
                          flex: 1,
                          minHeight: 44,
                          lineHeight: '22px',
                          color: '#595959'
                        }}
                      >
                        {item.description || '该接口暂无功能描述...'}
                      </Text>

                      <Divider
                        style={{
                          margin: '12px 0',
                          background: 'linear-gradient(to right, transparent, #1890ff, transparent)',
                          height: 1,
                          opacity: 0.3
                        }}
                      />

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Badge
                          count={status.text}
                          style={{
                            backgroundColor: status.color,
                            fontSize: 12,
                            fontWeight: 500,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                          }}
                        />

                        <div style={{ display: 'flex', gap: 8 }}>
                          <Tooltip title={`调用次数: ${item?.invokeCount || 0}`}>
                            <Tag
                              icon={<FireOutlined />}
                              style={{
                                margin: 0,
                                background: 'linear-gradient(45deg, #ff7c45, #ff4d4f)',
                                color: '#fff',
                                fontWeight: 500,
                                border: 'none',
                                borderRadius: 12
                              }}
                            >
                              {formatInvokeCount(item?.invokeCount || 0)}
                            </Tag>
                          </Tooltip>
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Empty
              imageStyle={{ height: 200 }}
              description={
                <Text style={{ fontSize: 16, color: '#595959' }}>
                  {searchName
                    ? `没有找到 "${searchName}" 相关的接口`
                    : '暂无可用接口数据'}
                </Text>
              }
              style={{ padding: '60px 0' }}
            >
              <Tag color="blue" icon={<ApiOutlined />} style={{ marginTop: 16 }}>
                尝试其他关键词搜索
              </Tag>
            </Empty>
          )}
        </Skeleton>
      </Card>
    </PageContainer>
  );
};

export default Index;
