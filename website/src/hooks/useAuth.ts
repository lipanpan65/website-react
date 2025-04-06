import { getCookie } from '@/utils';


// 存在多次渲染问题
export const useAuth = () => {
  const csrfToken = getCookie('csrftoken');
  const authToken = getCookie('token');
  const sessionId = getCookie('sessionid');
  const user = getCookie('user');
  console.log("Raw user cookie:", user); // 添加这行来查看原始 cookie 值

  console.log("Raw user cookie:", user);

  let userInfo: any = {};
  try {
    if (user) {
      // 先替换转义的逗号
      const cleanUser = user.replace(/\\054/g, ',');
      console.log("After cleaning:", cleanUser);

      // 然后解析 JSON
      userInfo = JSON.parse(cleanUser);
      console.log("Parsed userInfo:", userInfo);
      console.log("type of userInfo:", typeof userInfo); // 打印类型 string
      userInfo = JSON.parse(userInfo);
      console.log("type of userInfo:", typeof userInfo); // 打印类型 


      console.log("userInfo===>", userInfo)
      console.log("userInfo.name:", userInfo.name);
      console.log("userInfo.username:", userInfo.username);
      console.log("userInfo.role:", userInfo.role);
    }
  } catch (error) {
    console.error('Failed to parse user cookie:', error);
  }

  // 直接从 userInfo 中获取值
  const name = userInfo?.name || '';
  const username = userInfo?.username || '';
  const userRole = userInfo?.role || '';

  console.log("Final values:", { name, username, userRole });


  return {
    csrfToken,
    authToken,
    sessionId,
    isAuthenticated: !!(csrfToken && authToken),
    userInfo,
    name,
    username,
    userRole,
  };
}; 