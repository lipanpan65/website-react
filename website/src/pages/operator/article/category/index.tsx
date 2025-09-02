import * as React from 'react'
import {
  Button,
  Form,
  Input, Modal,
  Select,
  Space,
  message,
} from 'antd'
import type { TableProps, FormInstance } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { dateFormate } from '@/utils';
import './index.css'
import { ArticleCategoryProvider, useArticleCategory } from '@/hooks/state/useArticleCategory';
import AppSearch from '@/components/AppSearch';
import AppContent from '@/components/AppContent';
import AppContainer from '@/components/AppContainer';
import AppTable from '@/components/AppTable';
import ConfirmableButton from '@/components/ConfirmableButton';
import { api } from '@/api';
import StatusTag from '@/components/StatusTag';
import AppDialog from '@/components/AppDialog';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface AppArticleCategorySearchProps {
  showModel: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  setQueryParams: (params: any) => void;
}

// 定义分页和表格数据的类型
interface PaginationProps {
  total: number;
  current: number;
  pageSize: number;
}

interface DataItem {
  id: number;
  name: string;
  description: string;
}

interface AppArticleCategoryTableProps {
  data?: {
    page: PaginationProps;
    data: any[];  // 数据数组，包含 id, name, description
  };
  columns?: any;  // 设置可选
  onChange?: (pagination: PaginationProps, filters?: any, sorter?: any) => void;  // 新增 onChange 属性
}

const AppArticleCategorySearch: React.FC<AppArticleCategorySearchProps> = ({
  showModel,
  onFormInstanceReady,
  setQueryParams,
}) => {

  const { state } = useArticleCategory();
  const formRef = React.useRef<FormInstance | null>(null);

  const handleFormInstanceReady = (form: FormInstance) => { // 该 form 为 AppSearchForm 中的实例
    formRef.current = form; // 将 AppSearchForm 中的 form 传递给当前组件
    onFormInstanceReady(form); // 将 form 实例传递给父组件
  };

  const buttonConfig = {
    label: '添加',
    type: 'primary' as const,  // 明确指定类型以符合 ButtonConfig
    onClick: (event: React.MouseEvent<HTMLElement>) => showModel(event, {}),
    disabled: false,
    icon: <PlusCircleOutlined />,  // 例如使用 Ant Design 的图标
  };

  return (
    <React.Fragment>
      <AppContent>
        <AppSearch
          buttonConfig={buttonConfig}  // 动态按钮配置
          onFormInstanceReady={handleFormInstanceReady}
          setQueryParams={setQueryParams}
          initialParams={state.params}
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
        />
      </AppContent>
    </React.Fragment >
  )
}

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}


const AppArticleCategoryTable: React.FC<AppArticleCategoryTableProps> = ({
  columns = [], // 设置默认值为空数组
  onChange
}) => {
  const { state } = useArticleCategory();
  const { page = { total: 0, current: 1, pageSize: 10 }, data = [], loading } = state;
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (onChange) {
      onChange(pagination, filters, sorter);  // 确保 onChange 已定义
    }
  };

  return (
    <React.Fragment>
      <AppContent>
        <AppTable
          data={{ page, data }}
          columns={columns}
          onChange={handleTableChange}
          loading={loading}
        />
      </AppContent>
    </React.Fragment>
  )
}

interface ArticleCategory {
  category_name?: string;
  remark?: string;
}

interface CategoryModelProps {
  ref: null;
  open: boolean;
  onOK: (values: ArticleCategory) => void;
  onCancel: () => void;
  initialValues: ArticleCategory;
}


