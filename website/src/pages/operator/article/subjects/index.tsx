import * as React from 'react';
import { Button, Form, FormInstance, Input, Row, Space, Table, TableProps, theme } from 'antd';
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
        // {...layout}
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

const Subject = () => {

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '专题名称',
      dataIndex: 'category_name',
      key: 'category_name',
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
    token: {
      colorBgContainer,
    },
  } = theme.useToken();

  const modelRef: any = React.useRef()
  const tableRef: any = React.useRef()
  const [queryParams, setQqueryParams] = React.useState<any>({})
  const [formInstance, setFormInstance] = React.useState<FormInstance>();

  const showModel = (event: any, data?: any) => {
    modelRef.current.showModel(true, data)
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
      </div>
    </React.Fragment>
  )
}

export default Subject