// 枚举类型定义
enum ErrorCode {
  SUCCESS = 0,
  PARAMS_ERROR = 40000,
  NOT_LOGIN_ERROR = 40100,
  NO_AUTH_ERROR = 40101,
  NOT_FOUND_ERROR = 40400,
  FORBIDDEN_ERROR = 40300,
  SYSTEM_ERROR = 50000,
  OPERATION_ERROR = 50001,
}


// 错误码和错误信息对象
const errorMessages = {
  [ErrorCode.SUCCESS]: "ok",
  [ErrorCode.PARAMS_ERROR]: "请求参数错误",
  [ErrorCode.NOT_LOGIN_ERROR]: "未登录",
  [ErrorCode.NO_AUTH_ERROR]: "无权限",
  [ErrorCode.NOT_FOUND_ERROR]: "请求数据不存在",
  [ErrorCode.FORBIDDEN_ERROR]: "禁止访问",
  [ErrorCode.SYSTEM_ERROR]: "系统内部异常",
  [ErrorCode.OPERATION_ERROR]: "操作失败",
};

export const errorCode = [
  // {
  //   code: 0,
  //   name: 'SUCCESS',
  //   des: 'ok',
  // },

  {
    code: 403,
    name: 'ERROR_FORBIDDEN',
    des: '禁止访问',
  },

  {
    code: 500,
    name: 'ERROR_INTERNAL_SERVER',
    des: '服务器内部错误',
  },
  {
    code: 502,
    name: 'ERROR_BAD_GATEWAY',
    des: '网关错误或代理错误',
  },
  {
    code: 503,
    name: 'ERROR_SERVICE_UNAVAILABLE',
    des: '接口服务不可用',
  },

  {
    code: 1001,
    name: 'ERROR_INVALID_API_KEY',
    des: 'API密钥无效',
  },

  {
    code: 2002,
    name: 'ERROR_INVALID_PARAMETER',
    des: '参数无效（包括值无效和类型错误）',
  },

  {
    code: 3001,
    name: 'ERROR_NETWORK',
    des: '网络错误或请求超时',
  },
  {
    code: 3002,
    name: 'ERROR_RATE_LIMIT',
    des: '超过速率限制',
  },
  {
    code: 3003,
    name: 'UPLOAD_ERROR',
    des: '上传文件异常',
  },
  {
    code: 3004,
    name: 'DEDUCE_POINT_ERROR',
    des: '扣除积分发生异常',
  },
];

export {ErrorCode, errorMessages};
