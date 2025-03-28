import { Link } from '@@/exports';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { theme, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  ThunderboltFilled,
  ApiFilled,
  SafetyCertificateFilled,
  ToolFilled,
  CodeFilled
} from '@ant-design/icons';
import { getApiCallCount } from '@/services/yuanapi-bdckend/interfaceInfoController';
import ReactECharts from 'echarts-for-react';
import {getWeeklyApiCalls} from "@/services/yuanapi-bdckend/analysisController";

const { Text, Title } = Typography;

const iconMap = {
  1: <CodeFilled style={{ fontSize: 20 }} />,
  2: <ToolFilled style={{ fontSize: 20 }} />,
  3: <ApiFilled style={{ fontSize: 20 }} />,
  4: <ThunderboltFilled style={{ fontSize: 20 }} />,
  5: <SafetyCertificateFilled style={{ fontSize: 20 }} />,
};

const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
}> = ({ title, index, desc }) => {
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: `rgba(${token.colorBgContainer.split(')')[0]}, 0.8)`,
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        border: `1px solid ${token.colorBorderSecondary}`,
        padding: 20,
        width: '100%',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '8px',
            background: token.colorPrimaryBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: token.colorPrimary,
            flexShrink: 0
          }}
        >
          {iconMap[index]}
        </div>
        <div style={{
          fontSize: 16,
          fontWeight: 600,
          color: token.colorTextHeading,
          flex: 1,
          minWidth: 'calc(100% - 52px)'
        }}>
          {title}
        </div>
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 14,
          lineHeight: 1.6,
          color: token.colorTextSecondary,
        }}
      >
        {desc}
      </div>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const [apiCallCount, setApiCallCount] = useState<number>(0);
  const [weeklyApiCalls, setWeeklyApiCalls] = useState<API.ApiCallStatisticsVO[]>([]);

  useEffect(() => {
    const fetchApiCallCount = async () => {
      try {
        const res = await getApiCallCount();
        setApiCallCount(res.data);
      } catch (error) {
        console.error('Failed to fetch API call count:', error);
      }
    };

    const fetchWeeklyApiCalls = async () => {
      try {
        const res = await getWeeklyApiCalls();
        if (res.code === 0 && res.data) {
          setWeeklyApiCalls(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch weekly API calls:', error);
      }
    };

    fetchApiCallCount();
    fetchWeeklyApiCalls();
  }, []);

  // ECharts 配置
  const apiCountOption = () => ({
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: weeklyApiCalls.map((item) => item.time), // X轴数据
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        name: '请求调用次数',
        type: 'line',
        data: weeklyApiCalls.map((item) => item.count), // Y轴数据
        smooth: true, // 平滑曲线
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#1890ff',
        },
      },
    ],
  });

  // 图表组件
  const ApiCallsChart = () => {
    return (
      <div
        style={{
          backdropFilter: 'blur(8px)',
          borderRadius: '16px',
          border: `1px solid ${token.colorBorderSecondary}`,
          padding: 20,
          marginTop: 24,
          marginBottom: 32,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              background: token.colorPrimaryBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: token.colorPrimary,
              marginRight: 12
            }}
          >
            <CodeFilled style={{ fontSize: 20 }} />
          </div>
          <div style={{
            fontSize: 18,
            fontWeight: 600,
            color: token.colorTextHeading,
          }}>
            过去7天接口调用趋势
          </div>
        </div>

        <div style={{ height: 300 }}>
          {weeklyApiCalls.length > 0 && (
            <ReactECharts
              option={apiCountOption()}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <PageContainer>
      <div
        style={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
          borderRadius: 24,
          overflow: 'hidden',
          position: 'relative',
          padding: 24,
          '@media (max-width: 575px)': {
            padding: 16,
            borderRadius: 16
          }
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -100,
            top: -100,
            width: 400,
            height: 400,
            background: `radial-gradient(${token.colorPrimary} 10%, transparent 70%)`,
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -100,
            bottom: -100,
            width: 400,
            height: 400,
            background: `radial-gradient(${token.colorInfo} 10%, transparent 70%)`,
            opacity: 0.1,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            '@media (max-width: 575px)': {
              maxWidth: '100%'
            }
          }}>
            <Title
              level={2}
              style={{ color: token.colorTextHeading }}
            >
              欢迎使用 Cxm-API 接口开放平台
            </Title>

            <Text strong>
              <Title level={4} style={{ marginTop: 16 }}>
                Cxm-API 接口开放平台是一个为用户和开发者提供全面 API 接口调用服务的平台 🛠
              </Title>
              <div style={{ fontSize: '16px', lineHeight: '26px', marginTop: 16 }}>
                <span style={{ color: token.colorPrimary }}>😀 用户功能：</span> 作为用户您可以通过注册登录账户，获取接口调用权限，通过
                <Link to="/profile">签到</Link>
                获取每日免费积分，并根据自己的需求浏览和选择适合的接口。您可以在线进行接口调试，快速验证接口的功能和效果。
                <br />

                <span style={{ color: token.colorPrimary }}>💻 开发者支持：</span> 作为开发者，我们提供了
                <a href="https://gitee.com/Ymcc1/cxm-api-sdk" target="_blank" rel="noreferrer">
                  客户端 SDK
                </a>
                ，通过
                <Link to="/profile">开发者凭证</Link>
                即可将轻松集成接口到您的 Java 项目中，实现更高效的开发和调用。
                <br />
                <span style={{ color: token.colorPrimary }}>📊 调用追踪：</span> 您可以在
                <Link to="/apiCallHistory">API调用历史</Link>
                页面打开记录日志功能，查看更加具体的调用详情。
                <br />
                <span style={{ color: token.colorPrimary }}>📚 文档支持：</span> 我们还提供了
                <a href="http://doc.ymcapi.xyz/" target="_blank" rel="noreferrer">
                  开发者在线文档
                </a>
                和技术支持，帮助您快速接入和发布接口。
                <br />
              </div>
            </Text>

            <div
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                padding: '16px 24px',
                background: `rgba(${token.colorPrimaryBg.split(')')[0]}, 0.2)`,
                borderRadius: 12,
                marginBottom: 40,
                marginTop: '24px',
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: token.colorPrimaryBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: token.colorPrimary,
              }}>
                <ThunderboltFilled style={{ fontSize: 24 }} />
              </div>
              <div>
                <div style={{
                  fontSize: 14,
                  color: token.colorTextSecondary,
                  marginBottom: 4
                }}>
                  API累计调用次数
                </div>
                <div style={{
                  fontSize: 32,
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${token.colorPrimary} 30%, ${token.colorInfo} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {apiCallCount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 添加API调用趋势图表 */}
            <ApiCallsChart />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16,
                marginTop: 24,
                '@media (max-width: 575px)': {
                  gridTemplateColumns: '1fr',
                  gap: 12,
                  padding: '0 8px'
                }
              }}
            >
              <InfoCard
                index={1}
                title="客户端SDK支持"
                desc="简单几行代码即可集成API服务到您的Java应用"
              />
              <InfoCard
                index={2}
                title="开发者文档支持"
                desc="详细文档和技术支持助力快速接入"
              />
              <InfoCard
                index={3}
                title="在线调试"
                desc="直观控制台实现无配置测试与调用"
              />
              <InfoCard
                index={4}
                title="多样接口"
                desc="覆盖多领域的丰富接口选择"
              />
              <InfoCard
                index={5}
                title="安全稳定"
                desc="HTTPS加密保障数据安全"
              />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Welcome;