const AppArticleCategoryDialog: any = React.forwardRef((props: any, ref: any) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { onSubmit, initialValues } = props
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null);
  const [record, setRecord] = React.useState<any>({})

  React.useEffect(() => {
    if (formInstance && record) {
      formInstance.setFieldsValue(record);
    }
  }, [record, formInstance]);

  const showModel = (isOpen: boolean, data?: any) => {
    setOpen(isOpen);
    if (isOpen && data) {
      setRecord(data); // 更新 record 状态
    }
  };

  const handleSubmit = async () => {
    try {
      const data = await formInstance?.validateFields();
      if (!!record.id) {
        const newRecord = { id: record.id, ...data };
        await onSubmit('UPDATE', newRecord); // 不再需要传递 `dispatch`
      } else {
        await onSubmit('CREATE', data); // 不再需要传递 `dispatch`
      }
      // enhancedDispatch((dispatch) => onSubmit(dispatch, 'UPDATE', newRecord));
      setOpen(false);
    } catch (error: any) {
      console.error('捕获的异常:', error);
      message.error(error.message || '表单验证失败，请检查输入内容。');
    }
  };

  const onCancel = () => {
    formInstance?.resetFields();
    setOpen(false);
  };

  const fields = [
    {
      label: '分类名称',
      name: 'category_name',
      rules: [{ required: true, message: '请输入分类名称' }],
      component: <Input
        disabled={!!record.id}
        placeholder="请输入分类名称" />,
      span: 24,
    },
    {
      label: '状态',
      name: 'enable',
      rules: [{ required: true, message: '请输入角色类型' }],
      component: (
        <Select placeholder="请选择状态" allowClear>
          <Select.Option value={1}>启用</Select.Option>
          <Select.Option value={0}>禁用</Select.Option>
        </Select>
      ),
      span: 24,
    },
    {
      name: 'remark',
      label: '备注',
      component: <Input.TextArea placeholder="请输入备注" showCount maxLength={100} />,
      span: 24,
    },
  ];

  React.useImperativeHandle(ref, () => ({
    showModel,
    onCancel,
    setOpen,
  }))

  return (
    <React.Fragment>
      <AppDialog
        title='添加角色'
        fields={fields}
        record={record}
        onCancel={onCancel}
        open={open}
        onSubmit={handleSubmit}
        isEditing={!!record.id}
        setFormInstance={(instance) => {
          setFormInstance(instance);
        }}
      />
    </React.Fragment>
  )
})

const AppArticleCategory = (props: any) => {
  const { state, enhancedDispatch } = useArticleCategory();
  const dialogRef: any = React.useRef()
  const searchFormRef = React.useRef<FormInstance | null>(null);
  const [queryParams, setQueryParams] = React.useState<any>({})

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '分类名称',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: '状态',
      dataIndex: 'enable',
      key: 'enable',
      render: (text: number) => <StatusTag status={text} />
    },
    {
      title: '更新人',
      dataIndex: 'update_user',
      key: 'update_user',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      render: dateFormate
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button size='small' color="primary" variant="link" onClick={(event: any) => showModel(event, record)}>
            编辑
          </Button>
          <ConfirmableButton
            type='link'
            onSubmit={() => onSubmit('DELETE', record)}
          >删除</ConfirmableButton>
        </Space>
      ),
    },
  ];

  const onChange = (pagination: any) => {
    setQueryParams((preQueryParams: any) => {
      return {
        ...preQueryParams,
        page: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    })
  }

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

    // 执行状态更新
    enhancedDispatch({ type: actionType, payload: { data } });

    try {
      const response = await requestAction(data);
      const messageText = response?.success ? responseMessages.success : response?.message || responseMessages.error;
      message[response?.success ? 'success' : 'error'](messageText);
    } catch (error) {
      console.error('提交出错:', error);
      message.error('提交出错，请检查网络或稍后重试');
    } finally {
      await queryArticleCategory();
    }
  };

  React.useEffect(() => {
    if (Object.keys(queryParams).length > 0) {
      enhancedDispatch({ type: 'UPDATE_PARAMS', payload: { params: queryParams } });
    }
  }, [queryParams]);

  const onFormInstanceReady = (form: FormInstance) => {
    searchFormRef.current = form; // 将 form 实例存储到 ref
  };

  const showModel = (event: any, data?: any) => {
    dialogRef.current.showModel(true, data)
  }

  const queryArticleCategory = async () => {
    try {
      const { params } = state;
      const response = await api.articleCategory.fetch(params);
      if (response && response.success) {
        const { data, page } = response.data;
        enhancedDispatch({
          type: 'READ_DONE', payload: {
            data, page
          }
        });
      } else {
        message.error(response?.message || '获取数据失败');
      }
    } catch (error) {
      message.error('请求失败，请稍后重试');
    }
  };

  React.useEffect(() => {
    (async () => {
      await queryArticleCategory();
    })();
  }, [state.params]);

  return (
    <React.Fragment>
      <AppContainer>
        <AppArticleCategorySearch
          showModel={showModel}
          onFormInstanceReady={onFormInstanceReady}
          setQueryParams={setQueryParams}
        />
        <AppArticleCategoryTable
          columns={columns}
          onChange={onChange}
        />
        <AppArticleCategoryDialog
          ref={dialogRef}
          onSubmit={onSubmit}
        />
      </AppContainer>
    </React.Fragment>
  )
}

export default () => (
  <ArticleCategoryProvider>
    <AppArticleCategory />
  </ArticleCategoryProvider>
);

