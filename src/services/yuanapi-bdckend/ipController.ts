// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /ip/ban */
export async function banIps(body: API.BannIpRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/ip/ban', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /ip/get */
export async function getBannedIpById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBannedIpByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBannedIps>('/ip/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /ip/list */
export async function listInterfaceInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listInterfaceInfoParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListBannedIps>('/ip/list', {
    method: 'GET',
    params: {
      ...params,
      bannIpRequest: undefined,
      ...params['bannIpRequest'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /ip/list/page */
export async function listIpsByPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listIpsByPageParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageBannedIps>('/ip/list/page', {
    method: 'GET',
    params: {
      ...params,
      bannIpRequest: undefined,
      ...params['bannIpRequest'],
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /ip/unban */
export async function unBanIps(body: API.UnBannIpRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/ip/unban', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
