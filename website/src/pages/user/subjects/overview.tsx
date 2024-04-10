import React from 'react';
import { Button, Col, Result, Row } from 'antd';
import { Avatar, Card, Skeleton, Switch } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;

const style: React.CSSProperties = {
  // background: '#0092ff', 
  padding: '8px 0'
};

const Subject: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const onChange = (checked: boolean) => {
    setLoading(!checked);
  };

  return (
    <React.Fragment>
      <Row gutter={[16, 16]}>
        <Col className="gutter-row" span={6} >
          {/* <div style={style}>col-6</div> */}
          <Card
            // style={{ width: 300, marginTop: 16 }}
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Skeleton loading={loading} avatar active>
              <Meta
                // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
                title="Card title"
                description="This is the description"
              />
            </Skeleton>
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          {/* <div style={style}>col-6</div> */}
          <Card
            // style={{ width: 300, marginTop: 16 }}
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Skeleton loading={loading} avatar active>
              <Meta
                // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
                title="Card title"
                description="This is the description"
              />
            </Skeleton>
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          {/* <div style={style}>col-6</div> */}
          <Card
            // style={{ width: 300, marginTop: 16 }}
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Skeleton loading={loading} avatar active>
              <Meta
                // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
                title="Card title"
                description="This is the description"
              />
            </Skeleton>
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          {/* <div style={style}>col-6</div> */}
          <Card
            // style={{ width: 300, marginTop: 16 }}
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Skeleton loading={loading} avatar active>
              <Meta
                // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
                title="Card title"
                description="This is the description"
              />
            </Skeleton>
          </Card>
        </Col>
        <Col className="gutter-row" span={6}>
          {/* <div style={style}>col-6</div> */}
          <Card
            // style={{ width: 300, marginTop: 16 }}
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Skeleton loading={loading} avatar active>
              <Meta
                // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
                title="Card title"
                description="This is the description"
              />
            </Skeleton>
          </Card>
        </Col>
      </Row>

    </React.Fragment>
  )

};

export default Subject;