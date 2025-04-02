
export interface Pagination {
  total: number;
  current: number;
  pageSize: number;
}

// TableProps
export interface TableProps<T = any> {
  data?: {
    page: Pagination;
    data: T[]; // 泛型 T，适用于不同的数据结构
  };
  columns?: any; // 列配置
  onChange?: (pagination: Pagination, filters?: any, sorter?: any) => void;
}

// State
export interface State<T = any, P = Record<string, any>> {
  loading: boolean;
  open: boolean;
  record: T;
  page: Pagination;
  data: T[];
  params: P;
}

// 可以使用继续继承
// interface ServerPaginationProps extends PaginationProps {
//   totalPages: number;
// }

// export type PaginationProps = {
//   total: number;
//   current: number;
//   pageSize: number;
// };

// type ExtendedPagination = PaginationProps & { totalPages: number };

// type PaginationOrString = PaginationProps | string;
