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

  fetch: (params: any): Promise<ApiResponse<AuthRecord>> =>
    request({ url: '/api/operator/v1/authentication/', method: 'GET', params }),

  create: (data: Partial<AuthRecord>): Promise<ApiResponse<AuthRecord>> =>
    request({ url: '/api/operator/v1/authentication/', method: 'POST', data }),

  // update: (data: Partial<AuthRecord>): Promise<ApiResponse<AuthRecord>> =>
  //   request({ url: `/api/user/v1/authentication/${data.id}/`, method: 'PUT', data }),

  // record: (id: number): Promise<ApiResponse<AuthRecord>> =>
  //   request({ url: `/api/user/v1/authentication/${id}`, method: 'GET' }),

  // delete: (id: number): Promise<ApiResponse<null>> =>
  //   request({ url: `/api/user/v1/authentication/${id}/`, method: 'DELETE' }),
};