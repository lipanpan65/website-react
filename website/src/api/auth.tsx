import { request } from '@/utils/request'

interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

// 全局字典数据类型
interface AuthRecord {
  username: string;
  password: string;
}

export const authApi = {

  login: (data: Partial<AuthRecord>): Promise<ApiResponse<AuthRecord>> =>
    request({ url: '/api/operator/v1/authentication/login/', method: 'POST', data }),

  logout: (data?: any): Promise<ApiResponse<AuthRecord>> =>
    request({ url: '/api/operator/v1/authentication/logout/', method: 'POST', data }),
};