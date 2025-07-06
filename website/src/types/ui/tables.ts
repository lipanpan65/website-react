/**
 * 表格列定义
 */
export interface TableColumn<T = any> {
    key: keyof T | string;
    title: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    render?: (value: any, record: T, index: number) => React.ReactNode;
    className?: string;
  }
  
  /**
   * 表格组件属性
   */
  export interface TableProps<T = any> {
    data: T[];
    columns: TableColumn<T>[];
    loading?: boolean;
    rowKey?: keyof T | ((record: T) => string);
    pagination?: {
      current: number;
      pageSize: number;
      total: number;
      onChange: (page: number, pageSize: number) => void;
    };
    onRowClick?: (record: T, index: number) => void;
    className?: string;
  }