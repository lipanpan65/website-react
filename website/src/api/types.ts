import { request } from '@/utils/request'

export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface Page {
  total: number;
  current: number;
  pageSize: number;
}

export interface BaseRecord {
  id: number;
  enable: boolean;
  remark?: string;
}

export interface BaseData<T> {
  data: T[];
  page: Page;
}

export interface BaseApiOptions {
  baseUrl: string;
  version: string;
  module: string;
}

export const createBaseApi = (options: BaseApiOptions) => {
  const { baseUrl, version, module } = options;
  const basePath = `${baseUrl}/${version}/${module}`;

  return {
    fetch: <T>(params?: any): Promise<ApiResponse<T>> =>
      request({ url: basePath, method: 'GET', params }),

    create: <T extends BaseRecord>(data: Partial<T>): Promise<ApiResponse<T>> =>
      request({ url: basePath, method: 'POST', data }),

    update: <T extends BaseRecord>(data: Partial<T>): Promise<ApiResponse<T>> =>
      request({ url: `${basePath}/${data.id}/`, method: 'PUT', data }),

    record: <T>(id: number): Promise<ApiResponse<T>> =>
      request({ url: `${basePath}/${id}`, method: 'GET' }),

    delete: (id: number): Promise<ApiResponse<null>> =>
      request({ url: `${basePath}/${id}/`, method: 'DELETE' }),
  };
}; 