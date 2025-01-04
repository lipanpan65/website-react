import * as React from 'react'

import AppContainer from '@/components/AppContainer';
import AppDialog from '@/components/AppDialog';
import { PlusOutlined, AndroidOutlined, AppleOutlined, CheckOutlined, EditOutlined, DeleteOutlined, CarryOutOutlined, FormOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Splitter, Tooltip, Typography, TreeSelect, Tabs, Tree, Switch, Select, FormInstance, message, TreeDataNode, Menu, Dropdown } from 'antd';
import { DataNode } from 'antd/es/tree';
import { api } from '@/api';
// import { DataNode } from 'antd/es/tree';
// import type { DataNode, TreeProps, TreeDataNode } from 'antd/es/tree';

const { SHOW_PARENT } = TreeSelect;

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Flex justify="center" align="center" style={{ height: '100%' }}>
    <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
      {props.text}
    </Typography.Title>
  </Flex>
);

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    // value: '0-0',
    icon: <CarryOutOutlined />,
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        // value: '0-0-0',
        icon: <CarryOutOutlined />,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            // value: '0-0-0-0',
            icon: <CarryOutOutlined />
          },
          {
            title: (
              <>
                <div>multiple line title</div>
                <div>multiple line title</div>
              </>
            ),
            key: '0-0-0-1',
            // value: '0-0-0-1',
            icon: <CarryOutOutlined />,
          },
          {
            title: 'leaf',
            key: '0-0-0-2',
            // value: '0-0-0-2',
            icon: <CarryOutOutlined />
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        // value: '0-0-1',
        icon: <CarryOutOutlined />,
        children: [{
          title: 'leaf', key: '0-0-1-0',
          // value: '0-0-1-0', 
          icon: <CarryOutOutlined />
        }],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        // value: '0-0-2',
        icon: <CarryOutOutlined />,
        children: [
          {
            title: 'leaf', key: '0-0-2-0',
            // value: '0-0-2-0', 
            icon: <CarryOutOutlined />
          },
          {
            title: 'leaf',
            key: '0-0-2-1',
            // value: '0-0-2-1',
            icon: <CarryOutOutlined />,
            switcherIcon: <FormOutlined />,
          },
        ],
      },
    ],
  },
  {
    title: 'parent 2',
    key: '0-1',
    // value: '0-1',
    icon: <CarryOutOutlined />,
    children: [
      {
        title: 'parent 2-0',
        key: '0-1-0',
        // value: '0-1-0',
        icon: <CarryOutOutlined />,
        children: [
          {
            title: 'leaf',
            key: '0-1-0-0',
            // value: '0-1-0-0', 
            icon: <CarryOutOutlined />
          },
          {
            title: 'leaf', key: '0-1-0-1',
            // value: '0-1-0-1', 
            icon: <CarryOutOutlined />
          },
        ],
      },
    ],
  },
];


const OrganizationTreeDialog: React.FC<any> = React.forwardRef((props: any, ref) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { onSubmit, initialValues } = props
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null);
  const [record, setRecord] = React.useState<any>({}) // 添加状态管理表示当前数据

  const fields = [
    {
      label: '组织架构名称',
      name: 'role_name',
      rules: [{ required: true, message: '请输入组织架构名称' }],
      component: <Input placeholder="请输入组织架构名称" />,
      span: 24,
    },
    {
      label: '状态',
      name: 'enable',
      rules: [{ required: true, message: '请输入角色类型' }],
      component: (
        <Select placeholder="请选择状态" allowClear>
          <Select.Option value={1}>启用</Select.Option>
          <Select.Option value={0}>禁用</Select.Option>
        </Select>
      ),
    },
    {
      name: 'remark',
      label: '备注',
      component: <Input.TextArea placeholder="请输入备注" showCount maxLength={100} />,
      span: 24,
    },
  ];

  // 监听 record 变化并更新表单
  React.useEffect(() => {
    if (formInstance && record) {
      console.log("Updating form with record:", record);
      formInstance.setFieldsValue(record);
    }
  }, [record, formInstance]);

  const showModel = (isOpen: boolean, data?: any) => {
    setOpen(isOpen);
    if (isOpen && data) {
      setRecord(data); // 更新 record 状态
    }
  };

  const handleSubmit = async () => {
    try {
      const data = await formInstance?.validateFields();
      if (!!record.id) {
        const newRecord = { id: record.id, ...data };
        await onSubmit('UPDATE', newRecord); // 不再需要传递 `dispatch`
      } else {
        await onSubmit('CREATE', data); // 不再需要传递 `dispatch`
      }
      // enhancedDispatch((dispatch) => onSubmit(dispatch, 'UPDATE', newRecord));
      setOpen(false);
    } catch (error: any) {
      console.error('捕获的异常:', error);
      message.error(error.message || '表单验证失败，请检查输入内容。');
    }
  };

  const onCancel = () => {
    formInstance?.resetFields();
    setOpen(false);
  };


  React.useImperativeHandle(ref, () => ({
    showModel,
    onCancel,
    setOpen,
  }));

  return (
    <div>
      <React.Fragment>
        <AppDialog
          title='添加组织架构'
          fields={fields}
          record={record}
          onCancel={onCancel}
          open={open}
          onSubmit={handleSubmit}
          isEditing={!!record.id}
          setFormInstance={(instance) => {
            setFormInstance(instance);
          }}
        />
      </React.Fragment>
    </div>
  )
})

const OrganizationTreeTab: React.FC<any> = ({ }) => {
  return (
    <div style={{ padding: "0px 8px" }}>
      <Tabs
        defaultActiveKey="2"
        items={[AppleOutlined, AndroidOutlined].map((Icon, i) => {
          const id = String(i + 1);
          return {
            key: id,
            label: `Tab ${id}`,
            children: `Tab ${id}`,
            icon: <Icon />,
          };
        })}
      />
    </div>
  )
}

const OrganizationTree: React.FC<any> = ({ }) => {

  const [value, setValue] = React.useState(['0-0']);
  const [showLine, setShowLine] = React.useState<boolean>(true);
  const [showIcon, setShowIcon] = React.useState<boolean>(false);
  const [showLeafIcon, setShowLeafIcon] = React.useState<React.ReactNode>(true);
  const dialogRef: any = React.useRef()

  const [hoveredKey, setHoveredKey] = React.useState<string | null>(null);

  const onChange = (newValue: string[]) => {
    console.log('onChange ', newValue);
    setValue(newValue);
  };

  const tProps = {
    treeData: [],
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: 'Please select',
    style: {
      width: '100%',
    },
    fieldNames: { title: 'title', key: 'key', children: 'children' }
  };

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const showModel = (_: any, data?: any) => {
    dialogRef.current.showModel(true, data)
  }

  {/* <Desc text="First" /> */ }

  const renderTitle = (node: any) => {

    const menu = (
      <Menu>
        <Menu.Item key="add" icon={<PlusOutlined />} onClick={() => console.log('Add', node.key)}>
          添加
        </Menu.Item>
        <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => console.log('Edit', node.key)}>
          编辑
        </Menu.Item>
        <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => console.log('Delete', node.key)}>
          删除
        </Menu.Item>
      </Menu>
    );

    return (
      <div
        onMouseEnter={() => setHoveredKey(node.key as string)}
        onMouseLeave={() => setHoveredKey(null)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span>{node.title}</span>
        {hoveredKey === node.key && (
          <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
            <Tooltip title="添加">
              <PlusOutlined onClick={() => console.log('Add', node.key)} />
            </Tooltip>
            <Tooltip title="编辑">
              <EditOutlined onClick={() => console.log('Edit', node.key)} />
            </Tooltip>
            <Tooltip title="删除">
              <DeleteOutlined onClick={() => console.log('Delete', node.key)} />
            </Tooltip>
            <Dropdown overlay={menu} trigger={['click']}>
              <EllipsisOutlined style={{ cursor: 'pointer' }} />
            </Dropdown>
          </div>
        )}
      </div>
    );
  };

  const handleLeafIconChange = (value: 'true' | 'false' | 'custom') => {
    if (value === 'custom') {
      return setShowLeafIcon(<CheckOutlined />);
    }
    if (value === 'true') {
      return setShowLeafIcon(true);
    }

    return setShowLeafIcon(false);
  };

  // 递归处理树节点数据，将自定义渲染的 `title` 直接赋值
  const mapTreeData = (data: DataNode[]): DataNode[] =>
    data.map((node) => ({
      ...node,
      title: renderTitle(node), // 直接赋值 `renderTitle(node)` 的返回值给 `title`
      children: node.children ? mapTreeData(node.children) : undefined,
    }));

  const onSubmit = async (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    data: Record<string, any>
  ) => {
    const requestAction =
      actionType === 'DELETE'
        ? () => api.org.delete(data.id)
        : actionType === 'UPDATE'
          ? api.org.update
          : api.org.create;
    
    
  }

  const customTreeData = mapTreeData(treeData);




  return (
    <div>
      <AppContainer>
        <Splitter style={{
          height: 200,
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        }}>
          <Splitter.Panel defaultSize="30%" min="20%" max="40%">
            <div style={{ padding: 8 }}>
              <Flex gap={16} vertical={true}>
                <Flex gap={8} >
                  <Input placeholder="Basic usage" />
                  <Tooltip title="添加一级组织架构">
                    <Button icon={<PlusOutlined />}
                      iconPosition={'end'}
                      onClick={(event: React.MouseEvent<HTMLElement>) => showModel(event, {})}
                    />
                  </Tooltip>
                </Flex>
                <TreeSelect {...tProps} />
                <Tree
                  showLine={showLine ? { showLeafIcon } : false}
                  showIcon={showIcon}
                  // defaultExpandedKeys={['0-0-0']}
                  onSelect={onSelect}
                  treeData={customTreeData}
                  blockNode
                />
                <div style={{ marginBottom: 16 }}>
                  showLine: <Switch checked={!!showLine} onChange={setShowLine} />
                  <br />
                  <br />
                  showIcon: <Switch checked={showIcon} onChange={setShowIcon} />
                  <br />
                  <br />
                  showLeafIcon:{' '}
                  <Select defaultValue="true" onChange={handleLeafIconChange}>
                    <Select.Option value="true">True</Select.Option>
                    <Select.Option value="false">False</Select.Option>
                    <Select.Option value="custom">Custom icon</Select.Option>
                  </Select>
                </div>
              </Flex>
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            {/* <Desc text="Second" /> */}
            <OrganizationTreeTab />
          </Splitter.Panel>
        </Splitter>
        <OrganizationTreeDialog
          ref={dialogRef}
          onSubmit={onSubmit}
        />
      </AppContainer >
    </div >
  )
}
export default OrganizationTree



