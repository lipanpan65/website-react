import { request } from '@/utils/request'
import { ApiResponse } from '@/types/core'

interface Page {
  total: number;
  current: number;
  pageSize: number;
}

// 全局字典数据类型
interface PermissionRecord {
  id: number;
  code: string;
  name: string;
  enable: boolean;
  remark?: string;
}

// 分页返回类型
interface RocleRecordData {
  data: PermissionRecord[];
  page: Page;
}

// 定义 API
export const permissionApi = {
  // 获取列表（带分页）
  fetch: (params?: any): Promise<ApiResponse<RocleRecordData>> =>
    request({ url: '/api/operator/v1/permission/', method: 'GET', params }),

  // 创建新的全局字典
  create: (data: Partial<PermissionRecord>): Promise<ApiResponse<PermissionRecord>> =>
    request({ url: '/api/operator/v1/permission/', method: 'POST', data }),

  // 更新全局字典
  update: (data: Partial<PermissionRecord>): Promise<ApiResponse<PermissionRecord>> =>
    request({ url: `/api/operator/v1/permission/${data.id}/`, method: 'PUT', data }),

  // 获取单条记录
  record: (id: number): Promise<ApiResponse<PermissionRecord>> =>
    request({ url: `/api/operator/v1/permission/${id}`, method: 'GET' }),

  // 删除全局字典
  delete: (id: number): Promise<ApiResponse<null>> =>
    request({ url: `/api/operator/v1/permission/${id}/`, method: 'DELETE' }),
};
