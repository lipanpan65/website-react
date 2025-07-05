
export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export type BaseStatus = 'active' | 'inactive' | 'pending' | 'deleted';


export interface BasePaginationParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface BasePaginationResponse<T> {
    data: T[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }