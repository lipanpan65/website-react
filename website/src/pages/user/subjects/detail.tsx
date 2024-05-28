import React from 'react';

import { Tree, Space, Layout, theme } from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import './index.css'
const { Header, Content, Footer, Sider } = Layout;

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

const titleRender = (nodeData: any) => {

  console.log(nodeData)
  const { title, key, children } = nodeData

  return (
    <React.Fragment>
      <div
        className='titleRender'
        key={key}>
        <Space>
          <span>{title}</span>
          <span className='edit-button'>
            <Space>
              <EditOutlined />
              <PlusOutlined />
              <DeleteOutlined />
            </Space>
          </span>
        </Space>
      </div>
    </React.Fragment>
  )
}


const initTreeData: DataNode[] = [
  { title: 'Expand to load', key: '0' },
  { title: 'Expand to load', key: '1' },
  { title: 'Tree Node', key: '2', isLeaf: true },
];

const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

const style: React.CSSProperties = {
  // background: '#0092ff', 
  padding: '16px 0'
};

const SubjectTree: React.FC = () => {

  const [treeData, setTreeData] = React.useState(initTreeData);

  const onLoadData = ({ key, children }: any) =>
    new Promise<void>((resolve) => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        setTreeData((origin) =>
          updateTreeData(origin, key, [
            { title: 'Child Node', key: `${key}-0` },
            { title: 'Child Node', key: `${key}-1` },
          ]),
        );

        resolve();
      }, 1000);
    });

  return (
    <React.Fragment>
      <Tree
        titleRender={titleRender}
        loadData={onLoadData}
        treeData={treeData} />
    </React.Fragment>
  )
}

const SubjectEditor: React.FC = () => {
  return (
    <React.Fragment>

    </React.Fragment >
  )
}

const SubjectDetail: React.FC = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <React.Fragment>
      <Layout
        style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}
      >
        <Sider style={{ background: colorBgContainer }} width={200}>
          {/* <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
            items={items2}
          /> */}
          <SubjectTree />
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
      </Layout>
    </React.Fragment>
  )
}

export default SubjectDetail

