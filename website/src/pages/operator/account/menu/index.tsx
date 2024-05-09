
import * as React from 'react'
import { Button, Col, Form, Input, Modal, Row, Space, Table, message, theme } from 'antd'

import type { FormInstance, TableColumnsType, TableProps } from 'antd';
import { request } from '@/utils';

import { rowKeyF, showTotal } from '@/utils';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

type TableRowSelection<T> = TableProps<T>['rowSelection'];


interface DataType {
  key: React.ReactNode;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
}

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } }

// 初始化参数
const initialState = {
  // tip: '文章自动保存草稿中...',
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

// 定义context
export const MenuContext = React.createContext<{
  state: typeof initialState,
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => { }
})

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

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

/**
 * 菜单管理
 * @returns 
 */
const AppMenuSearch = (props: any) => {
  const { onFormInstanceReady, showModel, setQqueryParams } = props
  const context = React.useContext(MenuContext)
  const [form] = Form.useForm();
  // 由于是按照加载顺序所以放在最上面
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

  const onPressEnter = (e: any, k: any) => {
    console.log('onPressEnter', k) // 优先执行
    const preQueryParams = context.state.params
    const params = {
      ...preQueryParams,
      [k]: e.target.value,
    }
    context.dispatch({
      type: 'READ',
      payload: {
        params
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
      // style={{ maxWidth: 65 }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className='search'>
          <Button type="primary" onClick={(event: any) => showModel(event, {})}>添加</Button>
          <Form.Item
            name="search" label="搜索" rules={[{ required: false }]}>
            <Input
              placeholder='请搜索...'
              allowClear
              // onPressEnter={onPressEnter}
              onPressEnter={(e: any) => onPressEnter(e, 'search')}
              onFocus={() => { console.log('onFocus') }}
              onBlur={() => { console.log('onBlur') }}
            />
          </Form.Item>
        </Row>
      </Form>
    </React.Fragment >
  )
}

// const columns: TableColumnsType<DataType> = [
//   {
//     title: '菜单名称',
//     dataIndex: 'menu_name',
//     key: 'menu_name',
//   },
//   {
//     title: 'URL',
//     dataIndex: 'url',
//     key: 'url',
//     // width: '12%',
//   },
//   {
//     title: '组件名称',
//     dataIndex: 'element',
//     // width: '30%',
//     key: 'address',
//   },
//   {
//     title: '操作',
//     key: 'action',
//     render: (_, record) => (
//       <Space size="middle">
//         {/* <a onClick={(event: any) => showModel(event, record)}>编辑</a> */}
//         <a onClick={(event: any) => alert(1)}>编辑</a>
//         <a onClick={(event: any) => alert(1)}>添加</a>
//         <a onClick={(event: any) => alert(1)}>删除</a>
//         {/* <a onClick={(event: any) => onDelete(event, record)}>删除</a> */}
//       </Space>
//     ),
//   },
// ];


const data: DataType[] = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: 11,
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park',
      },
      {
        key: 12,
        name: 'John Brown jr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: 121,
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park',
          },
        ],
      },
      {
        key: 13,
        name: 'Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: 131,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 1311,
                name: 'Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park',
              },
              {
                key: 1312,
                name: 'Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];

const AppMenuTable = (props: any) => {
  const { columns } = props
  const context = React.useContext(MenuContext)
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

  const rowSelection: TableRowSelection<DataType> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  return (
    <React.Fragment>
      <Table
        rowKey={rowKeyF}
        onChange={onChange}
        pagination={pagination}
        columns={columns}
        rowSelection={{ ...rowSelection, checkStrictly }}
        dataSource={data}
      />
    </React.Fragment>
  )
}


interface ModelFormProps {
  isUpdate: boolean;
  initialValues: any; // todo 
  onFormInstanceReady: (instance: FormInstance<any>) => void;
}

const ModelForm: React.FC<ModelFormProps> = ({
  onFormInstanceReady
}) => {
  const context = React.useContext(MenuContext)
  const [form] = Form.useForm();

  // React.useEffect(() => {
  //   console.log('context.state.open', context.state.open)
  //   console.log('context.state.entry', context.state.entry)
  //   const { open, entry } = context.state
  //   if (open && entry.id) {
  //     form?.setFieldsValue({ ...entry })
  //   }
  // }, [context.state.open])


  React.useEffect(() => onFormInstanceReady(form), [])

  return (
    <React.Fragment>
      <Form form={form}
        // {...formLayout}
        name="form_in_modal" initialValues={{}}>
        <Row gutter={[16, 16]}>
          <Col span={11}>
            <Form.Item
              name="menu_name"
              label="菜单名称"
              rules={[
                { required: true, message: '请输入菜单名称' },
                // { validator: validateNameExists }
              ]}
            >
              <Input
                placeholder='请输入菜单名称'
              // disabled={isUpdate}
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="url"
              label="URL"
              rules={[
                { required: true, message: '请输入路由地址' },
                // { validator: validateNameExists }
              ]}
            >
              <Input
                placeholder='请输入路由地址'
              // disabled={isUpdate}
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="icon"
              label="图标"
              rules={[
                { required: true, message: '请输入路由地址' },
                // { validator: validateNameExists }
              ]}
            >
              <Input
                placeholder='请输入路由地址'
              // disabled={isUpdate}
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="element"
              label="组件"
              rules={[
                { required: true, message: '请输入路由地址' },
                // { validator: validateNameExists }
              ]}
            >
              <Input
                placeholder='请输入路由地址'
              // disabled={isUpdate}
              />
            </Form.Item>
          </Col>
          <Col span={22}>
            <Form.Item name="remark" label="备注">
              <Input.TextArea
                placeholder='请输入备注'
                showCount maxLength={100} />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </React.Fragment>
  )
}


const AppMenuDialog = React.forwardRef((props: any, ref) => {
  const { onSubmit } = props
  const context = React.useContext(MenuContext)
  const [title, setTitle] = React.useState<string>('添加菜单')
  console.log("context", context)
  // const [open, setOpen] = React.useState<boolean>(false);
  const [formInstance, setFormInstance] = React.useState<FormInstance>();

  React.useEffect(() => {
    console.log('context.state.open', context.state.open)
    console.log('context.state.entry', context.state.entry)
    const { open, entry } = context.state
    if (open) {
      if (entry.pid) {
        setTitle(`添加子菜单-${entry.menu_name}`)
      } else if (entry.id) {
        setTitle('编辑菜单')
        formInstance?.setFieldsValue({ ...entry })
      } else {
        setTitle('添加菜单')
      }
    }
  }, [context.state.open, formInstance])

  const onOk = () => {
    formInstance?.validateFields()
      .then((entry: any) => {
        const { pid } = context.state.entry
        // alert(pid)
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
  // context.dispatch({ type: 'PUBLISH', payload: {} })
  // console.log(formRef)
  // try {
  //   const values = await formInstance?.validateFields()
  //   onSubmit(values)
  // } catch (error) {
  //   console.log('Failed:', error);
  // }

  //   formInstance?.validateFields()
  //     .then((values: any) => {
  //       // context.dispatch({ type: 'PUBLISH', payload: values })
  //       if (formValues.id) {
  //         values["id"] = formValues.id
  //       }
  //       // props.onSubmit(values)
  //       onSubmit(values)
  //     }).catch((e) => {
  //       console.log('e', e)
  //       return;
  //     })
  // }

  const onCancel = () => {
    // formInstance?.resetFields();
    // setOpen(false)
    context.dispatch({
      type: 'SHOW_MODEL', payload: {
        open: false
      }
    })
  }

  return (
    <React.Fragment>
      <Modal
        // width={'45%'}
        open={context.state.open}
        title={title}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true }}
        onCancel={onCancel}
        destroyOnClose
        onOk={onOk}
      // afterOpenChange={afterOpenChange}
      // onOk={async () => {
      //   try {
      //     const values = await formInstance?.validateFields();
      //     formInstance?.resetFields();
      //     onOK(values);
      //   } catch (error) {
      //     console.log('Failed:', error);
      //   }
      // }}
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

const reducer = (preState: any, action: any) => {

  let { type } = action;
  if (typeof action == 'function') {
    type = action()
  }
  switch (action.type) {
    case 'READ':
      console.log("READ.action===>", action)
      const { params } = action.payload
      preState.loading = true
      preState.params = params
      console.log("READ===>", preState)
      return {
        ...preState
      }
    case 'READ_DONE':
      const { data, page } = action.payload
      preState.loading = false
      preState.data = data
      preState.page = page
      console.log("READ_DONE===>", preState)
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

const AppMenu = () => {
  const {
    token: {
      colorBgContainer,
    },
  } = theme.useToken();

  const columns: TableColumnsType<DataType> = [

    {
      title: '菜单名称',
      dataIndex: 'menu_name',
      key: 'menu_name',
    },
    // {
    //   title: 'URL',
    //   dataIndex: 'url',
    //   key: 'url',
    //   // width: '12%',
    // },
    // {
    //   title: '组件名称',
    //   dataIndex: 'element',
    //   // width: '30%',
    //   key: 'element',
    // },
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '#',
      dataIndex: 'pid',
      key: 'pid',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={(event: any) => showModel(event, record)}>编辑</a>
          <a onClick={(event: any) => showModel(event, record, 'add')}>添加</a>
          <a onClick={(event: any) => onDelete(event, record)}>删除</a>
        </Space>
      ),
    },
  ];

  const [formInstance, setFormInstance] = React.useState<FormInstance>();
  const dialogRef: any = React.useRef()

  const [state, dispatch] = React.useReducer(reducer, initialState)

  // 定义action 
  const dispatchF: React.Dispatch<any> = (action: any) => {
    // 判断action是不是函数，如果是函数，就执行,并且把dispatch传进去
    if (typeof action === 'function') {
      action(dispatch)
    } else {
      dispatch(action)
    }
  }

  const showModel = (event: any, data?: any, key?: any) => {
    console.log('showModel.data', data)
    if (key === 'add') {
      dispatch({
        type: 'SHOW_MODEL', payload: {
          open: true, entry: {
            id: data.id,
            menu_name: data.menu_name,
            pid: data.id
          }
        }
      })
    } else {
      dispatch({ type: 'SHOW_MODEL', payload: { open: true, entry: { ...data } } })
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
      getMenus()
    })
  }

  const onDelete = (event: any, data?: any) => {
    const onOk = () => new Promise<void>((resolve, reject) => {
      const { id } = data
      api.delete(id).then((r: any) => {
        const { status, statusText } = r
        if (status === 200 && statusText === 'OK') {
          message.success('操作成功')
          resolve(r.data)
        }
      }).catch((e: any) => {
        message.error('操作失败')
        reject()
      }).finally(() => {
        getMenus()
      })
    })

    // const completeLoading = ()
    // const onOk = () => new Promise<void>((resolve, reject) => {
    //   request({
    //     url: `/api/user/v1/article_category/${data.id}/`,
    //     method: 'DELETE',
    //   }).then((r: any) => {
    //     const { status, statusText
    //     } = r
    //     if (status === 200 && statusText === 'OK') {
    //       message.success('操作成功')
    //       resolve(r.data)
    //     }
    //   }).catch((e: any) => {
    //     message.error('操作失败')
    //     reject()
    //   })
    // }).then((r: any) => {
    // }).finally(() => {
    //   getMenus()
    // })

    confirm({
      title: '删除分类',
      icon: <ExclamationCircleFilled />,
      content: `确认删除该菜单名称${data.menu_name}吗？`,
      onOk,
      // onOk() {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      //   }).catch(() => console.log('Oops errors!'));
      // },
      // onCancel() { },
    });
  }

  const getMenus = () => {
    const { params } = state
    api.fetch(params).then((r: any) => {
      console.log('r===>', r)
      const { status, statusText } = r
      if (status === 200 && statusText == 'OK') {
        const { code, success, data: { data, page } } = r.data
        console.log("===getMenus===>", code, success, data, page)
        dispatch({
          type: 'READ_DONE',
          payload: {
            data, page
          }
        })
      }
    }).finally(() => {

    })
  }

  React.useEffect(() => getMenus(), [state.params])
  // React.useEffect(() => getMenus(), [])

  return (
    <React.Fragment>
      <div
        style={{
          height: '100vh',
          padding: '20px 20px',
          background: colorBgContainer
        }}
      >
        <MenuContext.Provider value={{ state, dispatch: dispatchF }}>
          <AppMenuSearch
            showModel={showModel}
            onFormInstanceReady={(instance: any) => {
              setFormInstance(instance);
            }}
          />
          <AppMenuTable
            columns={columns}
          />
          <AppMenuDialog
            ref={dialogRef}
            onSubmit={onSubmit}
          />
        </MenuContext.Provider>
      </div>

    </React.Fragment>
  )
}

export default AppMenu


