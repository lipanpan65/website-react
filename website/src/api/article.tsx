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
  title: string;
  summary: string;
  content: string;
  enable: boolean;
  remark?: string;
}

interface ArticleRecordData {
  data: ArticleRecord[];
  page: Page;
}

export const articleApi = {
  fetch: (params: any): Promise<ApiResponse<ArticleRecordData>> =>
    request({ url: '/api/user/v1/article/', method: 'GET', params }),

  create: (data: Partial<ArticleRecord>): Promise<ApiResponse<ArticleRecord>> =>
    request({ url: '/api/user/v1/article/', method: 'POST', data }),

  update: (data: Partial<ArticleRecord>): Promise<ApiResponse<ArticleRecord>> =>
    request({ url: `/api/user/v1/article/${data.id}/`, method: 'PUT', data }),

  record: (id: number): Promise<ApiResponse<ArticleRecord>> =>
    request({ url: `/api/user/v1/article/${id}`, method: 'GET' }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request({ url: `/api/user/v1/article/${id}/`, method: 'DELETE' }),
};
