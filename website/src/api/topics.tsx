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

interface TopicRecord {
  id: number;
  title: string;
  summary: string;
  content: string;
  enable: boolean;
  remark?: string;
}

interface TopicRecordData {
  data: TopicRecord[];
  page: Page;
}

export const topicApi = {
  fetch: (params: any): Promise<ApiResponse<TopicRecordData>> =>
    request({ url: '/api/v1/topics/', method: 'GET', params }),

  create: (data: Partial<TopicRecord>): Promise<ApiResponse<TopicRecord>> =>
    request({ url: '/api/v1/topics/', method: 'POST', data }),

  update: (data: Partial<TopicRecord>): Promise<ApiResponse<TopicRecord>> =>
    request({ url: `/api/v1/topics/${data.id}/`, method: 'PUT', data }),

  record: (id: number): Promise<ApiResponse<TopicRecord>> =>
    request({ url: `/api/v1/topics/${id}`, method: 'GET' }),

  delete: (id: number): Promise<ApiResponse<null>> =>
    request({ url: `/api/v1/topics/${id}/`, method: 'DELETE' }),
};
