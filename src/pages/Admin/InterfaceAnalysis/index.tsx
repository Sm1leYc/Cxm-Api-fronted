import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { listInterfacePerformanceInfo } from "@/services/yuanapi-bdckend/analysisController";

/**
 * 接口分析
 * @constructor
 */
const InterfaceAnalysis: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<API.InterfacePerformanceInfoVO[]>();

  useEffect(() => {
    // 获取接口的平均耗时时间和错误率数据
    try {
      listInterfacePerformanceInfo().then((res) => {
        if (res.data) {
          setPerformanceData(res.data);
        }
      });
    } catch (e: any) {
      console.error(e);
    }


  }, []);


  // 映射数据
  const avgTimeData = performanceData?.map((item) => ({
    value: item.avgTime,
    name: item.interfaceName,
  }));

  const errorRateData = performanceData?.map((item) => ({
    value: item.errorPer,
    name: item.interfaceName,
  }));

  const performanceOption = {
    title: [
      {
        text: '接口平均耗时时间',
        left: 'center',
        top: '5%',
      },
      {
        text: '接口错误率',
        left: 'center',
        top: '50%',
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: [
      { top: '10%', height: '35%' },
      { top: '55%', height: '35%' },
    ],
    xAxis: [
      {
        type: 'category',
        data: performanceData?.map((item) => item.interfaceName),
        gridIndex: 0,
      },
      {
        type: 'category',
        data: performanceData?.map((item) => item.interfaceName),
        gridIndex: 1,
      },
    ],
    yAxis: [
      { type: 'value', gridIndex: 0, name: '平均耗时 (ms)' },
      { type: 'value', gridIndex: 1, name: '错误率 (%)' },
    ],
    series: [
      {
        name: '平均耗时',
        type: 'bar',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: avgTimeData,
        itemStyle: {
          color: '#5470c6',
        },
      },
      {
        name: '错误率',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: errorRateData,
        itemStyle: {
          color: '#91cc75',
        },
      },
    ],
  };

  return (
    <PageContainer>
      <div style={{ width: '100%', height: '800px' }}>
        <ReactECharts option={performanceOption} style={{ height: '60%' }} />
      </div>
    </PageContainer>
  );
};


export default InterfaceAnalysis;
