import { getCookie } from '@/utils';


// 存在多次渲染问题
export const useAuth = () => {
  const csrfToken = getCookie('csrftoken');
  const authToken = getCookie('token');
  const sessionId = getCookie('sessionid');
  const user = getCookie('user');

  let userInfo: any = {};
  try {
    if (user) {
      // 先替换转义的逗号
      const cleanUser = user.replace(/\\054/g, ',');
      // 然后解析 JSON
      userInfo = JSON.parse(cleanUser);
      userInfo = JSON.parse(userInfo);
    }
  } catch (error) {
    console.error('Failed to parse user cookie:', error);
  }

  // 直接从 userInfo 中获取值
  const name = userInfo?.name || '';
  const username = userInfo?.username || '';
  const userRole = userInfo?.role || '';
  const permissions = userInfo?.permissions || [];

  console.log("permissions", permissions)
  return {
    csrfToken,
    authToken,
    sessionId,
    isAuthenticated: !!(csrfToken && authToken),
    userInfo,
    name,
    username,
    userRole,
    permissions,
  };
}; 