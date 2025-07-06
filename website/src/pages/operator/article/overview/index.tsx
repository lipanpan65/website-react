import * as React from 'react'

import AppContainer from '@/components/AppContainer'
import AppContent from '@/components/AppContent'
import AppSearch from '@/components/AppSearch'
import { Button, FormInstance, message, Space, TableProps, Tag, Tooltip, Typography } from 'antd';
import AppTable from '@/components/AppTable';
import AppDialog from '@/components/AppDialog';
import { useArticleList, ArticleListProvider } from '@/hooks/state/useArticleList';
import { api } from '@/api';
import { DeleteOutlined, EditOutlined, EyeOutlined, FileTextOutlined, TagOutlined } from '@ant-design/icons';
import Paragraph from 'antd/es/skeleton/Paragraph';
import ConfirmableButton from '@/components/ConfirmableButton';

const { Text } = Typography;

// 日期格式化函数
const dateFormate = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};


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
            <Text
              style={{
                margin: 0,
                fontSize: '12px',
                color: '#666',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {summary}
            </Text>
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
      width: 380,
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
            confirmContent={`确定要删除文章"${record.title || '无标题的文档'}"吗？`}
            onSubmit={async () => {
              await onDelete(record);
            }}
          >
            删除
          </ConfirmableButton>
        </Space>
      ),
    },
  ];







interface ArticleSearchProps {
  showModel: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  onFormInstanceReady: (form: FormInstance<any>) => void;
  setQueryParams: (params: any) => void;
}

// 搜索
const ArticleSearch: React.FC<ArticleSearchProps> = ({
  showModel,
  onFormInstanceReady,
  setQueryParams,
}) => {
  const [formInstance, setFormInstance] = React.useState<FormInstance<any> | null>(null);
  const [searchParams, setSearchParams] = React.useState<any>({});
  const [searchLoading, setSearchLoading] = React.useState<boolean>(false);

  const onSearch = (values: any) => {
    console.log(values);
  }


  return (
    <AppContent>
      <AppSearch
        onFormInstanceReady={onFormInstanceReady}
        setQueryParams={setSearchParams}
        initialParams={searchParams}
        formItems={[
          {
            name: 'search',
            placeholder: '请输入...',
            type: 'input',
          },
          {
            name: 'enable',
            placeholder: '请选择状态',
            type: 'select',
            width: 150,
            selectConfig: {
              allowClear: true,
              options: [
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ],
            },
          },
        ]}
        buttonConfig={{
          label: '搜索',
          onClick: onSearch,
        }}
      />
    </AppContent>
  )
}

interface ArticleTableProps {
  columns?: any[];
  onChange?: (pagination: any, filters: any, sorter: any) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({
  columns = [], // 设置默认值为空数组
  onChange
}) => {
  const { state } = useArticleList();
  const { page = { total: 0, current: 1, pageSize: 10 }, data = [], loading } = state;
  // const { page = { total: 0, current: 1, pageSize: 10 }, data = [], loading } = state;
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (onChange) {
      onChange(pagination, filters, sorter);  // 确保 onChange 已定义
    }
  };


  return (
    <AppContent>
      <AppTable
        data={{ page, data }}
        columns={columns}
        onChange={handleTableChange}
        loading={loading}
        // scroll={{ x: 1200 }}
      />
    </AppContent>
  )
}

const ArticleDialog: any = React.forwardRef((props: any, ref: any) => {
  const { onSubmit } = props;
  const [formInstance, setFormInstance] = React.useState<FormInstance<any> | null>(null);

  const onFormInstanceReady = (formInstance: FormInstance<any>) => {
    setFormInstance(formInstance);
  }

  const fields = [
    {
      name: 'title',
      label: '标题',
      type: 'input',
    },
    {
      name: 'content',
      label: '内容',
      type: 'textarea',
    },
  ]

  React.useImperativeHandle(ref, () => ({
    onFormInstanceReady,
    onSubmit,
  }))

  return (
    <AppContent>
      <AppDialog
        onSubmit={onSubmit}
        fields={fields}
        setFormInstance={onFormInstanceReady}
      />
    </AppContent>
  )
})

