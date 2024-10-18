import React from 'react';
import { Table } from 'antd';

interface PaginationProps {
    total: number;
    current: number;
    pageSize: number;
}

interface AppTableProps {
    data: {
        page: PaginationProps;
        data: any[]; // 数据数组，可以根据具体需求设置类型
    };
    columns: any[]; // 列定义，可以根据需要定义更具体的类型
    onChange: (pagination: any, filters: any, sorter: any) => void;
    loading: boolean;
    rowKey?: (record: any) => string | number;  // 可选的 rowKey 参数
}

const AppTable: React.FC<AppTableProps> = ({
    data: { page, data },
    columns,
    onChange,
    loading,
    rowKey = (record) => record.id, // 默认使用 record.id 作为 rowKey
}) => {
    // 分页参数
    const pagination = {
        total: page?.total || 0, // 数据总数
        current: page?.current || 1, // 当前页码
        pageSize: page?.pageSize || 5, // 每页显示条数
        showTotal: (total: number) => `总共 ${total} 条数据`, // 自定义显示总数的格式
    };
    
    return (
        <React.Fragment>
            <Table
                loading={loading}
                onChange={onChange}
                pagination={pagination}
                columns={columns}
                dataSource={data}
                rowKey={rowKey}  // 使用传递的 rowKey 或默认的 record.id
            />
        </React.Fragment>
    );
};

export default AppTable;

