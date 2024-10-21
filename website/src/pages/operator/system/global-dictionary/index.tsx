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

import { useGlobalDict, GlobalProvider } from '@/hooks/state/useGlobalDict';

import { ExclamationCircleFilled } from '@ant-design/icons';
import AppDialog from '@/components/AppDialog';
import { api } from '@/api';

const { confirm } = Modal;

// 假设有一个接口类型定义
interface GlobalDictResponse {
  code: number;
  message: string;
  data: {
    data: any[];
    page: {
      total: number;
      current: number;
      pageSize: number;
    };
  };
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
  const { state, dispatchF } = useGlobalDict();
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null);
  const [formValues, setFormValues] = React.useState<any>({});

  const fields = [
    {
      label: '字典名称',
      name: 'cname',
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
      label: '状态',
      name: 'enable',
      component: (
        <Select placeholder="请选择状态">
          <Select.Option value="1">启用</Select.Option>
          <Select.Option value="0">禁用</Select.Option>
        </Select>
      ),
      span: 12,  // 使字段占据一半宽度
    },
    {
      label: 'cvalue',
      name: 'cvalue',
      rules: [{ required: true, message: '请输入cvalue' }],
      component: <Input placeholder="请输入cvalue" />,
      span: 24,  // 使字段占据一半宽度
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
      .then((record: any) => {
        dispatchF((f: any) => onSubmit(f, {
          ...record,
          // pid
        }))
      }).finally(() => {
        dispatchF({
          type: 'SHOW_MODEL', payload: {
            open: false
          }
        })
      })
  }

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
  // data = {
  //   page: {
  //     total: 0,
  //     current: 1,
  //     pageSize: 5
  //   },
  //   data: []
  // },
  columns = [], // 设置默认值为空数组
  onChange
}) => {
  // const context = React.useContext(GlobalContext)
  const { state, dispatchF } = useGlobalDict();

  const { page, data, } = state

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
          loading={false}
          rowKey={(record) => record.id}  // 自定义 rowKey 为 record.name
        />
      </AppContent>
    </React.Fragment>
  )
}


const AppGlobalDict = () => {
  const { state, dispatchF } = useGlobalDict();
  const dialogRef: any = React.useRef()
  const dataTableRef: any = React.useRef()
  const navigate = useNavigate()
  const [formInstance, setFormInstance] = React.useState<FormInstance>();
  const [queryParams, setQqueryParams] = React.useState<any>({})
  const [loading, setLoading] = React.useState<boolean>()

  const columns: TableProps<any>['columns'] = [
    {
      title: '#', dataIndex: 'id', key: 'id', sorter: true,
    },
    {
      title: '字典名称', dataIndex: 'cname', key: 'cname',
    },
    {
      title: 'ckey', dataIndex: 'ckey', key: 'ckey',
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

  const queryGlobalDict = async () => {
    try {
      const { params } = state;
      const response = await api.globalDict.fetch(params);
      if (response && response.success) {
        const { data, page } = response.data;
        dispatchF({ type: 'READ_DONE', payload: { data, page } });
      } else {
        message.error(response?.message || '获取数据失败');
      }
    } catch (error) {
      message.error('请求失败，请稍后重试');
    }
  };

  React.useEffect(() => {
    (async () => {
      await queryGlobalDict(); // 直接调用异步函数
    })();
  }, [state.params]);


  // submit 方法
  const onSubmit = (dispatch: React.Dispatch<any>, data: any) => {
    dispatch({ type: 'CREATE', payload: { data } })
    api.globalDict.create(data).then((r: any) => {
      console.log('onSubmit.r===>', r)
    }).finally(() => {
      queryGlobalDict()
    })
  }

  return (
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
  )
}

// export default AppGlobalDict
// 使用 GlobalProvider 包裹主组件
export default () => (
  <GlobalProvider>
    <AppGlobalDict />
  </GlobalProvider>
);