// 管理端文章列表
const ArticleList: React.FC = () => {
  const { state, actions } = useArticleList();
  const dialogRef: any = React.useRef();
  const searchFormRef = React.useRef<FormInstance | null>(null);
  const [queryParams, setQueryParams] = React.useState<any>({});
  const [searchParams, setSearchParams] = React.useState<any>({});

  // 最佳实践示例
  const onSubmit = React.useCallback(async (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    data: Record<string, any>
  ) => {
    try {
      switch (actionType) {
        case 'CREATE':
          await actions.create(data);
          message.success('创建成功');
          break;
        case 'UPDATE':
          await actions.update(data);
          message.success('更新成功');
          break;
        case 'DELETE':
          await actions.delete(data);
          message.success('删除成功');
          break;
        default:
          // 这里 TypeScript 会提示这是不可达代码，因为已经穷尽了所有可能
          const _exhaustiveCheck: never = actionType;
          throw new Error(`未处理的操作类型: ${_exhaustiveCheck}`);
      }
    } catch (error: any) {
      console.error('提交出错:', error);
      message.error(error.message || '操作失败，请重试');
    }
  }, [actions]);

  const onFormInstanceReady = (form: FormInstance) => {
    searchFormRef.current = form; // 将 form 实例存储到 ref
  };

  // 使用 Context 中的 open/record 状态
  const showModel = React.useCallback((event: any, data: any) => {
    actions.openDialog(true, data);
  }, [actions]);

  // 组件挂载时加载初始数据
  React.useEffect(() => {
    actions.read(queryParams);
  }, []); // 空依赖数组

  // 查询参数变化时重新加载
  React.useEffect(() => {
    if (Object.keys(queryParams).length > 0) {
      actions.read(queryParams);
    }
  }, [queryParams]); // 只依赖 queryParams


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
    <AppContainer style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ArticleSearch
        showModel={showModel}
        onFormInstanceReady={onFormInstanceReady}
        setQueryParams={setQueryParams}
      />
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <ArticleTable columns={columns} />
      </div>
      <ArticleDialog
        ref={dialogRef}
        onSubmit={onSubmit}
      />
    </AppContainer>
  )
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}


interface ListResponse {
  list: any[];
  total: number;
  current: number;
  pageSize: number;
}

interface PaginationResult {
  data: any[];
  page: {
    total: number;
    current: number;
    pageSize: number;
  };
}

/**
 * 安全地解析分页数据
 */
const parsePaginationData = (response: ApiResponse<any>): PaginationResult => {
  console.log('🔍 解析分页数据:', response);

  const responseData = response.data;

  // 针对你的数据格式：response.data.data (数组) 和 response.data.page (分页信息)
  if (responseData?.data && Array.isArray(responseData.data) && responseData?.page) {
    return {
      data: responseData.data,
      page: {
        total: responseData.page.total || 0,
        current: responseData.page.current || 1,
        pageSize: responseData.page.pageSize || 10
      }
    };
  }

  // 如果响应数据直接包含 list 和分页信息
  if (responseData?.list && Array.isArray(responseData.list)) {
    return {
      data: responseData.list,
      page: {
        total: responseData.total || 0,
        current: responseData.current || 1,
        pageSize: responseData.pageSize || 10
      }
    };
  }

  // 如果响应数据是数组
  if (Array.isArray(responseData)) {
    return {
      data: responseData,
      page: {
        total: responseData.length,
        current: 1,
        pageSize: responseData.length || 10
      }
    };
  }

  // 如果响应数据包含嵌套的分页信息 (兼容其他格式)
  if (responseData?.data?.list) {
    return {
      data: responseData.data.list,
      page: {
        total: responseData.data.total || 0,
        current: responseData.data.current || 1,
        pageSize: responseData.data.pageSize || 10
      }
    };
  }

  // 默认返回空数据
  console.warn('⚠️ 无法解析分页数据，使用默认值');
  return {
    data: [],
    page: {
      total: 0,
      current: 1,
      pageSize: 10
    }
  };
};

const checkIfAborted = (signal?: AbortSignal): boolean => {
  if (signal?.aborted) {
    throw new DOMException('Request was aborted', 'AbortError');
  }
  return false;
};

/**
 * 验证响应数据
 */
const validateResponse = (response: ApiResponse<any>, operation: string): void => {
  if (!response) {
    throw new Error(`${operation}操作响应为空`);
  }

  // 如果 API 返回的是包含 success 字段的格式
  if (response.success === false) {
    throw new Error(response.message || `${operation}操作失败`);
  }
};


