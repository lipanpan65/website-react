import * as React from 'react';
import {
  Col,
  Row,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Space,
  Radio, Tag,
  Switch,
  message,
  Select,
  SelectProps,
  type FormInstance
} from 'antd'

import { dateFormate, request } from '@/utils'

import { EditArticleContext } from './index'
import { useNavigate } from 'react-router-dom';

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

interface Values {
  title?: string;
  description?: string;
  modifier?: string;
}

interface DaliogFormProps {
  options: [];
  initialValues: any;
  onFormInstanceReady: (instance: FormInstance) => void;
}

const ModelForm: React.FC<DaliogFormProps> = ({
  initialValues,
  options,
  onFormInstanceReady,
}) => {
  const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } }
  const [form] = Form.useForm();
  const context = React.useContext(EditArticleContext)

  React.useEffect(() => {
    console.log('ModelForm===>', 'ModelForm')
  }, [])

  React.useEffect(() => {
    onFormInstanceReady(form);
  }, []);


  const onResetFields = () => form.resetFields()

  const onSetFieldsValue = (values: any) => {
    form.setFieldsValue({ ...values })
  }

  return (
    <React.Fragment>
      <Form form={form}
        initialValues={{
          summary: context.state.article.summary
        }}
      // layout={'vertical'}
      >
        <Row gutter={[16, 0]}>
          <Col span={20} >
            <Form.Item label="分类"
              name="category_id"
              {...formLayout}
              rules={[
                { required: true, message: '请输入分类名称' },
                // { validator: validateNameExists }
              ]}
            >
              <Select
                allowClear
                // labelInValue={true}
                // style={{ width: 120 }}
                // onChange={handleChange}
                placeholder='请选择分类'
                // options={[
                // { value: 'jack', label: 'Jack' },
                // { value: 'lucy', label: 'Lucy' },
                // { value: 'Yiminghe', label: 'yiminghe' },
                // { value: 'disabled', label: 'Disabled', disabled: true },
                // ]}
                options={options}
              />
            </Form.Item>
          </Col>

          {/* <Col span={20}>
            <Form.Item
              label="添加标签"
              {...formLayout}
              // labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}
              name={"ckey"}
              rules={[{ required: true, message: '请输入key' }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="请搜索添加标签"
                // defaultValue={['a10', 'c12']}
                // onChange={handleChange}
                options={options}
              />
            </Form.Item>
          </Col> */}
          {/* <Input placeholder="请输入key" /> */}

          <Col span={20}>
            <Form.Item label="编辑摘要"
              {...formLayout}
              // labelCol={{ span: 3 }}
              // wrapperCol={{ span: 21 }}
              name="summary"
              rules={[
                { type: 'string', max: 1000, message: '备注信息字数不能超过1000' },
              ]}
            >
              <Input.TextArea placeholder="请输入备注信息" />
            </Form.Item>
          </Col>
          {/*           
          <Col span={20} >
            <Form.Item name="ctype" label="类型" {...formLayout}
              rules={[
                { required: true, message: '请输入类型' },
                {
                  validator: async (_: any, value, callback: any) => {
                    // if (!isUpdate) {
                    //   const res: any = await request({
                    //     url: '/api/operation/base/dict/validate_ctype',
                    //     method: 'GET',
                    //     params: { 'ctype': value }
                    //   })
                    //   if (res.status === 200) {
                    //     const { exists } = res.data
                    //     if (!exists) {
                    //       if (callback) callback();
                    //       return Promise.resolve()
                    //     } else {
                    //       return Promise.reject([new Error('类型已存在')])
                    //     }
                    //   }
                    // }
                  },
                }
              ]}
            >
              {isUpdate ? <span>{`${data.ctype}`}</span> : <Input placeholder='请输入名称' />}
            </Form.Item>
          </Col> */}
          {/* <Col span={22}>
            <Form.Item
              label="value"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              name={"cvalue"}
              rules={[{
                required: true,
                message: '请输入Value'
              }]}
            >
              <Input.TextArea placeholder="请输入Value" />
            </Form.Item>
          </Col> */}

          {/* <Col span={22}>
            <Form.Item
              valuePropName="checked"
              label="状态"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              name={"status"}
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
            </Form.Item>
          </Col> */}
          {/* {
            isUpdate ? (
              <React.Fragment>
                <Col span={11}>
                  <Form.Item label="更新人"
                    {...formLayout}
                  >
                    {data.update_user && data.update_user}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="更新时间"
                    {...formLayout}
                  >
                    {dateFormate(formRef.current?.getFieldValue("update_time"))}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="创建人"
                    {...formLayout}
                  >
                    {formRef.current?.getFieldValue("create_user")}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    label="创建时间"
                    {...formLayout}
                  >
                    {dateFormate(formRef.current?.getFieldValue("create_time"))}
                  </Form.Item>
                </Col>
              </React.Fragment>
            ) : null
          } */}
        </Row>
      </Form>
    </React.Fragment>
  )
}


