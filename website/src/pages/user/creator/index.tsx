import * as React from 'react'
import { Col, MenuProps, Row, Menu, theme, Tabs, Space } from 'antd'


import {
  UnorderedListOutlined,
  EditOutlined,
  MenuOutlined,
  HomeOutlined,
  BookOutlined,
  ProfileOutlined
} from '@ant-design/icons'

import type { TabsProps } from 'antd';

import CreatorAriticle from './article'
import { IconText } from '@/utils'

const CreatorOverView: React.FC = () => {

  const {
    token: {
      colorBgContainer,
    },
  } = theme.useToken();

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: 'article',
      label: IconText('ProfileOutlined', '文章'),
      children: <CreatorAriticle />,
    },
    {
      key: 'draft',
      label: IconText('EditOutlined', '草稿'),
      children: <CreatorAriticle />,
    },
  ];

  return (
    <React.Fragment>
      <div style={{
        // display: 'flex',
        // gap: 16,
        width: '100%',
        height: '100vh',
        padding: '0 20px',
        border:'1px solid red'
        // background: colorBgContainer
      }}>
        <Tabs defaultActiveKey="article" items={items} onChange={onChange} />
      </div>
    </React.Fragment>
  )
}

export default CreatorOverView