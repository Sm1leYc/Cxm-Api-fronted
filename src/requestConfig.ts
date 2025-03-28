import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import {AxiosRequestConfig} from "axios";

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  // baseURL:"https://gateway.ymcapi.xyz/backend",
  // baseURL:"http://localhost:8101/",
  baseURL:"http://localhost:8089/backend/",
  withCredentials: true,

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 获取请求的URL
      const { config, data } = response as unknown as { config: AxiosRequestConfig, data: ResponseStructure };

      // 检查URL是否为invokeInterfaceInfoUsingPost，如果是则不拦截
      if (config.url && config.url.includes('invoke')) {
        return response;
      }

      // 拦截error异常
      // if (data.code !== 0) {
      //   message.error(data.message).then(r => {});
      // }

      return response;
    },
  ],


};
