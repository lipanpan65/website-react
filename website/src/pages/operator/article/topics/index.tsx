import * as React from 'react';
import { Button, Col, Form, FormInstance, Input, message, Modal, PaginationProps, Row, Select, Space, Table, TableProps, theme } from 'antd';
import { dateFormate, request, rowKeyF } from '@/utils';
import { TopicProvider, useTopic } from '@/hooks/state/useTopic';
import AppContainer from '@/components/AppContainer';
import AppTable from '@/components/AppTable';
import AppContent from '@/components/AppContent';
import AppDialog from '@/components/AppDialog';
import { PlusCircleOutlined } from '@ant-design/icons';
import AppSearch from '@/components/AppSearch';
// import { topicApi } from '@/api/topics';
import { api } from '@/api';
import StatusTag from '@/components/StatusTag';
import ConfirmableButton from '@/components/ConfirmableButton';
import { createContext, useContext, useCallback, useReducer, ReactNode, Dispatch } from 'react';
import { usePagination } from '@/hooks/usePagination';

// 定义 State 类型
interface StateType {
  loading: boolean;
  open: boolean;
  record: Record<string, any>;
  page: { total: number; current: number; pageSize: number };
  data: any[];
  params: Record<string, any>;
  error: string | null;
}

// 定义 Action 类型
type ActionType =
  | { type: 'UPDATE_PARAMS'; payload: { params: Record<string, any> } }
  | { type: 'CREATE'; payload: { data: Record<string, any> } }
  | { type: 'UPDATE'; payload: { data: Record<string, any> } }
  | { type: 'DELETE'; payload: { id: number } }
  | { type: 'READ_DONE'; payload: { data: any[]; page: StateType['page'] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// 初始状态
const initialState: StateType = {
  loading: false,
  open: false,
  record: {},
  page: { total: 0, current: 1, pageSize: 10 },
  data: [],
  params: {},
  error: null,
};

// reducer 函数
const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'UPDATE_PARAMS':
      return { ...state, params: action.payload.params, error: null };
    case 'CREATE':
      return { ...state, data: [...state.data, action.payload.data], error: null };
    case 'UPDATE':
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload.data.id ? action.payload.data : item
        ),
        error: null
      };
    case 'DELETE':
      return {
        ...state,
        data: state.data.filter((item) => item.id !== action.payload.id),
        error: null
      };
    case 'READ_DONE':
      return { ...state, data: action.payload.data, page: action.payload.page, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface AppTopicTableProps {
  data?: {
    page: PaginationProps;
    data: any[];  // 数据数组，包含 id, name, description
  };
  columns?: any;  // 设置可选
  onChange?: (pagination: PaginationProps, filters?: any, sorter?: any) => void;  // 新增 onChange 属性
}

interface ModelFormProps {
  isUpdate: boolean;
  initialValues: any; // todo 
  onFormInstanceReady: (instance: FormInstance<any>) => void;
}

const AppTopicDialog = React.forwardRef((props: any, ref) => {
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
      label: '专题名称',
      name: 'topic_name',
      rules: [{ required: true, message: '请输入专题名称' }],
      component: <Input
        disabled={!!record.id}
        placeholder="请输入专题名称" />,
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
        title='添加专题'
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


interface AppTopicSearchProps {
  showModel: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  setQueryParams: (params: any) => void;
}

const AppTopicSearch: React.FC<AppTopicSearchProps> = ({
  showModel,
  onFormInstanceReady,
  setQueryParams,
}) => {

  const { state } = useTopic();
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
        {/* </AppSearch> */}
      </AppContent>
    </React.Fragment >
  )
}



const AppTopicTable: React.FC<AppTopicTableProps> = ({
  columns = [], // 设置默认值为空数组
  onChange
}) => {
  const { state } = useTopic();
  const { page = { total: 0, current: 1, pageSize: 10 }, data = [], loading } = state;

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    console.log(pagination)
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

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

// 1. 定义更严格的类型
type ContextType = {
  state: StateType;
  dispatch: Dispatch<ActionType>;
};

// 2. 创建带默认值的 Context
const TopicsContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => {},
});

// 3. 创建增强的 Hook
export const useTopics = () => {
  const context = useContext(TopicsContext);
  
  // 4. 添加中间件支持
  const enhancedDispatch = useCallback(
    (action: ActionType | ((dispatch: Dispatch<ActionType>) => void)) => {
      if (typeof action === 'function') {
        action(context.dispatch);
      } else {
        context.dispatch(action);
      }
    },
    [context.dispatch]
  );

  // 5. 添加其他功能
  const setLoading = useCallback((loading: boolean) => {
    context.dispatch({ type: 'SET_LOADING', payload: loading });
  }, [context.dispatch]);

  return {
    state: context.state,
    enhancedDispatch,
    setLoading,
    // ... 其他功能
  };
};

// 6. 简化 Provider
export const TopicsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TopicsContext.Provider value={{ state, dispatch }}>
      {children}
    </TopicsContext.Provider>
  );
};

