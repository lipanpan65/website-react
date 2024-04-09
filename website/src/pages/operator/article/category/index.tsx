import * as React from 'react'
import {
  Button, Col,
  Form,
  Input, Modal, Radio, Row, Space, Table, Tag, message, theme
} from 'antd'
import type { TableProps, FormInstance } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { request } from '@/utils';
import { resolve } from 'path';
import { reject } from 'lodash';
// import { resolve } from 'path';
// import { reject } from 'lodash';
// import { Action, Form } from 'antd-pro-max';

const { confirm } = Modal;


const api = {
  fetch: (params?: any) => request({
    url: `/api/user/v1/article_category`,
    method: 'GET',
    params
  }).then((r: any) => {
    const { status, statusText } = r
    if (status === 200 && statusText === 'OK') {
      // resolve(r.data)
      return r.data
    } else {
      return r.data
      // reject(r.data)
    }
  }).catch((e: any) => e)
}




// type FormInstance

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


// TODO 基于 props 的方式实现
const CategorySearch = (props: any) => {
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
    console.log('sss')
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
      // style={{ maxWidth: 600 }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}>
            <Form.Item
              name="search" label="搜索" rules={[{ required: false }]}>
              <Input
                // onPressEnter={onPressEnter}
                onPressEnter={(e: any) => onPressEnter(e, 'search')}
                onFocus={() => { console.log('onFocus') }}
                onBlur={() => { console.log('onBlur') }}

              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={showModel}>添加</Button>
          </Col>
        </Row>
      </Form>
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


const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York',
    // address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No',
    tags: ['cool', 'teacher'],
  },
];

// interface CategoryTableProps {
//   data: any,
//   columns: any,
//   onFormInstanceReady: (instance: FormInstance<ArticleCategory>) => void;
// }

const CategoryTable = (props: any) => {
  const { data: { page, data }, columns, onChange, loading } = props

  // 分页参数
  const pagination = {
    total: page?.total || 0, // 数据总数
    current: page?.current || 1, // 当前页码
    pageSize: page?.pageSize || 5, // 每页显示条数
    // showSizeChanger: true, // 是否显示 pageSize 改变器
    // showQuickJumper: true, // 是否显示快速跳转
    showTotal: (total: number) => `总共 ${total} 条数据`, // 自定义显示总数的格式
  };


  return (
    <React.Fragment>
      <Table
        loading={loading}
        onChange={onChange}
        pagination={pagination}
        columns={columns}
        dataSource={data} />

    </React.Fragment>
  )
}

interface ArticleCategory {
  category_name?: string;
  remark?: string;
}

interface CategoryModelProps {
  ref: null;
  open: boolean;
  onOK: (values: ArticleCategory) => void;
  onCancel: () => void;
  initialValues: ArticleCategory;
}

interface ModelFormProps {
  initialValues: ArticleCategory;
  onFormInstanceReady: (instance: FormInstance<ArticleCategory>) => void;
}

