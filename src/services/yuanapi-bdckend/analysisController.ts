// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /analysis/performance */
export async function listInterfacePerformanceInfo(options?: { [key: string]: any }) {
  return request<API.BaseResponseListInterfacePerformanceInfoVO>('/analysis/performance', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /analysis/weeklyApiCalls */
export async function getWeeklyApiCalls(options?: { [key: string]: any }) {
  return request<API.BaseResponseListApiCallStatisticsVO>('/analysis/weeklyApiCalls', {
    method: 'GET',
    ...(options || {}),
  });
}