const AppTopic = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const { state, enhancedDispatch } = useTopic();

  const dialogRef: any = React.useRef()
  const searchFormRef = React.useRef<FormInstance | null>(null);
  
  const { queryParams, setQueryParams, handlePaginationChange } = usePagination({
    dispatch: enhancedDispatch,
    actionType: 'UPDATE_PARAMS'
  });

  const showModel = (event: React.MouseEvent<HTMLElement>, data?: any) => {
    if (dialogRef.current) {
      dialogRef.current.showModel(true, data);
    }
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '专题名称',
      dataIndex: 'topic_name',
      key: 'topic_name',
      render: (text) => <a>{text}</a>,
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
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
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

  React.useEffect(() => {
    if (Object.keys(queryParams).length > 0) {
      enhancedDispatch({ type: 'UPDATE_PARAMS', payload: { params: queryParams } });
    }
  }, [queryParams]);

  const onFormInstanceReady = (form: FormInstance) => {
    searchFormRef.current = form; // 将 form 实例存储到 ref
  };

  const onSubmit = async (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    data: Record<string, any>
  ) => {
    // 确定请求方法
    const requestAction =
      actionType === 'DELETE'
        ? () => api.topic.delete(data.id)
        : actionType === 'UPDATE'
          ? api.topic.update
          : api.topic.create;

    // 设定响应消息
    const responseMessages = {
      success: actionType === 'UPDATE' ? '更新成功' : actionType === 'DELETE' ? '删除成功' : '创建成功',
      error: actionType === 'UPDATE' ? '更新失败，请重试' : actionType === 'DELETE' ? '删除失败，请重试' : '创建失败，请重试',
    };

    // 执行状态更新
    enhancedDispatch({ type: actionType, payload: { data } });

    try {
      const response = await requestAction(data);
      debugger
      const messageText = response?.success ? responseMessages.success : response?.message || responseMessages.error;
      message[response?.success ? 'success' : 'error'](messageText);
    } catch (error) {
      console.error('提交出错:', error);
      // TODO 完成提交出错的内容
      // message.error('提交出错，请检查网络或稍后重试');
    } finally {
      await queryTopics();
    }
  };

  const onChange = (pagination: any) => {
    handlePaginationChange(pagination);
  }

  const queryTopics = async () => {
    console.log("参数", state)
    try {
      const { params } = state
      const response = await api.topic.fetch(params)
      if (response && response.success) {
        const { data, page } = response.data
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
  }

  React.useEffect(() => {
    (async () => {
      await queryTopics();
    })();
  }, [state.params]);

  return (
    <React.Fragment>
      <AppContainer>
        <AppTopicSearch
          showModel={showModel}
          onFormInstanceReady={onFormInstanceReady}
          setQueryParams={setQueryParams}
        />
        <AppTopicTable
          columns={columns}
          onChange={onChange}
        />
        <AppTopicDialog
          ref={dialogRef}
          onSubmit={onSubmit}
        />
      </AppContainer>
    </React.Fragment>
  )
}

export default () => (
  <TopicProvider>
    <AppTopic />
  </TopicProvider>
);


