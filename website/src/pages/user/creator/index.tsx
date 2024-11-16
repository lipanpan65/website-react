import * as React from 'react'
import {
  theme, Tabs,
} from 'antd'

import type { TabsProps } from 'antd';

import CreatorAriticle from './article'
import { IconText } from '@/utils'
import AppContainer from '@/components/AppContainer';

const CreatorOverView: React.FC = () => {

  const {
    token: {
      colorBgContainer,
      borderRadius
    },
  } = theme.useToken();

  const [activeKey, setActiveKey] = React.useState<string>('publish')

  const onChange = (key: string) => {
    setActiveKey(key)
  };
  
  const items: TabsProps['items'] = [
    {
      key: 'publish',
      label: IconText('ProfileOutlined', '文章'),
      children: <CreatorAriticle activeKey={activeKey} />,
    },
    {
      key: 'draft',
      label: IconText('EditOutlined', '草稿'),
      children: <CreatorAriticle activeKey={activeKey} />,
    },
  ];

  return (
    <AppContainer style={{
      background: colorBgContainer,
      borderRadius: borderRadius,
      width: "100%",
      padding: '0px 16px'
    }}>
      <Tabs
        defaultActiveKey="publish"
        activeKey={activeKey}
        items={items}
        onChange={onChange} />
    </AppContainer>
  )
}

export default CreatorOverView