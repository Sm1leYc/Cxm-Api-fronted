declare namespace API {
  type ApiCallHistory = {
    id?: string;
    timestamp?: string;
    httpMethod?: string;
    requestPath?: string;
    requestHeaders?: string;
    interfaceName?: string;
    requestBody?: string;
    responseHeaders?: string;
    responseCode?: number;
    responseBody?: string;
    size?: number;
    clientIp?: string;
    userId?: number;
    interfaceId?: number;
    duration?: number;
    status?: string;
  };

  type ApiCallHistoryQuery = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: string;
    timestamp?: string;
    httpMethod?: string;
    interfaceName?: string;
    clientIp?: string;
    responseCode?: number;
    duration?: number;
    status?: string;
  };

  type ApiCallStatisticsVO = {
    time?: string;
    count?: number;
  };

  type BannedIps = {
    id?: number;
    ipAddress?: string;
    reason?: string;
    bannedAt?: string;
    bannedBy?: string;
  };

  type BannIpRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    ipAddress?: string;
    reason?: string;
  };

  type banUserParams = {
    userId: number;
    status: number;
  };

  type BaseResponseApiCallHistory = {
    code?: number;
    data?: ApiCallHistory;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseBannedIps = {
    code?: number;
    data?: BannedIps;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseFeedbackVO = {
    code?: number;
    data?: FeedbackVO;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseInteger = {
    code?: number;
    data?: number;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseInterfaceInfoVO = {
    code?: number;
    data?: InterfaceInfoVO;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseListApiCallStatisticsVO = {
    code?: number;
    data?: ApiCallStatisticsVO[];
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseListBannedIps = {
    code?: number;
    data?: BannedIps[];
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseListInterfaceInfo = {
    code?: number;
    data?: InterfaceInfo[];
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseListInterfacePerformanceInfoVO = {
    code?: number;
    data?: InterfacePerformanceInfoVO[];
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseLoginUserVO = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseLong = {
    code?: number;
    data?: number;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseObject = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponsePageApiCallHistory = {
    code?: number;
    data?: PageApiCallHistory;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponsePageBannedIps = {
    code?: number;
    data?: PageBannedIps;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponsePageFeedback = {
    code?: number;
    data?: PageFeedback;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponsePageInterfaceInfoVO = {
    code?: number;
    data?: PageInterfaceInfoVO;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponsePageUser = {
    code?: number;
    data?: PageUser;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponsePageUserVO = {
    code?: number;
    data?: PageUserVO;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseUser = {
    code?: number;
    data?: User;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
    costTime?: number;
    size?: number;
  };

  type deleteApiCallHistoryParams = {
    id: string;
  };

  type deleteFeedbackParams = {
    id: number;
  };

  type DeleteRequest = {
    id?: number;
  };

  type Feedback = {
    id?: number;
    userAccount?: string;
    contact?: string;
    feedbackType?: string;
    feedbackContent?: string;
    status?: 'Pending' | 'In Progress' | 'Resolved' | 'Ignored';
    createTime?: string;
  };

  type FeedbackInterfaceInfoRequest = {
    id?: number;
    contact?: string;
    feedbackType?: string;
    feedbackContent?: string;
  };

  type FeedbackVO = {
    id?: number;
    userAccount?: string;
    contact?: string;
    feedbackType?: string;
    feedbackContent?: string;
    status?: 'Pending' | 'In Progress' | 'Resolved' | 'Ignored';
    createTime?: string;
  };

  type getApiCallHistoryByIdParams = {
    id: string;
  };

  type getBannedIpByIdParams = {
    id: number;
  };

  type getFeedbackByIdParams = {
    id: number;
  };

  type getInterfaceInfoByIdParams = {
    id: number;
  };

  type getUserByIdParams = {
    id: number;
  };

  type getUserVOByIdParams = {
    id: number;
  };

  type IdRequest = {
    id?: number;
  };

  type InterfaceInfo = {
    id?: number;
    name?: string;
    description?: string;
    url?: string;
    requestHeader?: string;
    responseHeader?: string;
    remarkType?: string;
    remarkContent?: string;
    requestParamsRemark?: string;
    responseExample?: string;
    request?: string;
    client?: string;
    clientMethod?: string;
    responseParamsRemark?: string;
    host?: string;
    status?: number;
    invokeCount?: number;
    requiredPoints?: number;
    method?: string;
    userId?: number;
    documentationUrl?: string;
    type?: string;
    webserviceUrl?: string;
    webserviceMethod?: string;
    createTime?: string;
    updateTime?: string;
    isDelete?: number;
    cacheEnabled?: boolean;
    cacheDuration?: number;
  };

  type InterfaceInfoAddRequest = {
    name?: string;
    description?: string;
    url?: string;
    request?: string;
    client?: string;
    clientMethod?: string;
    remarkType?: string;
    remarkContent?: string;
    responseRemark?: string;
    requestParamsRemark?: RequestParamsRemarkVO[];
    responseParamsRemark?: ResponseParamsRemarkVO[];
    requestHeader?: string;
    responseHeader?: string;
    method?: string;
    host?: string;
    documentationUrl?: string;
    requiredPoints?: number;
    type?: string;
    webserviceUrl?: string;
    webserviceMethod?: string;
    cacheEnabled?: boolean;
    cacheDuration?: number;
  };

  type InterfaceInfoInvokeRequest = {
    id?: number;
    userRequestParams?: Record<string, any>;
    url?: string;
    host?: string;
    method?: string;
    name?: string;
    autoRetry?: boolean;
    connectTimeout?: number;
    readTimeout?: number;
  };

  type InterfaceInfoQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    id?: number;
    name?: string;
    description?: string;
    url?: string;
    requestHeader?: string;
    responseHeader?: string;
    request?: string;
    client?: string;
    clientMethod?: string;
    requestParamsRemark?: RequestParamsRemarkVO[];
    responseParamsRemark?: ResponseParamsRemarkVO[];
    requestParams?: string;
    status?: number;
    method?: string;
    userId?: number;
    cacheEnabled?: boolean;
    cacheDuration?: number;
  };

  type InterfaceInfoUpdateRequest = {
    id?: number;
    name?: string;
    description?: string;
    url?: string;
    requestHeader?: string;
    host?: string;
    request?: string;
    client?: string;
    clientMethod?: string;
    remarkType?: string;
    remarkContent?: string;
    responseExample?: string;
    requestParamsRemark?: RequestParamsRemarkVO[];
    responseParamsRemark?: ResponseParamsRemarkVO[];
    responseHeader?: string;
    status?: number;
    documentationUrl?: string;
    method?: string;
    requestParams?: string;
    userId?: number;
    requiredPoints?: number;
    type?: string;
    webserviceUrl?: string;
    webserviceMethod?: string;
    cacheEnabled?: boolean;
    cacheDuration?: number;
  };

  type InterfaceInfoVO = {
    id?: number;
    name?: string;
    description?: string;
    host?: string;
    url?: string;
    request?: string;
    client?: string;
    invokeCount?: number;
    requiredPoints?: number;
    clientMethod?: string;
    requestHeader?: string;
    responseHeader?: string;
    remarkType?: string;
    remarkContent?: string;
    status?: number;
    documentationUrl?: string;
    method?: string;
    totalNum?: number;
    exampleCode?: string;
    type?: string;
    webserviceUrl?: string;
    webserviceMethod?: string;
    createTime?: string;
    cacheEnabled?: boolean;
    cacheDuration?: number;
    requestParamsRemark?: RequestParamsRemarkVO[];
    responseParamsRemark?: ResponseParamsRemarkVO[];
    responseExample?: string;
  };

  type InterfacePerformanceInfoVO = {
    interfaceName?: string;
    avgTime?: number;
    errorPer?: number;
  };

  type listFeedbackRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type listInterfaceInfo1Params = {
    interfaceInfoQueryRequest: InterfaceInfoQueryRequest;
  };

  type listInterfaceInfoAdminParams = {
    interfaceInfoQueryRequest: InterfaceInfoQueryRequest;
  };

  type listInterfaceInfoByPageParams = {
    interfaceInfoQueryRequest: InterfaceInfoQueryRequest;
  };

  type listInterfaceInfoParams = {
    bannIpRequest: BannIpRequest;
  };

  type listIpsByPageParams = {
    bannIpRequest: BannIpRequest;
  };

  type LoggingStatusRequest = {
    userId?: number;
    loggingEnabled?: boolean;
  };

  type LoginUserVO = {
    id?: number;
    userName?: string;
    userAccount?: string;
    userAvatar?: string;
    userRole?: string;
    createTime?: string;
    loggingEnabled?: number;
    updateTime?: string;
    lastLoginTime?: string;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PageApiCallHistory = {
    records?: ApiCallHistory[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: boolean;
    searchCount?: boolean;
    optimizeJoinOfCountSql?: boolean;
    countId?: string;
    maxLimit?: number;
    pages?: number;
  };

  type PageBannedIps = {
    records?: BannedIps[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: boolean;
    searchCount?: boolean;
    optimizeJoinOfCountSql?: boolean;
    countId?: string;
    maxLimit?: number;
    pages?: number;
  };

  type PageFeedback = {
    records?: Feedback[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: boolean;
    searchCount?: boolean;
    optimizeJoinOfCountSql?: boolean;
    countId?: string;
    maxLimit?: number;
    pages?: number;
  };

  type PageInterfaceInfoVO = {
    records?: InterfaceInfoVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: boolean;
    searchCount?: boolean;
    optimizeJoinOfCountSql?: boolean;
    countId?: string;
    maxLimit?: number;
    pages?: number;
  };

  type PageUser = {
    records?: User[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: boolean;
    searchCount?: boolean;
    optimizeJoinOfCountSql?: boolean;
    countId?: string;
    maxLimit?: number;
    pages?: number;
  };

  type PageUserVO = {
    records?: UserVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: boolean;
    searchCount?: boolean;
    optimizeJoinOfCountSql?: boolean;
    countId?: string;
    maxLimit?: number;
    pages?: number;
  };

  type RequestParamsRemarkVO = {
    id?: number;
    name?: string;
    isRequired?: string;
    type?: string;
    remark?: string;
    defaultValue?: string;
  };

  type ResponseParamsRemarkVO = {
    id?: number;
    name?: string;
    type?: string;
    remark?: string;
  };

  type signInParams = {
    userId: number;
  };

  type UnBannIpRequest = {
    id?: number;
  };

  type updateFeedbackRequest = {
    id?: number;
    feedbackStatusEnum?: 'Pending' | 'In Progress' | 'Resolved' | 'Ignored';
  };

  type updateSkParams = {
    userId: number;
  };

  type User = {
    id?: number;
    userAccount?: string;
    userPassword?: string;
    userName?: string;
    userAvatar?: string;
    email?: string;
    userRole?: string;
    loginFailCount?: number;
    accessKey?: string;
    secretKey?: string;
    createTime?: string;
    updateTime?: string;
    lastLoginTime?: string;
    lastSignIn?: string;
    points?: number;
    loggingEnabled?: number;
    status?: number;
  };

  type UserAddRequest = {
    userName?: string;
    userAccount?: string;
    userAvatar?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    id?: number;
    userName?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    userName?: string;
    userAccount?: string;
    userPassword?: string;
    checkPassword?: string;
  };

  type UserUpdateMyRequest = {
    userName?: string;
    userAvatar?: string;
  };

  type UserUpdatePwdRequest = {
    userPassword?: string;
    checkUserPassword?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    userAccount?: string;
    userName?: string;
    userAvatar?: string;
    userRole?: string;
    accessKey?: string;
    secretKey?: string;
    points?: number;
    status?: number;
  };

  type UserVO = {
    id?: number;
    userName?: string;
    userAccount?: string;
    userAvatar?: string;
    userRole?: string;
    accessKey?: string;
    secretKey?: string;
    email?: string;
    points?: number;
    status?: number;
    loggingEnabled?: number;
    createTime?: string;
    lastLoginTime?: string;
  };
}
