import * as React from 'react'

import AppContainer from '@/components/AppContainer'
import AppContent from '@/components/AppContent'
import AppSearch from '@/components/AppSearch'
import { FormInstance, message } from 'antd';
import AppTable from '@/components/AppTable';
import AppDialog from '@/components/AppDialog';
import { useArticleList, ArticleListProvider } from '@/hooks/state/useArticleList';
import { api } from '@/api';

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
  // const { state } = useArticleCategory();
  const state = {
    page: { total: 0, current: 1, pageSize: 10 },
    data: [],
    loading: false,
  }
  const { page = { total: 0, current: 1, pageSize: 10 }, data = [], loading } = state;
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

  return (
    <AppContainer>
      <ArticleSearch
        showModel={showModel}
        onFormInstanceReady={onFormInstanceReady}
        setQueryParams={setQueryParams}
      />
      <ArticleTable />
      <ArticleDialog
        ref={dialogRef}
        onSubmit={onSubmit}
      />
    </AppContainer>
  )
}

const apiService = {
  read: async (params: any, signal?: AbortSignal) => {
    try {
      // 使用你现有的 api 对象
      const response = await api.article.fetch(params);
      console.log(response);
      return {
        data: response.data?.list || [],
        page: {
          total: response.data?.total || 0,
          current: response.data?.current || 1,
          pageSize: response.data?.pageSize || 10
        }
      };
    } catch (error) {
      throw error;
    }
  },

  create: async (data: Record<string, any>, signal?: AbortSignal) => {
    const response = await api.article.create(data);
    return response.data;
  },

  update: async (data: Record<string, any>, signal?: AbortSignal) => {
    const response = await api.article.update(data);
    return response.data;
  },

  delete: async (data: Record<string, any>, signal?: AbortSignal) => {
    const response = await api.article.delete(data.id);
    return response.data;
  },
}

export default () => (
  <ArticleListProvider apiService={apiService}>
    <ArticleList />
  </ArticleListProvider>
)






