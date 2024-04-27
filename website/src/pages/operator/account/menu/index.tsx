
import * as React from 'react'
import { Button, Col, Form, Input, Modal, Row, Table, theme } from 'antd'

import type { FormInstance, TableColumnsType, TableProps } from 'antd';
import { request } from '@/utils';

type TableRowSelection<T> = TableProps<T>['rowSelection'];

interface DataType {
  key: React.ReactNode;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
}

// 初始化参数
const initialState = {
  // tip: '文章自动保存草稿中...',
  loading: false,
  open: false,
  article: {
    id: null,
    title: null,
    content: null,
    summary: null,
    html: null
  },
  options: []
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

/**
 * 菜单管理
 * @returns 
 */

const AppMenuSearch = (props: any) => {
  const { onFormInstanceReady, showModel, setQqueryParams } = props

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
    console.log('onPressEnter') // 优先执行
    const name = 'lipanpan'
    const info = {
      [name]: 'nan',
      age: 18
    }
    console.log(info)
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

const columns: TableColumnsType<DataType> = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '路由地址',
    dataIndex: 'url',
    key: 'url',
    // width: '12%',
  },
  {
    title: '组件名称',
    dataIndex: 'element',
    // width: '30%',
    key: 'address',
  },
];


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

const AppMenuTable = () => {
  const [checkStrictly, setCheckStrictly] = React.useState(false);

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
  React.useEffect(() => onFormInstanceReady(form), [])

  return (
    <React.Fragment>
      <Form form={form} name="form_in_modal" initialValues={{}}>
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
              label="路由地址"
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
  console.log("context", context)
  // const [open, setOpen] = React.useState<boolean>(false);
  const [formInstance, setFormInstance] = React.useState<FormInstance>();

  const onOk = () => {
    formInstance?.validateFields()
      .then((values: any) => {
        // onSubmit(values)
        context.dispatch((f: any) => onSubmit(f, values))
        // context.dispatch({ type: 'CREATE', payload: values })
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
        open={context.state.open}
        title="创建菜单"
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
      preState.loading = true
      return {
        ...preState
      }
    case 'READ_DONE':
      preState.loading = false
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
      const { open, data } = action.payload
      preState.open = open
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

  const showModel = (event: any, data?: any) => {
    dispatch({ type: 'SHOW_MODEL', payload: { open: true } })
  }

  // submit 方法
  const onSubmit = (dispatch: React.Dispatch<any>, data: any) => {
    console.log('dispatch', dispatch)
    console.log('data', data)
    dispatch({ type: 'CREATE', payload: { data } })
    request({
      url: `/api/user/v1/account/menus/`,
      method: 'POST',
      data
    }).then((r: any) => {
    }).finally(() => {
      dispatch({ type: 'READ_DOWN', payload: { data } })
    })
  }


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
          <AppMenuTable />
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


