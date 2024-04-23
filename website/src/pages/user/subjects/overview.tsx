import React from 'react';
import {
  Button,
  Col,
  Result,
  Row
} from 'antd';
import { Avatar, Card, Skeleton, Switch } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const style: React.CSSProperties = {
  // background: '#0092ff', 
  padding: '16px 0'
};

const Subject: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const onChange = (checked: boolean) => {
    setLoading(!checked);
  };

  return (
    <React.Fragment>
      <Row gutter={[16, 16]} style={style}>
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
              <Link to={'/user/subjects/detail/1'}>
                <Meta
                  // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
                  title="Card title"
                  description="This is the description"
                />
              </Link>
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