const ModelForm: React.FC<ModelFormProps> = ({
  initialValues,
  onFormInstanceReady,
}) => {
  const [form] = Form.useForm();

  // 组件渲染完成将组件回传给 ModelForm
  React.useEffect(() => {
    onFormInstanceReady(form);
  }, []);

  const onResetFields = () => {
    form.resetFields();
  };

  const onSetFields = (data: any) => {
    form.setFieldsValue({ ...data })
  }

  return (
    <React.Fragment>
      <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
        <Form.Item
          name="category_name"
          label="分类名称"
          rules={[{
            required: true, message: '请输入分类名称',
            validator: (_, value) => new Promise((resolve, reject) => {
              if (value === 'sss') {
                resolve(value);
              } else {
                reject('ssss')
              }
            })
            // return new Promise((resolve, reject) => {

            // })
            // return Promise.resolve();

            // return Promise.reject(new Error('The new password that you entered do not match!'));
            // },
          }]}
        >
          <Input
            placeholder='请输入分类名称'
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
// React.FC<CategoryModelProps>
const CategoryModel: any = React.forwardRef((props: any, ref: any) => {
  const { initialValues, onSubmit } = props
  const [open, setOpen] = React.useState<boolean>(false);
  // 将 formInstance 回传到组件中
  const [formInstance, setFormInstance] = React.useState<FormInstance>();
  // TODO 是否更换变量名称
  const [formValues, setFormValues] = React.useState<any>({})

  React.useEffect(() => {
    console.log('======经典======', formValues)
    formInstance?.setFieldsValue({ ...formValues })
  }, [formInstance, data])

  const showModel = (open: boolean, data?: any) => {
    Promise.resolve().then(() => {
      console.log('---> open')
      setOpen(preState => open)
    }).then(() => {
      console.log('---> set')
      if (data) {
        setFormValues(() => data)
      }
    })
  }

  const onOk = () => {
    // context.dispatch({ type: 'PUBLISH', payload: {} })
    // console.log(formRef)
    // try {
    //   const values = await formInstance?.validateFields()
    //   onSubmit(values)
    // } catch (error) {
    //   console.log('Failed:', error);
    // }

    formInstance?.validateFields()
      .then((values: any) => {
        console.log("values", values)
        // context.dispatch({ type: 'PUBLISH', payload: values })
        // if (!formValues.id) {
        //   values["id"] = formValues.id
        // }
        // props.onSubmit(values)
        onSubmit(values)
      }).catch((e) => {
        console.log('e', e)
        return;
      })
  }

  const onCancel = () => {
    formInstance?.resetFields();
    setOpen(false)
  }

  // 仅仅需要处理一些回掉即可
  const afterOpenChange = (open: any) => {
    console.log('afterOpenChange', open)
    console.log('afterOpenChange', formValues)
    formInstance?.setFieldsValue({
      ...formValues
    })
  }

  React.useImperativeHandle(ref, () => ({
    onOk,
    onCancel,
    setOpen,
    showModel,
    setFormValues
  }))

  return (
    <React.Fragment>
      <Modal
        open={open}
        title="创建文章分类"
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
          initialValues={initialValues}
          onFormInstanceReady={(instance) => {
            setFormInstance(instance);
          }}
        />
      </Modal>
    </React.Fragment>
  )
})


const ArticleCategory = () => {

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '分类名称',
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
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={(event: any) => showModel(event, record)}>编辑</a>
          <a onClick={(event: any) => onDelete(event, record)}>删除</a>
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
  const [formValues, setFormValues] = React.useState<ArticleCategory>();
  const [data, setData] = React.useState([])
  // const [modelInstance, setModelInstance] = React.useState<any>();
  const [queryParams, setQqueryParams] = React.useState<any>({})
  const [formInstance, setFormInstance] = React.useState<FormInstance>();
  const [loading, setLoading] = React.useState<boolean>()

  // const onOK = (values: Values) => {
  //   console.log('Received values of form: ', values);
  //   setFormValues(values); // 讲 存入 该组件中
  //   setOpen(false);
  // };

  // pagination, filters, sorter, extra: { currentDataSource: [], action: paginate | sort | filter }
  const onChange = (pagination: any) => {
    setLoading(true)
    // Promise.name
    console.log('onChange')
    // TODO 这里是异步执行的 https://blog.csdn.net/weixin_41697143/article/details/81837076
    // https://blog.csdn.net/qq_37581764/article/details/134213648
    // setTimeout(() => {
    //   console.log('onChange==doing')
    //   setLoading(true)
    //   console.log('onChange==doing')
    // }, 1000)
    console.log('onChange==done')
    // completeLoading = ()
    console.log('onChange===>', pagination)
    setQqueryParams((preQueryParams: any) => {
      return {
        ...preQueryParams,
        page: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    })
    // getArticleCategory()
  }

  const getArticleCategory = () => {
    api.fetch(queryParams).then((r: any) => {
      console.log('r===>', r)
      const { code, success, data } = r
      setData(data)
    }).finally(() => {
      setLoading(false)
    })
    // request({
    //   url: `/api/user/v1/article_category`,
    //   method: 'GET',
    // }).then((r: any) => {
    //   console.log(r)
    //   const { status, statusText
    //   } = r
    //   if (status === 200 && statusText === 'OK') {
    //     const { code, success, data: { page, data } } = r.data
    //     if (code === "0000") {
    //       setData(data)
    //     } else if (success === false) {
    //       message.error(r.data.message)
    //     }
    //   }
    // })
  }


  const onDelete = (event: any, data?: any) => {
    // const completeLoading = ()
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
      // console.log('r==>', r)
    }).finally(() => {
      modelRef.current.setOpen(false)
      getArticleCategory()
    })

    confirm({
      title: '删除分类',
      icon: <ExclamationCircleFilled />,
      content: `确认删除该分类${data.category_name}吗？`,
      onOk,
      // onOk() {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      //   }).catch(() => console.log('Oops errors!'));
      // },
      // onCancel() { },
    });
  }

  const onSubmit = (data: any) => {
    console.log('onSubmit', data)
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
        modelRef.current.setOpen(false)
        // 重新拉
        getArticleCategory()
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
        modelRef.current.setOpen(false)
        // 重新拉
        getArticleCategory()
      })
    }
  }

  const showModel = (event: any, data?: any) => {
    modelRef.current.showModel(true, data)
  }

  /**
   * 按照顺序执行
   */
  React.useEffect(() => {
    console.log('组件加载queryParams', queryParams)
    console.log('-queryParams-', queryParams)
    getArticleCategory()
  }, [queryParams])

  React.useEffect(() => {
    console.log('组件加载')
    return () => {
      console.log('组件销毁')
    }
  }, [])

  return (
    <React.Fragment>
      <div style={{
        height: '100vh',
        padding: '0 20px',
        background: colorBgContainer
      }}>
        {/* <Button type="primary" onClick={(event: any) => showModel(event)}>添加</Button> */}
        <CategorySearch
          showModel={showModel}
          onFormInstanceReady={(instance: any) => {
            setFormInstance(instance);
          }}
          setQqueryParams={setQqueryParams}
        />
        <CategoryTable
          ref={tableRef}
          data={data}
          columns={columns}
          onChange={onChange}
          loading={loading}
        />
        <CategoryModel
          ref={modelRef}
          open={open}
          onSubmit={onSubmit}
          // onOK={onOK}
          // onCancel={() => setOpen(false)}
          initialValues={{ modifier: 'public' }}
        />
      </div>

    </React.Fragment>
  )

}

export default ArticleCategory