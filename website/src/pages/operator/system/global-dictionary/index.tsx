import * as React from 'react'

import {
  useNavigate
} from 'react-router-dom'

import AppContainer from '@/components/AppContainer'
import AppContent from '@/components/AppContent';
import AppSearch from '@/components/AppSearch';
import AppTable from '@/components/AppTable';
import { Form, FormInstance, Input, message, Modal, Select, Space, TableProps } from 'antd';
import { request } from '@/utils';

import { ExclamationCircleFilled } from '@ant-design/icons';
import AppDialog from '@/components/AppDialog';

const { confirm } = Modal;

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
export const GlobalContext = React.createContext<{
  state: typeof initialState,
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => { }
})

// TODO 优化
const api: any = {
  fetch: (params: any) => request({
    url: `/api/operator/v1/global/`,
    method: 'GET',
    params
  }),
  create: (data: any) => request({
    url: `/api/operator/v1/global/`,
    method: 'POST',
    data
  }),
  update: (data: any) => request({
    url: `/api/operator/v1/global/${data.id}`,
    method: 'PUT',
    data
  }),
  entry: (id: any) => request({
    url: `/api/operator/v1/global/${id}`,
    method: 'GET',
  }),
  delete: (id: any) => request({
    url: `/api/operator/v1/global/${id}`,
    method: 'DELETE',
  }),
}

interface AppGlobalDictSearchProps {
  showModel: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  setQqueryParams: (params: any) => void;
}

const AppGlobalDictSearch: React.FC<AppGlobalDictSearchProps> = ({
  showModel,
  onFormInstanceReady,
  setQqueryParams,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    onFormInstanceReady(form);
  }, []);

  const handleSearchClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('搜索按钮点击');
    // 你可以在这里添加显示模态框的逻辑，例如调用 showModel
  };

  const buttonConfig = {
    label: '添加',
    type: 'primary' as const,  // 明确指定类型以符合 ButtonConfig
    onClick: (event: React.MouseEvent<HTMLElement>) => showModel(event, {}),
    // 你可以添加更多的 Button 属性，如 disabled, icon 等
    disabled: false,
    // icon: <SomeIcon />,  // 例如使用 Ant Design 的图标
  };

  return (
    <React.Fragment>
      <AppContent>
        <AppSearch
          buttonConfig={buttonConfig}  // 动态按钮配置
          onFormInstanceReady={(form) => console.log('Form instance ready:', form)}
          setQueryParams={(params) => console.log('Query params:', params)}
          formItems={[
            {
              // label: '搜索',
              name: 'search',
              placeholder: '请输入...',
              type: 'input',
            },
            {
              name: 'category',
              placeholder: '请选择分类',
              type: 'select',
              width: 150,
              selectConfig: {
                allowClear: true,
                options: [
                  { label: '科技', value: 'tech' },
                  { label: '健康', value: 'health' },
                ],
              },
            },
          ]}
        />
      </AppContent>
    </React.Fragment>
  )
}


const AppGlobalDictDialog = React.forwardRef((props: any, ref) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { onSubmit } = props
  const context = React.useContext(GlobalContext)
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null);
  const [formValues, setFormValues] = React.useState<any>({});

  const fields = [
    {
      label: '字典名称',
      name: 'category_name',
      rules: [{ required: true, message: '请输入字典名称' }],
      component: <Input placeholder="请输入字典名称" />,
      span: 12,  // 使字段占据一半宽度
    },
    {
      label: 'ckey',
      name: 'ckey',
      rules: [{ required: true, message: '请输入ckey' }],
      component: <Input placeholder="请输入ckey" />,
      span: 12,  // 使字段占据一半宽度
    },
    {
      label: 'cvalue',
      name: 'cvalue',
      rules: [{ required: true, message: '请输入cvalue' }],
      component: <Input placeholder="请输入cvalue" />,
      span: 12,  // 使字段占据一半宽度
    },
    {
      label: '状态',
      name: 'enable',
      component: (
        <Select placeholder="请选择状态">
          <Select.Option value="active">激活</Select.Option>
          <Select.Option value="inactive">未激活</Select.Option>
        </Select>
      ),
      span: 12,  // 使字段占据一半宽度
    },
    {
      name: 'remark',
      label: '备注',
      component: <Input.TextArea placeholder="请输入备注" showCount maxLength={100} />,
      span: 24,  // 使字段占据一半宽度
    },
  ];

  const showModel = (open: boolean, data?: any) => {
    setOpen(open);
    if (data) {
      // setFormValues(() => data)
    }
  };

  const handleSubmit = (values: any) => {
    console.log('提交的数据:', values);
  };

  React.useEffect(() => {
    if (formInstance) {
      formInstance.setFieldsValue({ ...formValues });
    }
  }, [formInstance, formValues]);
  
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

  // const onOk = () => {
  //   formInstance?.validateFields()
  //     .then((values: any) => {
  //       if (formValues.id) {
  //         values["id"] = formValues.id
  //       }
  //       onSubmit(values)
  //     }).catch((e: any) => {
  //       console.log('e', e)
  //       return;
  //     })
  // }

  const onCancel = () => {
    formInstance?.resetFields();
    setOpen(false)
  }

  React.useImperativeHandle(ref, () => ({
    showModel,
    onOk,
    onCancel
  }));

  return (
    <React.Fragment>
      <AppDialog
        title='添加字典'
        fields={fields}
        onOk={onOk}
        onCancel={onCancel}
        open={open}
        onSubmit={handleSubmit}
        setFormInstance={setFormInstance}  // 管理表单实例
      />
    </React.Fragment>
  );
});


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

