import React, { useEffect, useState } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Breadcrumb, Layout, Menu, Card, Avatar, Image, Typography, Table, Spin, List, Skeleton, Button } from 'antd';
import moment from 'moment';
import { Router, useRouter } from 'next/router';

import LayoutMain from '../../components/LayoutMain';
import VerifyEmailPage from '../../components/VerifyEmailPage';
import { FetchedCampaignType, FetchedAssetType, PieDataType, CampaignAntType } from '../types';
import gqlInit from '../../components/gql';
import CustomTable from '../../components/CustomTable';

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

const index = () => {
  // auth0 stuff
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  const [campaignList, setCampaignList] = useState<CampaignAntType[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

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
      // eslint-disable-next-line no-use-before-define
      const gqlclient = gqlInit(user);
      const fetchedData: { getUser: { campaigns: FetchedCampaignType[] } } = await gqlclient.request(GET_CAMPAIGNS);
      const campaignArray: FetchedCampaignType[] = fetchedData?.getUser?.campaigns;

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

      setCampaignList(fetchedCampaignTable);
    };
    setFetchLoading(true);
    fetchGQL();
    setFetchLoading(false);
  }, [user]);

  if (isLoading) return <Spin>Loading...</Spin>;
  if (error) return <div>{error.message}</div>;
  // check if user exist and user_email is verified.
  if (user && !user?.email_verified) {
    return <VerifyEmailPage />;
  }

  return (
    <LayoutMain menuKey="campaign">
      <div className=" mx-5 my-3 p-10">
        <Typography.Title className="">List of Campaigns</Typography.Title>
        <Button type="primary" className="mb-10 mt-5" onClick={() => router.push('/campaign/create')}>
          + Add New Campaign
        </Button>
        <div className="bg-white rounded-lg">
          <CustomTable dataSource={campaignList} loading={fetchLoading} />
        </div>
      </div>
    </LayoutMain>
  );
};

export default withPageAuthRequired(index);
