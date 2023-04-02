import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Menu, Card, Avatar, Image, Typography, Table, Spin } from 'antd';
import path from 'path';
import moment from 'moment';

import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

import { isValidTimestamp } from '@firebase/util';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import Navbar from '../components/Navbar';
import CustomTable from '../components/CustomTable';
import PricePie from '../components/PricePie';
import { CampaignAntType, FetchedCampaignType } from './types';
import { PieDataType } from './types/PieDataType';

import LayoutMain from '../components/LayoutMain';
import VerifyEmailPage from '../components/VerifyEmailPage';
import gqlInit from '../components/gql';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

// if want to delete field just comment one of the objects
// const columns = [
//   // {
//   //   title: 'ID',
//   //   dataIndex: '_id',
//   //   key: '_id',
//   // },
//   {
//     title: 'Campaign',
//     dataIndex: 'campaignName',
//     key: 'campaignName',
//   },
//   {
//     title: 'Duration',
//     dataIndex: 'totalDuration',
//     key: 'totalDuration',
//   },
//   {
//     title: 'Monthly Impression',
//     dataIndex: 'monthlyImpressionTarget',
//     key: 'monthlyImpressionTarget',
//   },
//   {
//     title: 'Price',
//     dataIndex: 'price',
//     key: 'price',
//   },
//   {
//     title: 'Cost per Minute',
//     dataIndex: 'costPerMinute',
//     key: 'costPerMinute',
//   },
//   {
//     title: 'Status',
//     dataIndex: 'status',
//     key: 'status',
//   },
//   {
//     title: 'Start Date',
//     dataIndex: 'startDateMoment',
//     key: 'startDateMoment',
//   },
//   {
//     title: 'End Date',
//     dataIndex: 'endDateMoment',
//     key: 'endDateMoment',
//   },
// ];

// eslint-disable-next-line react/function-component-definition
const Dashboard: React.FC = () => {
  // hooks
  const [tableData, setTableData] = useState<FetchedCampaignType[]>([]);
  const { user, error, isLoading } = useUser();
  const [campaignTableList, setCampaignTableList] = useState<CampaignAntType[]>([]);
  const [totalImpression, setTotalImpression] = useState<number>(0);
  const [pieData, setPieData] = useState<PieDataType[]>([]);

  const [fetchLoading, setFetchLoading] = useState(true);
  // console.log(user);
  // console.log(gqlclient);

  // fetch graphql
  useEffect(() => {
    if (!user) return;
    const fetchGQL = async () => {
      const GET_CAMPAIGNS = `
      query {
        getUser(args: { userSub: "${user?.sub}" }) {
          campaigns {
            _id
            monthlyImpressionTarget
            price
            status
            startDate
            endDate
            campaignName
            totalDuration
          }
        }
      }
    `;
      const gqlclient = gqlInit(user);
      const fetchedData: { getUser: { campaigns: FetchedCampaignType[] } } = await gqlclient.request(GET_CAMPAIGNS);
      const campaignArray: FetchedCampaignType[] = fetchedData?.getUser?.campaigns;

      // modify the schema according to ant design data schema
      // total impression = sum of campaign.monthlyImpressionTarget
      const fetchedTotalImpression: number = campaignArray.reduce(
        (accumulator, currentValue) => accumulator + currentValue.monthlyImpressionTarget,
        0,
      );
      const fetchedCampaignPie = campaignArray.map((campaign) => {
        return {
          type: campaign.campaignName,
          value: campaign.price,
        };
      });
      const fetchedCampaignTable = campaignArray.map((campaign) => {
        return {
          _id: campaign._id,
          campaignName: campaign.campaignName,
          status: campaign.status,
          totalDuration: campaign.totalDuration,
          monthlyImpressionTarget: campaign.monthlyImpressionTarget,
          price: campaign.price,
          totalPrice: campaign.price * campaign.totalDuration * campaign.monthlyImpressionTarget,
          startDateMoment: moment(campaign.startDate).format('DD-MM-YY'),
          endDateMoment: moment(campaign.endDate).format('DD-MM-YY'),
        };
      });

      setCampaignTableList(fetchedCampaignTable);
      setTotalImpression(fetchedTotalImpression);
      setPieData(fetchedCampaignPie);
    };
    setFetchLoading(true);
    fetchGQL();
    setFetchLoading(false);
  }, [user]);

  // auth0 stuff
  if (isLoading) return <Spin>Loading...</Spin>;
  if (error) return <div>{error.message}</div>;
  // check if user exist and user_email is verified.
  if (user && !user?.email_verified) {
    return <VerifyEmailPage />;
  }

  return (
    <LayoutMain menuKey="">
      <>
        <div className="flex flex-col md:flex-row mt-5">
          <div className="bg-white md:w-2/4 mx-5 my-6 p-7 flex text-center justify-center rounded-lg">
            <div className="flex h-full items-center">
              {fetchLoading ? (
                <Spin tip="Loading..." />
              ) : (
                <Typography>
                  <Title level={1}>Total Impression</Title>
                  <Title level={1}>{totalImpression}</Title>
                  <Title level={1}>in a month</Title>
                </Typography>
              )}
            </div>
          </div>
          <div className="bg-white md:w-2/4 mx-5 my-6 p-7 rounded-lg">
            <Typography>
              <Title level={2}>Monthly Campaign Cost</Title>
            </Typography>
            {fetchLoading ? (
              <Spin tip="Loading..." className="h-72" />
            ) : (
              <PricePie pieData={pieData} loading={fetchLoading} />
            )}
          </div>
        </div>
        <div>
          <div className="bg-white mx-5 my-3 p-10 rounded-lg">
            <CustomTable dataSource={campaignTableList} loading={fetchLoading} />
          </div>
        </div>
      </>
    </LayoutMain>
  );
};

export default withPageAuthRequired(Dashboard);
