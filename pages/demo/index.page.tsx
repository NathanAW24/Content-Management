import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Menu, Card, Avatar, Image, Typography, Table, Spin } from 'antd';
import path from 'path';
import moment from 'moment';

// data

import { isValidTimestamp } from '@firebase/util';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import campaignData, { pieData } from '../../demoComponents/demoData/tableData';
import Navbar from '../../demoComponents/Navbar';
import CustomTable from '../../demoComponents/CustomTable';
import PricePie from '../../demoComponents/PricePie';
import { CampaignAntType, FetchedCampaignType } from './types';
import { PieDataType } from './types/PieDataType';

import LayoutMain from '../../demoComponents/LayoutMain';
import VerifyEmailPage from '../../demoComponents/VerifyEmailPage';
import gqlInit from '../../demoComponents/gql';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

// eslint-disable-next-line react/function-component-definition
const Dashboard: React.FC = () => {
  // hooks
  const [totalImpression, setTotalImpression] = useState<number>(0);

  // console.log(user);
  // console.log(gqlclient);

  return (
    <LayoutMain menuKey="demo">
      <>
        <div className="flex flex-col md:flex-row mt-5">
          <div className="bg-white md:w-2/4 mx-5 my-6 p-7 flex text-center justify-center rounded-lg">
            <div className="flex h-full items-center">
              <Typography>
                <Title level={1}>Total Impression</Title>
                <Title level={1}>{210}</Title>
                <Title level={1}>in a month</Title>
              </Typography>
            </div>
          </div>
          <div className="bg-white md:w-2/4 mx-5 my-6 p-7 rounded-lg">
            <Typography>
              <Title level={2}>Monthly Campaign Cost</Title>
            </Typography>
            <PricePie pieData={pieData} />
          </div>
        </div>
        <div>
          <div className="bg-white mx-5 my-3 p-10 rounded-lg">
            <CustomTable dataSource={campaignData} loading={false} />
          </div>
        </div>
      </>
    </LayoutMain>
  );
};

export default Dashboard;
