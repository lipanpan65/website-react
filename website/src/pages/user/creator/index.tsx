import * as React from 'react'
import { Col, MenuProps, Row, Menu } from 'antd'

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
          main页面
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default CreatorOverView