import React from 'react';
import { Table } from 'antd';
import { TableProps as AntdTableProps } from 'antd/lib/table';

interface PaginationProps {
  total: number;
  current: number;
  pageSize: number;
}

interface AppTableProps<T> extends Omit<AntdTableProps<T>, 'dataSource' | 'columns'> {
  data: {
    page: PaginationProps;
    data: T[];
  };
  columns: AntdTableProps<T>['columns'];
  loading: boolean;
  rowKey?: string | keyof T | ((record: T) => string | number); // 修改 rowKey 类型
}

const AppTable = <T extends { id?: string | number }>({
  data: { page, data },
  columns,
  onChange,
  loading,
  rowKey = (record) => record?.id ?? `row-${Math.random()}`, // 修改为不使用 index
}: AppTableProps<T>) => {

  // 分页参数
  const pagination = {
    total: page?.total || 0,
    current: page?.current || 1,
    pageSize: page?.pageSize || 5,
    showTotal: (total: number) => `总共 ${total} 条数据`,
  };


  React.useEffect(() => {
    if (data.length > pagination.pageSize && data.length < pagination.total) {
      console.warn("数据长度和分页配置可能不一致", data.length, pagination);
    }
  }, [data, pagination]);

  return (
    <Table<T>
      loading={loading}
      onChange={onChange}
      pagination={pagination}
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
    />
  );
};

export default AppTable;
