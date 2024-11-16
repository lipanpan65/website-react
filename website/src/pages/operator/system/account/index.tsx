import * as React from 'react'
import {
  theme,
  Space,
  message,
  Modal,
  Form,
  Input,
  Button
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
import { UserInfoProvider, useUserInfo } from '@/hooks/state/useUserInfo';
import { api } from '@/api';
import ConfirmableButton from '@/components/ConfirmableButton';


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
      label: '用户名称',
      name: 'category_name',
      rules: [{ required: true, message: '请输入分类名称' }],
      component: <Input placeholder="请输入分类名称" />,
      span: 12,
    },
    {
      label: 'OA',
      name: 'category_name',
      rules: [{ required: true, message: '请输入分类名称' }],
      component: <Input placeholder="请输入分类名称" />,
      span: 12,
    },
    {
      label: '手机号',
      name: 'category_name',
      rules: [{ required: true, message: '请输入分类名称' }],
      component: <Input placeholder="请输入分类名称" />,
      span: 12,
    },
    {
      label: '邮箱',
      name: 'category_name',
      rules: [{ required: true, message: '请输入分类名称' }],
      component: <Input placeholder="请输入分类名称" />,
      span: 12,
    },
    {
      label: '角色类型',
      name: 'category_name',
      rules: [{ required: true, message: '请输入分类名称' }],
      component: <Input placeholder="请输入分类名称" />,
      span: 12,
    },
    {
      label: '角色名称',
      name: 'category_name',
      rules: [{ required: true, message: '请输入分类名称' }],
      component: <Input placeholder="请输入分类名称" />,
      span: 12,
    },
    {
      label: '组织架构',
      name: 'category_name',
      rules: [{ required: true, message: '请输入分类名称' }],
      component: <Input placeholder="请输入分类名称" />,
      span: 24,
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
  const { state, enhancedDispatch } = useUserInfo();
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

  /**
 * 按照顺序执行
 */
  React.useEffect(() => {
    console.log("加载数据")
  }, [queryParams])

  const onSubmit = async (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    data: Record<string, any>
  ) => {
    // 确定请求方法
    const requestAction =
      actionType === 'DELETE'
        ? () => api.role.delete(data.id)
        : actionType === 'UPDATE'
          ? api.role.update
          : api.role.create;

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
      // await queryRole();
    }
  };

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


export default () => (
  <UserInfoProvider>
    <AppUserInfo />
  </UserInfoProvider>
);
