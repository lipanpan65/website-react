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
      <div style={{
        // height: 200,
        // width: '100%',
        height: '100vh',
        // border: '1px solid green',
        background: colorBgContainer
      }}>
        mian
      </div>
      {/* main 页面 */}
      {/* <Row style={{
        // paddingTop: '1rem',
        background: colorBgContainer,
      }}> */}

      {/* <p style={{ background: 'red' }}>p</p> */}
      {/* <Col span={12} offset={6} style={{
          background: colorBgContainer,
          minHeight: '100vh'
        }}>
          <span>kjs</span>
        </Col> */}
      {/* </Row> */}
    </React.Fragment>
  )
}

export default CreatorOverView