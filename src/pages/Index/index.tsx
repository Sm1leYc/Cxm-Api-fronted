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
  SearchOutlined
} from '@ant-design/icons';
import { listInterfaceInfoByPage } from '@/services/yuanapi-bdckend/interfaceInfoController';
import './Index.css';

const { Text } = Typography;
const { Search } = Input;

/**
 * 接口展示主页
 * @constructor
 */
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
      title="免费接口"
    >
      <Row justify="center" style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Search
            allowClear
            placeholder="搜索接口名称"
            enterButton={<><SearchOutlined />搜索</>}
            size="large"
            maxLength={30}
            onSearch={onSearch}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
          backgroundColor: '#f8f9fa'
        }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Text strong>
              共 {total} 个接口 {searchName && `"${searchName}" 的搜索结果`}
            </Text>
          </Col>
          <Col>
            <Text type="secondary">
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              最后更新: {new Date().toLocaleDateString()}
            </Text>
          </Col>
        </Row>

        <Skeleton loading={loading} active paragraph={{ rows: 10 }}>
          {list.length > 0 ? (
            <Row gutter={[16, 16]}>
              {list.map((item) => {
                const apiLink = `/interface/${item.id}`;
                const status = getStatusBadge(item.status);

                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                    <Card
                      hoverable
                      onClick={() => history.push(apiLink)}
                      style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '8px',
                        transition: 'all 0.3s',
                        overflow: 'hidden',
                      }}
                      bodyStyle={{
                        padding: '16px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ marginBottom: 10 }}>
                        <Badge
                          color={status.color}
                          text={
                            <Text strong style={{ fontSize: '16px' }}>
                              {item.name}
                            </Text>
                          }
                        />
                      </div>

                      <Text
                        type="secondary"
                        style={{
                          fontSize: '14px',
                          marginBottom: '12px',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {item.description || '暂无描述'}
                      </Text>

                      <Divider style={{ margin: '8px 0' }} />

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Badge
                          count={status.text}
                          style={{
                            backgroundColor: status.color,
                            fontSize: '12px',
                          }}
                        />

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Tag color="blue" style={{ margin: 0 }}>
                            <ApiOutlined /> RESTful
                          </Tag>

                          <Tooltip title={`调用次数: ${item?.invokeCount || 0}`}>
                            <Tag icon={<FireOutlined />} color="volcano" style={{ margin: 0 }}>
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
              description={
                <span>
                  {searchName ? `没有找到与 "${searchName}" 相关的接口` : '暂无接口数据'}
                </span>
              }
              style={{ padding: '40px 0' }}
            />
          )}
        </Skeleton>
      </Card>
    </PageContainer>
  );
};

export default Index;