interface AppGlobalDictProps {
  data?: {
    page: PaginationProps;
    data: any;  // 数据数组，包含 id, name, description
  };
  columns?: any;  // 设置可选
  onChange?: (pagination: PaginationProps, filters?: any, sorter?: any) => void;  // 新增 onChange 属性
}

const AppGlobalDictTable: React.FC<AppGlobalDictProps> = ({
  data = {
    page: {
      total: 0,
      current: 1,
      pageSize: 5
    },
    data: []
  },
  columns = [], // 设置默认值为空数组
  onChange
}) => {
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (onChange) {
      onChange(pagination, filters, sorter);  // 确保 onChange 已定义
    }
  };
  return (
    <React.Fragment>
      <AppContent>
        <AppTable
          data={data}
          columns={columns}
          onChange={handleTableChange}
          loading={false}
          rowKey={(record) => record.id}  // 自定义 rowKey 为 record.name
        />
      </AppContent>
    </React.Fragment>
  )
}

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

const AppGlobalDict = () => {

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

  const dialogRef: any = React.useRef()
  const dataTableRef: any = React.useRef()
  const navigate = useNavigate()
  const [formInstance, setFormInstance] = React.useState<FormInstance>();
  const [queryParams, setQqueryParams] = React.useState<any>({})
  const [loading, setLoading] = React.useState<boolean>()

  const columns: TableProps<any>['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      sorter: true
    },
    {
      title: '字典名称',
      dataIndex: 'cname',
      key: 'cname',
    },
    {
      title: 'ckey',
      dataIndex: 'ckey',
      key: 'ckey',
    },
    {
      title: 'cvalue',
      dataIndex: 'cvalue',
      key: 'cvalue',
      // render: (text: any, _: any, __: any) => USER_ROLE_MAP[text]
    },
    {
      title: '状态',
      dataIndex: 'enable',
      key: 'enable',
      // render: (text: any, _: any, __: boolean) => {
      //   return <Tag color={USER_STATUS_COLOR[text]}>{USER_STATUS[text]}</Tag>
      // }
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      // sortOrder: 'descend',
      render: (_: any, record: any) => (
        <Space size="middle">
          <a onClick={(event: any) => showModel(event, record)}>编辑</a>
          <a onClick={(event: any) => handleDelete(event, record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleDelete = (event: any, data?: any) => {
    const onOk = () => new Promise<void>((resolve, reject) => {
      request({
        url: `/api/user/v1/article_category/${data.id}/`,
        method: 'DELETE',
      }).then((r: any) => {
        const { status, statusText
        } = r
        if (status === 200 && statusText === 'OK') {
          message.success('操作成功')
          resolve(r.data)
        }
      }).catch((e: any) => {
        message.error('操作失败')
        reject()
      })
    }).then((r: any) => {
    }).finally(() => {
      dialogRef.current.setOpen(false)
    })

    confirm({
      title: '删除分类',
      icon: <ExclamationCircleFilled />,
      content: `确认删除该分类${data.category_name}吗？`,
      onOk,
    });
  }

  const showModel = (_: any, data?: any) => {
    dialogRef.current.showModel(true, data)
  }

  const onChange = (pagination: any) => {
    setLoading(true)
    setQqueryParams((preQueryParams: any) => {
      return {
        ...preQueryParams,
        page: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    })
  }

  const queryGlobalDict = () => {
    const { params } = state
    api.fetch(params).then((r: any) => {
      const { status, statusText } = r
      if (status === 200 && statusText == 'OK') {
        const { code, success, data: { data, page } } = r.data
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

  React.useEffect(() => queryGlobalDict(), [state.params])

  // submit 方法
  const onSubmit = (dispatch: React.Dispatch<any>, data: any) => {
    dispatch({ type: 'CREATE', payload: { data } })
    api.create(data).then((r: any) => {
      console.log('onSubmit.r===>', r)
    }).finally(() => {
      queryGlobalDict()
    })
  }

  // const onSubmit = (data: any) => {
  //   if (!!data.id) {
  //     console.log("更新")
  //     request({
  //       url: `/api/user/v1/article_category/${data.id}/`,
  //       method: 'PUT',
  //       data
  //     }).then((r: any) => {
  //       const { status, statusText } = r
  //       if (status === 200 && statusText === 'OK') {
  //         const { code, success } = r.data
  //         if (code === "0000") {
  //           message.success('操作成功')
  //         } else if (success === false) {
  //           message.error(r.data.message)
  //         }
  //       }
  //     }).finally(() => {
  //       dialogRef.current.setOpen(false)
  //       // getArticleCategory()
  //     })
  //   } else {
  //     request({
  //       url: `/api/user/v1/article_category/`,
  //       method: 'POST',
  //       data
  //     }).then((r: any) => {
  //       const { status, statusText
  //       } = r
  //       if (status === 200 && statusText === 'OK') {
  //         const { code, success } = r.data
  //         if (code === "0000") {
  //           message.success('操作成功')
  //         } else if (success === false) {
  //           message.error(r.data.message)
  //         }
  //       }
  //     }).finally(() => {
  //       // modelRef.current.setOpen(false)
  //       // 重新拉
  //       // getArticleCategory()
  //     })
  //   }
  // }

  return (
    <GlobalContext.Provider value={{ state, dispatch: dispatchF }}>
      <AppContainer>
        <AppGlobalDictSearch
          showModel={showModel}
          onFormInstanceReady={(instance: any) => {
            setFormInstance(instance);
          }}
          setQqueryParams={setQqueryParams}
        />
        <AppGlobalDictTable
          onChange={onChange}
          columns={columns}
        />
        <AppGlobalDictDialog
          ref={dialogRef}
          onSubmit={onSubmit}
        />
      </AppContainer>
    </GlobalContext.Provider>
  )
}

export default AppGlobalDict