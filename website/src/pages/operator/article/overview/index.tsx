import * as React from 'react'

import AppContainer from '@/components/AppContainer'
import AppContent from '@/components/AppContent'
import AppSearch from '@/components/AppSearch'
import { FormInstance } from 'antd';
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

  const onSubmit = async (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    data: Record<string, any>
  ) => {
    // 确定请求方法
    const requestAction =
      actionType === 'DELETE'
        ? () => api.articleCategory.delete(data.id)
        : actionType === 'UPDATE'
          ? api.articleCategory.update
          : api.articleCategory.create;

    // 设定响应消息
    const responseMessages = {
      success: actionType === 'UPDATE' ? '更新成功' : actionType === 'DELETE' ? '删除成功' : '创建成功',
      error: actionType === 'UPDATE' ? '更新失败，请重试' : actionType === 'DELETE' ? '删除失败，请重试' : '创建失败，请重试',
    };

    // // 执行状态更新
    // enhancedDispatch({ type: actionType, payload: { data } });

    // try {
    //   const response = await requestAction(data);
    //   const messageText = response?.success ? responseMessages.success : response?.message || responseMessages.error;
    //   message[response?.success ? 'success' : 'error'](messageText);
    // } catch (error) {
    //   console.error('提交出错:', error);
    //   message.error('提交出错，请检查网络或稍后重试');
    // } finally {
    //   await queryArticleCategory();
    // }
  };

  const onFormInstanceReady = (form: FormInstance) => {
    searchFormRef.current = form; // 将 form 实例存储到 ref
  };

  const showModel = (event: any, data?: any) => {
    dialogRef.current.showModel(true, data)
  }

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






