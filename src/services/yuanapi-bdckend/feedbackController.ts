// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /feedback/add */
export async function feedbackInterfaceInfo(
  body: API.FeedbackInterfaceInfoRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/feedback/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /feedback/delete */
export async function deleteFeedback(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFeedbackParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/feedback/delete', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /feedback/get */
export async function getFeedbackById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFeedbackByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseFeedbackVO>('/feedback/get', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /feedback/list/page */
export async function listFeedbackByPage(
  body: API.listFeedbackRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageFeedback>('/feedback/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /feedback/update */
export async function updateFeedback(
  body: API.updateFeedbackRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/feedback/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
