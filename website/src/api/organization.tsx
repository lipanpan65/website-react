import { request } from '@/utils/request'

interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}


// 定义 API
export const orgApi = {
  // 获取列表（带分页）
  fetch: (params: any): Promise<ApiResponse<any>> =>
    request({ url: '/api/operator/v1/role/', method: 'GET', params }),

  // 创建新的全局字典
  create: (data: Partial<any>): Promise<ApiResponse<any>> =>
    request({ url: '/api/operator/v1/role/', method: 'POST', data }),

  // 更新全局字典
  update: (data: Partial<any>): Promise<ApiResponse<any>> =>
    request({ url: `/api/operator/v1/role/${data.id}/`, method: 'PUT', data }),

  // 获取单条记录
  record: (id: number): Promise<ApiResponse<any>> =>
    request({ url: `/api/operator/v1/role/${id}`, method: 'GET' }),

  // 删除全局字典
  delete: (id: number): Promise<ApiResponse<null>> =>
    request({ url: `/api/operator/v1/role/${id}/`, method: 'DELETE' }),
};

