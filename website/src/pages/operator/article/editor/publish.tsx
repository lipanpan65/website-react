import * as React from 'react';
// import request from '@/services'
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
  message
} from 'antd'

import { dateFormate } from '@/utils'

import { EditArticleContext } from './index'


const IEditForm = React.forwardRef((props: any, ref: any) => {
  const { isUpdate, data } = props
  let formRef: any = React.useRef<any>()

  const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } }

  const onResetFields = () => formRef.current?.resetFields()

  const onSetFieldsValue = (values: any) => {
    formRef.current?.setFieldsValue({ ...values })
  }

  return (
    <React.Fragment>
      <Form ref={formRef}
        initialValues={{
          status: true
        }}
      >
        <Row gutter={[16, 0]}>
          <Col span={11} >
            <Form.Item label="名称" name="cname" {...formLayout}
              rules={[
                { required: true, message: '请输入名称' },
                // { validator: validateNameExists }
              ]}
            >
              {isUpdate ? <span>{`${data.cname}`}</span> : <Input placeholder="请输入名称" />}
            </Form.Item>
          </Col>
          <Col span={11} >
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
          </Col>
          <Col span={22}>
            <Form.Item label="key"
              labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}
              name={"ckey"}
              rules={[{
                required: true,
                message: '请输入key'
              }]}
            >
              <Input placeholder="请输入key" />
            </Form.Item>
          </Col>
          <Col span={22}>
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
          </Col>
          <Col span={22}>
            <Form.Item label="备注"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              name={"note"}
              rules={[
                { type: 'string', max: 1000, message: '备注信息字数不能超过1000' },
              ]}
            >
              <Input.TextArea placeholder="请输入备注信息" />
            </Form.Item>
          </Col>
          <Col span={22}>
            <Form.Item
              valuePropName="checked"
              label="状态"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              name={"status"}
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
            </Form.Item>
          </Col>
          {
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
          }
        </Row>
      </Form>
    </React.Fragment>
  )
})


const Publish = React.forwardRef((props: any, ref: any) => {

  const context = React.useContext(EditArticleContext)

  const formRef: any = React.useRef<any>()
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  let [record, setRecord] = React.useState<any>({})
  const [title, setTitle] = React.useState<string>("创建字典")

  const onOk = () => {
    context.dispatch({ type: 'PUBLISH', payload: {} })
    console.log(formRef)
    // debugger
    // formRef?.current?.formRef.current.validateFields()
    //   .then((values: any) => {
    //     console.log("values")
    //     context.dispatch({ type: 'PUBLISH', payload: values })
    //     // values["id"] = record.id
    //     // props.onSubmit(values)
    //   }).finally(() => {
    //     setIsModalOpen(false)
    //   })
  }

  const onCancel = () => {
    formRef.current?.onResetFields()
    setIsModalOpen(false)
  }

  React.useImperativeHandle(ref, () => ({
    onOk,
    onCancel,
    setRecord,
    setIsModalOpen
  }))

  return (
    <React.Fragment>
      <div>
        <Modal
          // title={title}
          width={"40%"}
          open={isModalOpen}
          onOk={onOk}
          onCancel={onCancel}
        >
          <IEditForm
            ref={formRef}
            isUpdate={!!record.id}
            data={record}
          />
        </Modal>
      </div>
    </React.Fragment>
  )
})

export default Publish
