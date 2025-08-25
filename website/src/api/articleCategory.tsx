import { request } from '@/utils/request'
import { ApiResponse } from '@/types/core'


interface Page {
  total: number;
  current: number;
  pageSize: number;
}

// 全局字典数据类型
interface CategoryRecord {
  id: number;
  category_name: string;
  enable: boolean;
  remark?: string;
}

// 分页返回类型
interface CategoryRecordData {
  data: CategoryRecord[];
  page: Page;
}

export const articleCategoryApi = {
  fetch: (params: any): Promise<ApiResponse<CategoryRecordData>> =>
    request({ url: '/api/user/v1/article_category/', method: 'GET', params }),

  create: (data: Partial<CategoryRecord>): Promise<ApiResponse<CategoryRecord>> =>
    request({ url: '/api/user/v1/article_category/', method: 'POST', data }),

  update: (data: Partial<CategoryRecord>): Promise<ApiResponse<CategoryRecord>> =>
    request({ url: `/api/user/v1/article_category/${data.id}/`, method: 'PUT', data }),

  record: (id: number): Promise<ApiResponse<CategoryRecord>> =>
    request({ url: `/api/user/v1/article_category/${id}`, method: 'GET' }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request({ url: `/api/user/v1/article_category/${id}/`, method: 'DELETE' }),
};
