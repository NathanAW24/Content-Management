import { Button, Col, Row, Space, Typography } from 'antd';
import React from 'react';

function VerifyEmailPage() {
  return (
    <div style={{ width: '100vw', textAlign: 'center' }}>
      <Space direction="vertical" style={{ margin: '30vh auto' }}>
        <Typography.Title style={{ marginBottom: '30px' }}>Please verify your email.</Typography.Title>
        <Typography.Title level={5}>Click the link that is sent to your inbox.</Typography.Title>

        <Button href="/api/auth/login">I have verified my email.</Button>

        <Button href="/api/auth/logout">Choose different account? Logout</Button>
      </Space>
    </div>
  );
}

export default VerifyEmailPage;
