import * as React from 'react'
import { Col, MenuProps, Row, Menu, theme } from 'antd'

import {
  MenuOutlined,
  HomeOutlined
} from '@ant-design/icons'

const CreatorOverView: React.FC = () => {
  
  const {
    token: { colorBgContainer,
      borderRadiusLG },
  } = theme.useToken();

  return (
    <React.Fragment>
      {/* main 页面 */}
      <Row>
        <Col span={12} offset={6} style={{ background: colorBgContainer }}>
          
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default CreatorOverView