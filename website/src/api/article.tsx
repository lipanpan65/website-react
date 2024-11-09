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

interface ArticleRecord {
  id: number;
  cname: string;
  ckey: string;
  cvalue: string;
  enable: boolean;
  remark?: string;
}

interface ArticleRecordData {
  data: ArticleRecord[];
  page: Page;
}

// 定义 API
export const articleApi = {
  fetch: (params: any): Promise<ApiResponse<ArticleRecordData>> =>
    request({ url: '/api/operator/v1/role/', method: 'GET', params }),

  create: (data: Partial<ArticleRecord>): Promise<ApiResponse<ArticleRecord>> =>
    request({ url: '/api/operator/v1/role/', method: 'POST', data }),

  update: (data: Partial<ArticleRecord>): Promise<ApiResponse<ArticleRecord>> =>
    request({ url: `/api/operator/v1/role/${data.id}/`, method: 'PUT', data }),

  record: (id: number): Promise<ApiResponse<ArticleRecord>> =>
    request({ url: `/api/operator/v1/role/${id}`, method: 'GET' }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request({ url: `/api/operator/v1/role/${id}/`, method: 'DELETE' }),
};
