export interface ApiResponse<T = any> {
  code?: number;
  message?: string;
  data: T;
  success?: boolean;
  timestamp?: string;
}

export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, any>;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}