


```
import React from 'react';
import { TableProps, Space, Button, Tag, Tooltip, Typography } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  FileTextOutlined,
  TagOutlined
} from '@ant-design/icons';
import { dateFormate } from '@/utils';
import StatusTag from '@/components/StatusTag';
import ConfirmableButton from '@/components/ConfirmableButton';

const { Text, Paragraph } = Typography;

// ==================== 类型定义 ====================
interface ArticleDataType {
  id: number;
  status: 'draft' | 'publish';
  title: string;
  summary?: string;
  content?: string;
  html?: string;
  create_user?: string;
  update_user?: string;
  create_time: string;
  update_time: string;
  remark?: string;
  category_id?: number;
  category_name?: string;
  yn: number;
}

// ==================== 状态配置 ====================
const ARTICLE_STATUS_CONFIG = {
  draft: { 
    color: 'orange', 
    text: '草稿',
    icon: <FileTextOutlined />
  },
  publish: { 
    color: 'green', 
    text: '已发布',
    icon: <EyeOutlined />
  }
};

// ==================== 列配置 ====================
export const createArticleColumns = (
  onEdit: (record: ArticleDataType) => void,
  onDelete: (record: ArticleDataType) => void,
  onView?: (record: ArticleDataType) => void,
  onPreview?: (record: ArticleDataType) => void
): TableProps<ArticleDataType>['columns'] => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    align: 'center',
    sorter: true,
    fixed: 'left',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: 200,
    ellipsis: {
      showTitle: false,
    },
    render: (title: string, record: ArticleDataType) => (
      <Tooltip title={title || '无标题的文档'}>
        <Text 
          strong={record.status === 'publish'}
          style={{ 
            color: record.status === 'publish' ? '#1890ff' : '#666',
            cursor: onView ? 'pointer' : 'default'
          }}
          onClick={() => onView?.(record)}
        >
          {title || '无标题的文档'}
        </Text>
      </Tooltip>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
    filters: [
      { text: '草稿', value: 'draft' },
      { text: '已发布', value: 'publish' },
    ],
    render: (status: 'draft' | 'publish') => {
      const config = ARTICLE_STATUS_CONFIG[status];
      return (
        <Tag 
          color={config.color} 
          icon={config.icon}
        >
          {config.text}
        </Tag>
      );
    },
  },
  {
    title: '分类',
    dataIndex: 'category_name',
    key: 'category_name',
    width: 120,
    render: (categoryName: string) => (
      categoryName ? (
        <Tag icon={<TagOutlined />} color="blue">
          {categoryName}
        </Tag>
      ) : (
        <Text type="secondary">未分类</Text>
      )
    ),
  },
  {
    title: '摘要',
    dataIndex: 'summary',
    key: 'summary',
    width: 250,
    ellipsis: {
      showTitle: false,
    },
    render: (summary: string) => (
      summary ? (
        <Tooltip title={summary}>
          <Paragraph 
            ellipsis={{ rows: 2, expandable: false }}
            style={{ margin: 0, fontSize: '12px', color: '#666' }}
          >
            {summary}
          </Paragraph>
        </Tooltip>
      ) : (
        <Text type="secondary">无摘要</Text>
      )
    ),
  },
  {
    title: '创建人',
    dataIndex: 'create_user',
    key: 'create_user',
    width: 100,
    render: (createUser: string) => (
      createUser ? (
        <Text>{createUser}</Text>
      ) : (
        <Text type="secondary">-</Text>
      )
    ),
  },
  {
    title: '更新人',
    dataIndex: 'update_user',
    key: 'update_user',
    width: 100,
    render: (updateUser: string) => (
      updateUser ? (
        <Text>{updateUser}</Text>
      ) : (
        <Text type="secondary">-</Text>
      )
    ),
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    width: 160,
    sorter: true,
    render: (createTime: string) => (
      <Text style={{ fontSize: '12px' }}>
        {dateFormate(createTime)}
      </Text>
    ),
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    width: 160,
    sorter: true,
    render: (updateTime: string) => (
      <Text style={{ fontSize: '12px' }}>
        {dateFormate(updateTime)}
      </Text>
    ),
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 150,
    ellipsis: {
      showTitle: false,
    },
    render: (remark: string) => (
      remark ? (
        <Tooltip title={remark}>
          <Text style={{ fontSize: '12px', color: '#666' }}>
            {remark}
          </Text>
        </Tooltip>
      ) : (
        <Text type="secondary">-</Text>
      )
    ),
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    align: 'center',
    fixed: 'right',
    render: (_, record: ArticleDataType) => (
      <Space size="small">
        {onView && (
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          >
            查看
          </Button>
        )}
        {onPreview && record.status === 'publish' && (
          <Button 
            type="link" 
            size="small" 
            icon={<FileTextOutlined />}
            onClick={() => onPreview(record)}
          >
            预览
          </Button>
        )}
        <Button 
          type="link" 
          size="small" 
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
        >
          编辑
        </Button>
        <ConfirmableButton
          type="link"
          size="small"
          icon={<DeleteOutlined />}
          danger
          title="确认删除"
          description={`确定要删除文章"${record.title || '无标题的文档'}"吗？`}
          onSubmit={() => onDelete(record)}
        >
          删除
        </ConfirmableButton>
      </Space>
    ),
  },
];

// ==================== 简化版本的列配置 ====================
export const createSimpleArticleColumns = (
  onEdit: (record: ArticleDataType) => void,
  onDelete: (record: ArticleDataType) => void
): TableProps<ArticleDataType>['columns'] => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    align: 'center',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    render: (title: string) => title || '无标题的文档',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
    render: (status: 'draft' | 'publish') => (
      <Tag color={status === 'publish' ? 'green' : 'orange'}>
        {status === 'publish' ? '已发布' : '草稿'}
      </Tag>
    ),
  },
  {
    title: '分类',
    dataIndex: 'category_name',
    key: 'category_name',
    width: 120,
    render: (categoryName: string) => categoryName || '未分类',
  },
  {
    title: '创建人',
    dataIndex: 'create_user',
    key: 'create_user',
    width: 100,
    render: (createUser: string) => createUser || '-',
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    width: 160,
    render: dateFormate,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center',
    render: (_, record: ArticleDataType) => (
      <Space size="small">
        <Button 
          type="link" 
          size="small" 
          onClick={() => onEdit(record)}
        >
          编辑
        </Button>
        <ConfirmableButton
          type="link"
          size="small"
          danger
          onSubmit={() => onDelete(record)}
        >
          删除
        </ConfirmableButton>
      </Space>
    ),
  },
];

// ==================== 移动端适配的列配置 ====================
export const createMobileArticleColumns = (
  onEdit: (record: ArticleDataType) => void,
  onDelete: (record: ArticleDataType) => void
): TableProps<ArticleDataType>['columns'] => [
  {
    title: '文章信息',
    key: 'article_info',
    render: (_, record: ArticleDataType) => (
      <div>
        <div style={{ marginBottom: 8 }}>
          <Text strong>{record.title || '无标题的文档'}</Text>
          <Tag 
            color={record.status === 'publish' ? 'green' : 'orange'}
            style={{ marginLeft: 8 }}
          >
            {record.status === 'publish' ? '已发布' : '草稿'}
          </Tag>
        </div>
        {record.summary && (
          <div style={{ marginBottom: 4 }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.summary}
            </Text>
          </div>
        )}
        <div style={{ fontSize: '12px', color: '#999' }}>
          <span>分类：{record.category_name || '未分类'}</span>
          <span style={{ marginLeft: 16 }}>
            更新：{dateFormate(record.update_time)}
          </span>
        </div>
      </div>
    ),
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    align: 'center',
    render: (_, record: ArticleDataType) => (
      <Space direction="vertical" size="small">
        <Button 
          type="link" 
          size="small" 
          block
          onClick={() => onEdit(record)}
        >
          编辑
        </Button>
        <ConfirmableButton
          type="link"
          size="small"
          danger
          block
          onSubmit={() => onDelete(record)}
        >
          删除
        </ConfirmableButton>
      </Space>
    ),
  },
];

// ==================== 使用示例 ====================
/*
// 在 ArticleTable 组件中使用
import { createArticleColumns } from './columns';

const ArticleTable: React.FC = () => {
  const { state, actions } = useArticleList();
  
  const handleEdit = (record: ArticleDataType) => {
    actions.openDialog(true, record);
  };
  
  const handleDelete = (record: ArticleDataType) => {
    actions.delete(record);
  };
  
  const handleView = (record: ArticleDataType) => {
    // 查看详情逻辑
    console.log('查看文章:', record);
  };
  
  const handlePreview = (record: ArticleDataType) => {
    // 预览文章逻辑
    window.open(`/article/preview/${record.id}`, '_blank');
  };
  
  const columns = createArticleColumns(handleEdit, handleDelete, handleView, handlePreview);
  
  return (
    <AppTable
      data={{ page: state.page, data: state.data }}
      columns={columns}
      loading={state.loading}
      scroll={{ x: 1200 }} // 支持横向滚动
    />
  );
};
*/

// ==================== 高级功能扩展 ====================
/*
// 如果需要更多功能，可以扩展列配置：

1. 批量操作：
   - 添加 checkbox 选择列
   - 支持批量删除、批量修改状态等

2. 搜索高亮：
   - 在标题、摘要中高亮搜索关键词

3. 自定义筛选：
   - 按创建时间范围筛选
   - 按创建人筛选

4. 导出功能：
   - 导出为 Excel
   - 导出为 PDF

5. 权限控制：
   - 根据用户权限显示/隐藏操作按钮
   - 不同角色看到不同的列

6. 实时更新：
   - WebSocket 实时更新文章状态
   - 显示其他用户正在编辑的文章
*/


```
