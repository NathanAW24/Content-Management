import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Progress } from 'antd';
import { normalize } from 'path';
import React, { useState } from 'react';

// eslint-disable-next-line react/function-component-definition
const ProgressBar: React.FC<any> = ({ percent }) => {
  // change any later
  const maxGB = 100;

  // used for design testing only, later delete
  const percentNow: number = 100;

  // const increase = () => {
  //   let newPercent = percent + 10;
  //   if (newPercent > 100) {
  //     newPercent = 100;
  //   }
  //   setPercent(newPercent);
  // };

  // const decline = () => {
  //   let newPercent = percent - 10;
  //   if (newPercent < 0) {
  //     newPercent = 0;
  //   }
  //   setPercent(newPercent);
  // };

  return (
    <div className="w-parent m-3">
      <Progress
        percent={percent}
        strokeColor={percent > 85 ? '#ff4d4f' : '#1890ff'}
        trailColor="#c9c9c9"
        status={percent === 100 ? 'exception' : 'active'}
        showInfo={false}
      />
    </div>
  );
};

export default ProgressBar;
