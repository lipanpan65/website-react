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

// 初始化参数
const initialState = {
  loading: false,
  open: false,
  entry: {
    id: null,
    menu_name: null,
    enable: null,
    url: null,
    element: null,
    pid: null
  },
  page: {
    total: 0,
    current: 0,
    pageSize: 5
  },
  data: [],
  params: {}
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



const api: any = {
  fetch: (params: any) => request({
    url: `/api/v1/users/`,
    method: 'GET',
    params
  }),
  create: (data: any) => request({
    url: `/api/user/v1/account/menus/`,
    method: 'POST',
    data
  }),
  update: (data: any) => request({
    url: `/api/user/v1/account/menus/${data.id}`,
    method: 'PUT',
    data
  }),
  entry: (id: any) => request({
    url: `/api/user/v1/account/menus/${id}`,
    method: 'GET',
  }),
  delete: (id: any) => request({
    url: `/api/user/v1/account/menus/${id}`,
    method: 'DELETE',
  }),
}


interface ModelFormProps {
  isUpdate: boolean;
  initialValues: any; // todo 
  onFormInstanceReady: (instance: FormInstance<any>) => void;
}

const ModelForm: React.FC<ModelFormProps> = ({
  onFormInstanceReady,
  initialValues
}) => {

  const [form] = Form.useForm();

  React.useEffect(() => onFormInstanceReady(form), [])

  return (
    <React.Fragment>
      <Form layout="vertical"
        form={form}
        initialValues={initialValues}
      >
        <Form.Item
          name="subject_name"
          label="专题名称"
          rules={[
            { required: true, message: '请输入分类名称' },
            // { validator: validateNameExists }
          ]}
        >
          <Input
            placeholder='请输入专题名称'
          // disabled={isUpdate}
          />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea
            placeholder='请输入备注'
            showCount maxLength={100} />
        </Form.Item>
      </Form>
    </React.Fragment>
  )
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
      label: '专题名称',
      name: 'category_name',
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

  const [checkStrictly, setCheckStrictly] = React.useState(false);

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

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}


const AppTopic = () => {

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '专题名称',
      dataIndex: 'subject_name',
      key: 'topic_name',
      render: (text) => <a>{text}</a>,
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
      render: (_, record) => (
        <Space size="middle">
          <a onClick={(event: any) => showModel(event, record)}>编辑</a>
          {/* <a onClick={(event: any) => onDelete(event, record)}>删除</a> */}
        </Space>
      ),
    },
  ];

  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const { state, enhancedDispatch } = useTopic();

  const dialogRef: any = React.useRef()
  const searchFormRef = React.useRef<FormInstance | null>(null);
  const [queryParams, setQueryParams] = React.useState<any>({})

  const onFormInstanceReady = (form: FormInstance) => {
    searchFormRef.current = form; // 将 form 实例存储到 ref
  };

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

  const showModel = (event: any, data?: any) => {
    dialogRef.current.showModel(true, data)
  }

  const queryTopics = () => {
    const { params } = state
    api.fetch(params).then((r: any) => {
      console.log("-------")
      console.log(r)
      console.log("-------")
    }).catch((e: any) => {
      console.log(e)
    })
  }

  // React.useEffect(() => querySubjects(), [state.params])
  // React.useEffect(() => queryTopics(), [])


  // submit 方法
  const onSubmit = (dispatch: React.Dispatch<any>, data: any) => {
    console.log('dispatch', dispatch)
    console.log('data===>', data)
    dispatch({ type: 'CREATE', payload: { data } })
    api.create(data).then((r: any) => {
      console.log('onSubmit.r===>', r)
    }).finally(() => {
      // dispatch({ type: 'READ_DONE', payload: {} })
    })
  }

  /**
 * 按照顺序执行
 */
  // React.useEffect(() => {
  //   console.log('组件加载queryParams', queryParams)
  //   console.log('-queryParams-', queryParams)
  //   queryTopics()
  // }, [queryParams])

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