const Publish = React.forwardRef((props: any, ref: any) => {
  const context = React.useContext(EditArticleContext)
  const [open, setOpen] = React.useState<boolean>(false);
  const navigator = useNavigate()
  const [formInstance, setFormInstance] = React.useState<FormInstance>();
  const [formValues, setFormValues] = React.useState<any>({})
  const [options, setOptions] = React.useState<any>()
  const [initialValues, setInitialValues] = React.useState<any>(() => ({
    summary: context.state.article.summary
  }))

  // console.log('initialValues===>', initialValues)

  const publishArticle = (dispatch: React.Dispatch<any>, values: any) => {
    dispatch({ type: 'PUBLISH', payload: values })
    console.log('publishArticle===>', values)
    const id = context.state.article.id
    // https://juejin.cn/post/7156123099522400293
    request({
      url: `/api/user/v1/article/${id}/publish/`,
      method: 'POST',
      data: { ...values },
    }).then((r: any) => {
      dispatch({ type: 'READ_DONE', payload: values })
      navigator(`/user/article/overview`, {
        // replace: true
        state: {
          // id: article.id,
          // status: 'draft',
        }
      })
      console.log('r===>', r)
    })

    // setTimeout(() => {
    //   dispatch({ type: 'PUBLISH', payload: values })
    // }, 3000)
    // 跳转到首页
  }

  const showModel = (open: boolean, data?: any) => {
    Promise.resolve().then(() => {
      setOpen(preState => open)
    }).then(() => {
      // setInitialValues(() => ({
      //   summary: context.state.article.summary
      // }))
    })
  }

  const onOk = () => {
    // context.dispatch({ type: 'PUBLISH', payload: {} })
    formInstance?.validateFields()
      .then((values: any) => {
        console.log("Publish===ok", values)
        context.dispatch((f: any) => publishArticle(f, values))
      }).finally(() => {
        formInstance.resetFields()
        setOpen(false)
      })
  }

  const onCancel = () => {
    formInstance?.resetFields()
    setOpen(false)
  }

  const afterOpenChange = (open: boolean) => {
    if (open) {
      request({
        url: `/api/user/v1/article_category`,
        method: 'GET',
      }).then((r: any) => {
        const { data: { data } } = r
        const options = data.data.map((v: any) => ({ value: v.id, label: v.category_name }))
        // https://juejin.cn/s/antd%20select%20%E5%8A%A8%E6%80%81option
        setOptions(() => options)
      })
    }
  }

  React.useImperativeHandle(ref, () => ({
    onOk,
    onCancel,
    setOpen,
    showModel
  }))

  return (
    <React.Fragment>
      <div>
        <Modal
          title={'发布文章'}
          width={"40%"}
          open={open}
          onOk={onOk}
          onCancel={onCancel}
          forceRender={true}// 看这里，重点在这里哦
          afterOpenChange={afterOpenChange}
        >
          <ModelForm
            options={options}
            initialValues={initialValues}
            onFormInstanceReady={(instance) => {
              setFormInstance(instance);
            }}
          />
        </Modal>
      </div>
    </React.Fragment>
  )
})

export default Publish
