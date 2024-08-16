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

// const IconText = (icon: React.FC, text: string) => (
//   <Space>
//     {React.createElement(icon)}
//     {text}
//   </Space>
// );

// const IconText = (icon: string, text: string) => {
//   const Icons: any = Icon
//   return (
//     <React.Fragment>
//       <Space>
//         {React.createElement(Icons[icon])}
//         {text}
//       </Space>
//     </React.Fragment>
//   )
// }

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