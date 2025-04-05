import { getCookie } from '@/utils';

export const useAuth = () => {
  const csrfToken = getCookie('csrftoken');
  const authToken = getCookie('token');
  const sessionId = getCookie('sessionid');
  const userName = getCookie('username');
  const userRole = getCookie('user_role') === '1' ? 'admin' : getCookie('user_role');
  const userInfo = getCookie('user_info');
  const userInfoObj = userInfo ? JSON.parse(userInfo) : {};
  return {
    csrfToken,
    authToken,
    sessionId,
    userName,
    userRole,
    userInfo,
    userInfoObj,
    isAuthenticated: !!(csrfToken && authToken)
  };
}; 