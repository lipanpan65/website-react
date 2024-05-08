import * as React from 'react'
import { Col, MenuProps, Row, Menu, theme, Tabs, Space } from 'antd'

/**
 * 
 * 
 * import * as Icon from '@ant-design/icons';
//iconName是icon名字字符串
  const createAntdIcon = (iconName) => {
    return React.createElement(Icon[iconName]);
  }
  list 的页面
  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

 * 
 */

import {
  UnorderedListOutlined,
  EditOutlined,
  MenuOutlined,
  HomeOutlined
} from '@ant-design/icons'

import type { TabsProps } from 'antd';

import CreatorAriticle from './article'

const TabTitle = () => {
  return (
    <React.Fragment>
      <Space>
        {/* React.createElement('') */}
        <EditOutlined />
        草稿
      </Space>
    </React.Fragment>
  )
}

const CreatorOverView: React.FC = () => {

  const {
    token: {
      colorBgContainer,
      // borderRadiusLG
    },
  } = theme.useToken();

  const onChange = (key: string) => {
    console.log('key===>', key)
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: 'article',
      label: '文章',
      children: <CreatorAriticle />,
    },
    {
      key: 'draft',
      label: TabTitle(),
      children: <CreatorAriticle />,
    },
  ];

  return (
    <React.Fragment>
      <div style={{
        height: '100vh',
        padding: '0 20px',
        // border: '1px solid green',
        background: colorBgContainer
      }}>
        <Tabs defaultActiveKey="article" items={items} onChange={onChange} />
      </div>
    </React.Fragment>
  )
}

export default CreatorOverView