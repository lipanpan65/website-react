import { request } from '@/utils/request'
import { ApiResponse } from '@/types/core'

interface Page {
  total: number;
  current: number;
  pageSize: number;
}

// 全局字典数据类型
interface RoleRecord {
  id: number;
  cname: string;
  ckey: string;
  cvalue: string;
  enable: boolean;
  remark?: string;
}

// 分页返回类型
interface RocleRecordData {
  data: RoleRecord[];
  page: Page;
}

// 定义 API
export const roleApi = {
  // 获取列表（带分页）
  fetch: (params?: any): Promise<ApiResponse<RocleRecordData>> =>
    request({ url: '/api/operator/v1/role/', method: 'GET', params }),

  // 创建新的全局字典
  create: (data: Partial<RoleRecord>): Promise<ApiResponse<RoleRecord>> =>
    request({ url: '/api/operator/v1/role/', method: 'POST', data }),

  // 更新全局字典
  update: (data: Partial<RoleRecord>): Promise<ApiResponse<RoleRecord>> =>
    request({ url: `/api/operator/v1/role/${data.id}/`, method: 'PUT', data }),

  // 获取单条记录
  record: (id: number): Promise<ApiResponse<RoleRecord>> =>
    request({ url: `/api/operator/v1/role/${id}`, method: 'GET' }),

  // 删除全局字典
  delete: (id: number): Promise<ApiResponse<null>> =>
    request({ url: `/api/operator/v1/role/${id}/`, method: 'DELETE' }),

  // 给角色授权
  grant: (data: Partial<RoleRecord>): Promise<ApiResponse<RoleRecord>> =>
    request({ url: `/api/operator/v1/role/${data.id}/grant/`, method: 'POST', data }),
};
