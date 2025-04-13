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
    name: 'FORBIDDEN_ERROR',
    des: '禁止访问',
  },

  {
    code: 429,
    name: 'TOO_MANY_REQUEST',
    des: '请求过于频繁',
  },

  {
    code: 500,
    name: 'INTERNAL_SERVER_ERROR',
    des: '系统内部异常',
  },
  {
    code: 502,
    name: 'BAD_GATEWAY_ERROR',
    des: '网关错误或代理错误',
  },

  {
    code: 1001,
    name: 'INVALID_API_KEY',
    des: 'API密钥无效',
  },

  {
    code: 1003,
    name: 'SIGNATURE_ERROR',
    des: '签名认证失败',
  },

  {
    code: 1004,
    name: 'SERVICE_UNAVAILABLE',
    des: '接口服务不可用',
  },

  {
    code: 2001,
    name: 'INVALID_PARAMETER',
    des: '参数无效（包括值无效和类型错误）',
  },

  {
    code: 3004,
    name: 'DEDUCE_POINT_ERROR',
    des: '扣除积分失败',
  },

  {
    code: 4001,
    name: 'SDK_INVOKE_ERROR',
    des: 'SDK调用失败',
  },
];

export {ErrorCode, errorMessages};
