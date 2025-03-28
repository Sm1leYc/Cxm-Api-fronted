// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /apiCallHistory/delete */
export async function deleteApiCallHistory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteApiCallHistoryParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/apiCallHistory/delete', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /apiCallHistory/get */
export async function getApiCallHistoryById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getApiCallHistoryByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseApiCallHistory>('/apiCallHistory/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /apiCallHistory/list/page */
export async function listApiCallHistory(
  body: API.ApiCallHistoryQuery,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageApiCallHistory>('/apiCallHistory/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /apiCallHistory/updateLoggingStatus */
export async function updateLoggingStatus(
  body: API.LoggingStatusRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/apiCallHistory/updateLoggingStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
