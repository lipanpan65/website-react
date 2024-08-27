import * as React from 'react';
import { Button, Col, Form, FormInstance, Input, Modal, Row, Space, Table, TableProps, theme } from 'antd';
import { dateFormate, request, rowKeyF } from '@/utils';

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

// 定义context
export const SubjectContext = React.createContext<{
  state: typeof initialState,
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => { }
})

const api: any = {
  fetch: (params: any) => request({
    url: `/api/user/v1/account/menus/`,
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
  const context = React.useContext(SubjectContext)

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

const SubjectModal = React.forwardRef((props: any, ref) => {
  const { onSubmit } = props
  const context = React.useContext(SubjectContext)
  const [title, setTitle] = React.useState<string>('添加专题')
  const [formInstance, setFormInstance] = React.useState<FormInstance>();


  const onOk = () => {
    formInstance?.validateFields()
      .then((entry: any) => {
        const { pid } = context.state.entry
        context.dispatch((f: any) => onSubmit(f, {
          ...entry,
          pid
        }))
      }).finally(() => {
        context.dispatch({
          type: 'SHOW_MODEL', payload: {
            open: false
          }
        })
      })
  }

  const onCancel = () => {
    context.dispatch({
      type: 'SHOW_MODEL', payload: {
        open: false
      }
    })
  }

  return (
    <React.Fragment>
      <Modal
        // width={'65%'}
        open={context.state.open}
        title={title}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true }}
        onCancel={onCancel}
        destroyOnClose
        onOk={onOk}
      >
        <ModelForm
          initialValues={{}}
          onFormInstanceReady={(instance) => {
            setFormInstance(instance);
          }}
          isUpdate={false}
        />
      </Modal>
    </React.Fragment>
  )
})


const SubjectSearch = (props: any) => {
  const { onFormInstanceReady, showModel, setQqueryParams } = props
  const [form] = Form.useForm();

  React.useEffect(() => {
    onFormInstanceReady(form);
  }, []);

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' });
        break;
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' });
        break;
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' });
        break;
      default:
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onResetFields = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
  };

  const onPressEnter = (k: string, e: any) => {
    console.log('onPressEnter') // 优先执行
    setQqueryParams((preQuerys: any) => {
      return {
        ...preQuerys,
        [k]: e.target.value
      }
    })
  }

  return (
    <React.Fragment>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
      // onFinish={onFinish}
      // style={{ maxWidth: 600 }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className='search'>
          <Button type="primary" onClick={(event: any) => showModel(event, {})}>添加</Button>
          <Form.Item
            name="search"
            // label="搜索" 
            rules={[{ required: false }]}>
            <Input
              placeholder='请搜索...'
              allowClear
              // onPressEnter={onPressEnter}
              onPressEnter={(e: any) => onPressEnter('search', e)}
              onFocus={() => { console.log('onFocus') }}
              onBlur={() => { console.log('onBlur') }}
            />
          </Form.Item>
        </Row>
      </Form>
    </React.Fragment >
  )
}


const SubjectTable = (props: any) => {
  const { columns } = props
  const context = React.useContext(SubjectContext)
  const { page, data, } = context.state
  const [checkStrictly, setCheckStrictly] = React.useState(false);

  const pagination = {
    total: page?.total || 0, // 数据总数
    current: page?.current || 1, // 当前页码
    pageSize: page?.pageSize || 5, // 每页显示条数
    // showSizeChanger: true, // 是否显示 pageSize 改变器
    // showQuickJumper: true, // 是否显示快速跳转
    showTotal: (total: number) => `总共 ${total} 条数据`, // 自定义显示总数的格式
  };

  const onChange = (pagination: any) => {
    const preQueryParams = context.state.params
    console.log('onChange===>', pagination)
    const params = {
      ...preQueryParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total
    }
    context.dispatch({
      type: 'READ',
      payload: {
        params
      }
    })
  }

  // const rowSelection: TableRowSelection<DataType> = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //   },
  //   onSelect: (record, selected, selectedRows) => {
  //     console.log(record, selected, selectedRows);
  //   },
  //   onSelectAll: (selected, selectedRows, changeRows) => {
  //     console.log(selected, selectedRows, changeRows);
  //   },
  // };

  return (
    <React.Fragment>
      <Table
        rowKey={rowKeyF}
        onChange={onChange}
        pagination={pagination}
        columns={columns}
        // rowSelection={{ ...rowSelection, checkStrictly }}
        dataSource={data}
      />
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


const reducer = (preState: any, action: any) => {

  let { type } = action;
  if (typeof action == 'function') {
    type = action()
  }
  switch (action.type) {
    case 'READ':
      const { params } = action.payload
      preState.loading = true
      preState.params = params
      return {
        ...preState
      }
    case 'READ_DONE':
      const { data, page } = action.payload
      preState.loading = false
      preState.data = data
      preState.page = page
      return {
        ...preState
      }
    case 'CREATE':
      preState.loading = true
      return {
        ...preState
      }
    case 'UPDATE':
      return preState
    case 'SHOW_MODEL':
      const { open, entry } = action.payload
      preState.open = open
      preState.entry = entry
      return {
        ...preState
      }
    default:
      return preState
  }
}

const Subject = () => {

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '专题名称',
      dataIndex: 'subject_name',
      key: 'subject_name',
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

  const modelRef: any = React.useRef()
  const tableRef: any = React.useRef()
  const [queryParams, setQqueryParams] = React.useState<any>({})
  const [formInstance, setFormInstance] = React.useState<FormInstance>();

  const [state, dispatch] = React.useReducer(reducer, initialState)

  const showModel = (event: any, data?: any, key?: any) => {
    console.log('showModel')
    dispatch({
      type: 'SHOW_MODEL', payload: {
        open: true, entry: {
          id: data.id,
          menu_name: data.menu_name,
          pid: data.id
        }
      }
    })
    // if (key === 'add') {
    //   dispatch({
    //     type: 'SHOW_MODEL', payload: {
    //       open: true, entry: {
    //         id: data.id,
    //         menu_name: data.menu_name,
    //         pid: data.id
    //       }
    //     }
    //   })
    // } else {
    //   dispatch({ type: 'SHOW_MODEL', payload: { open: true, entry: { ...data } } })
    // }
  }

  // 定义action 
  const dispatchF: React.Dispatch<any> = (action: any) => {
    // 判断action是不是函数，如果是函数，就执行,并且把dispatch传进去
    if (typeof action === 'function') {
      action(dispatch)
    } else {
      dispatch(action)
    }
  }


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
  React.useEffect(() => {
    console.log('组件加载queryParams', queryParams)
    console.log('-queryParams-', queryParams)
    // getArticleCategory()
  }, [queryParams])

  return (
    <React.Fragment>
      <div
        style={{
          height: '100vh',
          padding: '20px 20px',
          background: colorBgContainer
        }}
      >
        <SubjectContext.Provider value={{ state, dispatch: dispatchF }} >
          <SubjectSearch
            showModel={showModel}
            onFormInstanceReady={(instance: any) => {
              setFormInstance(instance);
            }}
            setQqueryParams={setQqueryParams}
          />
          <SubjectTable
            ref={tableRef}
            columns={columns}
          />
          <SubjectModal
            ref={modelRef}
            onSubmit={onSubmit}
          />
        </SubjectContext.Provider>
      </div>
    </React.Fragment>
  )
}

export default Subject