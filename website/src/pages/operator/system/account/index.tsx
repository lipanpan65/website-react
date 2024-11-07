import * as React from 'react'
import {
  theme,
  Space,
  message,
  Modal,
  Form,
  Input
} from 'antd'

import {
  useNavigate
} from 'react-router-dom'

import type { TableProps, FormInstance } from 'antd';

import { ExclamationCircleFilled } from '@ant-design/icons';

import { dateFormate, request } from '@/utils'
import AppContent from '@/components/AppContent';
import AppContainer from '@/components/AppContainer';
import AppSearch from '@/components/AppSearch';
import AppTable from '@/components/AppTable';
import AppDialog from '@/components/AppDialog';


const { confirm } = Modal;


interface AppUserInfoSearchProps {
  showModel: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  setQqueryParams: (params: any) => void;
}

const AppUserInfoSearch: React.FC<AppUserInfoSearchProps> = ({
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

interface UserInfoTableProps {
  data?: {
    page: PaginationProps;
    data: any;  // 数据数组，包含 id, name, description
  };
  columns?: any;  // 设置可选
  // onFormInstanceReady: (instance: FormInstance<any>) => void;
  onChange?: (pagination: PaginationProps, filters?: any, sorter?: any) => void;  // 新增 onChange 属性
}

const AppUserInfoTable: React.FC<UserInfoTableProps> = ({
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
          // rowKey={(record) => record.id}  // 自定义 rowKey 为 record.name
        />
      </AppContent>
    </React.Fragment>
  )
}

const AppUserInfoDialog = React.forwardRef((props: any, ref) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { onSubmit } = props
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null);
  const [formValues, setFormValues] = React.useState<any>({});

  const fields = [
    {
      name: 'category_name',
      label: '分类名称',
      rules: [{ required: true, message: '请输入分类名称' }],
      component: <Input placeholder="请输入分类名称" />,
    },
    {
      name: 'remark',
      label: '备注',
      component: <Input.TextArea placeholder="请输入备注" showCount maxLength={100} />,
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
    console.log("ok")
    formInstance?.validateFields()
      .then((values: any) => {
        if (formValues.id) {
          values["id"] = formValues.id
        }
        onSubmit(values)
      }).catch((e: any) => {
        console.log('e', e)
        return;
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
        setFormInstance={setFormInstance}  // 管理表单实例
        fields={fields}
        title='添加用户'
        onOk={onOk}
        onCancel={onCancel}
        open={open}
        onSubmit={handleSubmit}
      />
    </React.Fragment>
  );
});


const AppUserInfo = () => {
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
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色类型',
      dataIndex: 'role_type',
      key: 'role_type',
      // render: (text: any, _: any, __: any) => USER_ROLE_MAP[text]
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: '组织架构',
      dataIndex: 'orgs',
      key: 'orgs',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      // render: (text: any, _: any, __: boolean) => {
      //   return <Tag color={USER_STATUS_COLOR[text]}>{USER_STATUS[text]}</Tag>
      // }
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      // sorter: true,
      // 升序 1,2,3,4,5 ascending order
      // 降序 5,4,3,2,1 descending order
      // sortOrder: 'descend',
      render: (_: any, record: any) => (
        <Space size="middle">
          <a onClick={(event: any) => showModel(event, record)}>编辑</a>
          <a onClick={(event: any) => handleDelete(event, record)}>删除</a>
        </Space>
      ),
    },
  ];

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

  const showModel = (_: any, data?: any) => {
    dialogRef.current.showModel(true, data)
  }

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
      // getArticleCategory()
    })

    confirm({
      title: '删除分类',
      icon: <ExclamationCircleFilled />,
      content: `确认删除该分类${data.category_name}吗？`,
      onOk,
    });
  }

  /**
 * 按照顺序执行
 */
  React.useEffect(() => {
    console.log("加载数据")
  }, [queryParams])

  const onSubmit = (data: any) => {
    if (!!data.id) {
      console.log("更新")
      request({
        url: `/api/user/v1/article_category/${data.id}/`,
        method: 'PUT',
        data
      }).then((r: any) => {
        const { status, statusText } = r
        if (status === 200 && statusText === 'OK') {
          const { code, success } = r.data
          if (code === "0000") {
            message.success('操作成功')
          } else if (success === false) {
            message.error(r.data.message)
          }
        }
      }).finally(() => {
        dialogRef.current.setOpen(false)
        // 重新拉
        // getArticleCategory()
      })
    } else {
      request({
        url: `/api/user/v1/article_category/`,
        method: 'POST',
        data
      }).then((r: any) => {
        const { status, statusText
        } = r
        if (status === 200 && statusText === 'OK') {
          const { code, success } = r.data
          if (code === "0000") {
            message.success('操作成功')
          } else if (success === false) {
            message.error(r.data.message)
          }
        }
      }).finally(() => {
        // modelRef.current.setOpen(false)
        // 重新拉
        // getArticleCategory()
      })
    }
  }

  return (
    <AppContainer>
      <AppUserInfoSearch
        showModel={showModel}
        onFormInstanceReady={(instance: any) => {
          setFormInstance(instance);
        }}
        setQqueryParams={setQqueryParams}
      />
      <AppUserInfoTable
        onChange={onChange}
        columns={columns}
      />
      <AppUserInfoDialog
        ref={dialogRef}
        onSubmit={onSubmit}
      />

    </AppContainer>
  )
}

export default AppUserInfo