export const createOptimizedApiService = () => ({
  /**
   * 读取数据（支持分页和搜索）
   */
  read: async (params: Record<string, any> = {}, signal?: AbortSignal): Promise<PaginationResult> => {
    try {
      // 检查请求是否被取消
      checkIfAborted(signal);

      // 准备请求参数
      const requestParams = {
        page: 1,
        pageSize: 10,
        ...params
      };

      console.log('📤 API Read Request:', requestParams);

      // 发起请求
      const response: any = await api.article.fetch(requestParams);

      console.log('response', response);

      // 再次检查请求是否被取消
      checkIfAborted(signal);

      // 验证响应
      // validateResponse(response, '读取数据');
      // 解析分页数据
      // {code: '0000', success: true, message: '操作成功', data: {…}}
      const result = parsePaginationData(response);

      console.log('📥 API Read Response:', result);

      return result;
    } catch (error: any) {
      console.error('❌ API Read Error:', error);

      // 如果是取消请求的错误，直接抛出
      if (error.name === 'AbortError') {
        throw error;
      }

      // 包装其他错误
      throw new Error(error.message || '获取数据失败');
    }
  },

  /**
   * 创建数据
   */
  create: async (data: Record<string, any>, signal?: AbortSignal): Promise<any> => {
    try {
      checkIfAborted(signal);

      // 验证必要字段
      if (!data || Object.keys(data).length === 0) {
        throw new Error('创建数据不能为空');
      }

      console.log('📤 API Create Request:', data);

      const response = await api.article.create(data);

      checkIfAborted(signal);

      // validateResponse(response, '创建数据');

      console.log('📥 API Create Response:', response);

      // 返回创建的数据，如果有 data 字段就返回 data，否则返回整个响应
      return response.data || response;
    } catch (error: any) {
      console.error('❌ API Create Error:', error);

      if (error.name === 'AbortError') {
        throw error;
      }

      throw new Error(error.message || '创建数据失败');
    }
  },

  /**
   * 更新数据
   */
  update: async (data: Record<string, any>, signal?: AbortSignal): Promise<any> => {
    try {
      checkIfAborted(signal);

      // 验证必要字段
      if (!data || !data.id) {
        throw new Error('更新数据必须包含 id 字段');
      }

      console.log('📤 API Update Request:', data);

      const response = await api.article.update(data);

      checkIfAborted(signal);

      // validateResponse(response, '更新数据');

      console.log('📥 API Update Response:', response);

      return response.data || response;
    } catch (error: any) {
      console.error('❌ API Update Error:', error);

      if (error.name === 'AbortError') {
        throw error;
      }

      throw new Error(error.message || '更新数据失败');
    }
  },

  /**
   * 删除数据
   */
  delete: async (data: Record<string, any>, signal?: AbortSignal): Promise<any> => {
    try {
      checkIfAborted(signal);

      // 验证必要字段
      if (!data || !data.id) {
        throw new Error('删除数据必须包含 id 字段');
      }

      console.log('📤 API Delete Request:', data.id);

      const response = await api.article.delete(data.id);

      checkIfAborted(signal);

      // validateResponse(response, '删除数据');

      console.log('📥 API Delete Response:', response);

      return response.data || response;
    } catch (error: any) {
      console.error('❌ API Delete Error:', error);

      if (error.name === 'AbortError') {
        throw error;
      }

      throw new Error(error.message || '删除数据失败');
    }
  },
});






// const apiService = {
//   read: async (params: any, signal?: AbortSignal) => {
//     try {
//       // 使用你现有的 api 对象
//       const response = await api.article.fetch(params);
//       console.log(response);
//       return {
//         data: response.data?.list || [],
//         page: {
//           total: response.data?.total || 0,
//           current: response.data?.current || 1,
//           pageSize: response.data?.pageSize || 10
//         }
//       };
//     } catch (error) {
//       throw error;
//     }
//   },

//   create: async (data: Record<string, any>, signal?: AbortSignal) => {
//     const response = await api.article.create(data);
//     return response.data;
//   },

//   update: async (data: Record<string, any>, signal?: AbortSignal) => {
//     const response = await api.article.update(data);
//     return response.data;
//   },

//   delete: async (data: Record<string, any>, signal?: AbortSignal) => {
//     const response = await api.article.delete(data.id);
//     return response.data;
//   },
// }

export default () => (
  <ArticleListProvider apiService={createOptimizedApiService()}>
    <ArticleList />
  </ArticleListProvider>
)






