import { request } from '@/utils/request'

interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

interface Page {
  total: number;
  current: number;
  pageSize: number;
}

// 全局字典数据类型
interface GlobalDict {
  id: number;
  cname: string;
  ckey: string;
  cvalue: string;
  enable: boolean;
  remark?: string;
}

// 分页返回类型
interface GlobalDictData {
  data: GlobalDict[];
  page: Page;
}

// 定义 API
export const globalDictApi = {
  // 获取列表（带分页）
  fetch: (params: any): Promise<ApiResponse<GlobalDictData>> =>
    request({ url: '/api/operator/v1/global/', method: 'GET', params }),

  // 创建新的全局字典
  create: (data: Partial<GlobalDict>): Promise<ApiResponse<GlobalDict>> =>
    request({ url: '/api/operator/v1/global/', method: 'POST', data }),

  // 更新全局字典
  update: (data: Partial<GlobalDict>): Promise<ApiResponse<GlobalDict>> =>
    request({ url: `/api/operator/v1/global/${data.id}/`, method: 'PUT', data }),

  // 获取单条记录
  record: (id: number): Promise<ApiResponse<GlobalDict>> =>
    request({ url: `/api/operator/v1/global/${id}`, method: 'GET' }),

  // 删除全局字典
  delete: (id: number): Promise<ApiResponse<null>> =>
    request({ url: `/api/operator/v1/global/${id}/`, method: 'DELETE' }),
};
