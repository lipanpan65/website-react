import * as React from 'react'

import { Button, Modal } from 'antd';

const PublishArticle: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="发布文章"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </React.Fragment>
  );
};

export default PublishArticle;
