import { Button, Modal, Typography } from 'antd';
import React, { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;

// eslint-disable-next-line react/function-component-definition
const DeleteConfirmationModal: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    // proceed to delete
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    // DONT DELETE
  };

  return (
    <>
      <Button className="m-3" onClick={showModal} type="primary" icon={<DeleteOutlined />} danger>
        Delete
      </Button>
      <Modal visible={isModalVisible} okButtonProps={{ type: 'default' }} onOk={handleOk} onCancel={handleCancel}>
        <Typography>
          <Text> Are you sure you want to delete?</Text>
        </Typography>
      </Modal>
    </>
  );
};

export default DeleteConfirmationModal;
