import React, { useState } from 'react';
import { Button, Upload, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import LayoutMain from '../../components/LayoutMain';
import VerifyEmailPage from '../../components/VerifyEmailPage';

const fileList: UploadFile[] = [
  {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    name: 'yyy.png',
    status: 'error',
  },
];

// eslint-disable-next-line react/function-component-definition
const UploadPage = () => {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <Spin>Loading...</Spin>;
  if (error) return <div>{error.message}</div>;
  // check if user exist and user_email is verified.
  if (user && !user?.email_verified) {
    return <VerifyEmailPage />;
  }
  return (
    <LayoutMain menuKey="asset">
      <div className="m-10">
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture"
          defaultFileList={[...fileList]}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </div>
    </LayoutMain>
  );
};

export default withPageAuthRequired(UploadPage);
