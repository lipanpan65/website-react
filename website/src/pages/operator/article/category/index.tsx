import * as React from 'react'
import { Button, Col, Form, Input, Modal, Radio, Row, Space, Table, Tag, message, theme } from 'antd'
import type { TableProps, FormInstance } from 'antd';
import { request } from '@/utils';

// type FormInstance

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


const CategorySearch = () => {

  const [form] = Form.useForm();

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

  return (
    <React.Fragment>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
      // style={{ maxWidth: 600 }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}>
            <Form.Item
              name="" label="搜索" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button type="primary">添加</Button>
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


const CategoryTable = (props: any) => {
  const { data } = props

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
          <a>删除</a>
        </Space>
      ),
    },
  ];

  const showModel = (event: any, record: any) => {
    console.log('showModel', event)
    console.log('record', record)
  }


  return (
    <React.Fragment>
      <Table columns={columns} dataSource={data} />
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

  return (
    <React.Fragment>
      <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
        <Form.Item
          name="category_namesss"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
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
        {/* <Form.Item name="modifier" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item> */}
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
        // values["id"] = record.id
        // props.onSubmit(values)
        onSubmit(values)
      }).catch((e) => {
        console.log('e', e)
        return;
      })
    // .finally(() => {
    //   setOpen(false)
    // })
  }

  const onCancel = () => {
    formInstance?.resetFields();
    setOpen(false)
  }

  React.useImperativeHandle(ref, () => ({
    onOk,
    onCancel,
    setOpen
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

  // const [open, setOpen] = React.useState(false);
  const {
    token: {
      colorBgContainer,
    },
  } = theme.useToken();

  const modelRef: any = React.useRef()
  const tableRef: any = React.useRef()

  const [formValues, setFormValues] = React.useState<ArticleCategory>();
  const [data, setData] = React.useState([])
  const [page, setPage] = React.useState()

  const [modelInstance, setModelInstance] = React.useState<any>();

  // const onOK = (values: Values) => {
  //   console.log('Received values of form: ', values);
  //   setFormValues(values); // 讲 存入 该组件中
  //   setOpen(false);
  // };

  const getArticleCategory = () => {
    request({
      url: `/api/user/v1/article_category`,
      method: 'GET',
    }).then((r: any) => {
      console.log(r)
      const { status, statusText
      } = r
      if (status === 200 && statusText === 'OK') {
        const { code, success, data: { page, data } } = r.data
        // console.log(code, data)
        if (code === "0000") {
          setData(data)
        } else if (success === false) {
          message.error(r.data.message)
        }
      }
    })
  }

  const onSubmit = (data: ArticleCategory) => {
    console.log('onSubmit', data)
    request({
      url: `/api/user/v1/article_category/`,
      method: 'POST',
      data
    }).then((r: any) => {
      console.log('创建成功', r)
      const { status, statusText
      } = r
      if (status === 200 && statusText === 'OK') {
        debugger
        const { code, success, 
          // data: { page, data } 
        } = r.data
        // console.log(code, data)
        if (code === "0000") {
          console.log('r.data',r.data)
          const {page,data} = r.data
          setData(data)
        } else if (success === false) {
          message.error(r.data.message)
        }
      }

    }).finally(() => {
      modelRef.current.setOpen(false)
    })
  }

  const setClick = () => {
    console.log('ss')
    modelRef.current.setOpen(true)
  }

  React.useEffect(() => {
    getArticleCategory()
  }, [])

  return (
    <React.Fragment>
      <div style={{
        height: '100vh',
        padding: '0 20px',
        background: colorBgContainer
      }}>
        <Button type="primary" onClick={setClick}>添加</Button>
        <CategorySearch

        />
        <CategoryTable
          ref={tableRef}
          data={data}
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