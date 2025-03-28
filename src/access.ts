/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: InitialState | undefined) {
  const { loginUser } = initialState ?? {};
  return {
    // 用户是否已经登录
    canUser: loginUser,
    // 用户是否是管理员
    canAdmin: loginUser?.userRole === '管理员',
  };
}
