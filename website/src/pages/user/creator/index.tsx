import * as React from 'react'
import { Col, MenuProps, Row, Menu, theme, Tabs } from 'antd'

import {
  MenuOutlined,
  HomeOutlined
} from '@ant-design/icons'

import type { TabsProps } from 'antd';

import CreatorAriticle from './article'

const CreatorOverView: React.FC = () => {

  const {
    token: {
      colorBgContainer,
      // borderRadiusLG
    },
  } = theme.useToken();

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '文章',
      children: <CreatorAriticle />,
    },
    {
      key: '2',
      label: '草稿',
      children: 'Content of Tab Pane 2',
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
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </React.Fragment>
  )
}

export default CreatorOverView