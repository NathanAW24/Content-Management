import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { Breadcrumb, Layout, Menu, Card, Avatar, Image, Typography, Table, Spin, Descriptions, Badge } from 'antd';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';

// components
import campaignData from '../../../demoComponents/demoData/tableData';
import MediaList from '../../../demoComponents/MediaList';
import LayoutMain from '../../../demoComponents/LayoutMain';
import gqlInit from '../../../demoComponents/gql';
import VerifyEmailPage from '../../../demoComponents/VerifyEmailPage';
import { FetchedAssetType, FetchedCampaignType } from '../types';

const index = () => {
  const router = useRouter();
  const { campaignId } = router.query;
  const [assetList, setAssetList] = useState<FetchedAssetType[]>([
    {
      _id: 'med1',
      assetName: 'Sample 1',
      fileUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      fileType: 'video/mp4',
      fileSize: 25.78,
      duration: 5,
    },
    {
      _id: 'med2',
      assetName: 'Sample 2',
      fileUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      fileType: 'video/mp4',
      fileSize: 25.78,
      duration: 5,
    },
    {
      _id: 'med3',
      assetName: 'Sample 3',
      fileUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      fileType: 'video/mp4',
      fileSize: 25.78,
      duration: 5,
    },
  ]);
  const [campaignEntity, setCampaignEntity] = useState<FetchedCampaignType>(
    campaignData.filter((item: any) => {
      // eslint-disable-next-line eqeqeq
      return item._id == campaignId;
    })[0],
  );

  // const fetchGql = async () => {
  //   const GET_ASSETS_OF_CAMPAIGN = `
  //   query {
  //     getCampaign(args: { _id: "${campaignId}" }) {
  //       _id
  //       monthlyImpressionTarget
  //       price
  //       status
  //       startDate
  //       endDate
  //       campaignName
  //       totalDuration
  //       assets {
  //         assetName
  //         fileUrl
  //         _id
  //         fileSize
  //         duration
  //         fileType
  //       }
  //     }
  //   }
  // `;
  //   // eslint-disable-next-line no-use-before-define
  //   const gqlclient = gqlInit(user);
  //   const fetchedData: { getCampaign: FetchedCampaignType } = await gqlclient.request(GET_ASSETS_OF_CAMPAIGN);
  //   const assets = fetchedData.getCampaign.assets;
  //   setCampaignEntity(fetchedData.getCampaign);
  //   if (assets) setAssetList(assets);
  //   console.log('asset', assets);
  // };

  // useEffect(() => {
  //   if (!user) return;
  //   fetchGql();
  // }, [user]);

  // if (isLoading) return <Spin>Loading...</Spin>;
  // if (error) return <div>{error.message}</div>;
  // // check if user exist and user_email is verified.
  // if (user && !user?.email_verified) {
  //   return <VerifyEmailPage />;
  // }

  return (
    <LayoutMain menuKey="demo/campaign">
      <div className="m-10">
        <LeftOutlined className="text-4xl my-5 hover:cursor-pointer" onClick={() => Router.push('/demo/campaign')} />
        <Typography.Title className="inline m-5">{campaignEntity?.campaignName}</Typography.Title>
        <Descriptions title="Campaign Information" bordered className="bg-white p-5 rounded-lg">
          <Descriptions.Item label="Campaign Name" span={3}>
            {campaignEntity?.campaignName}
          </Descriptions.Item>
          <Descriptions.Item label="ID" span={3}>
            {campaignEntity?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={3}>
            <Badge status="processing" text={campaignEntity?.status} />
          </Descriptions.Item>
          <Descriptions.Item label="Total Duration" span={3}>
            {campaignEntity?.totalDuration}
          </Descriptions.Item>
          <Descriptions.Item label="Impression" span={3}>
            {campaignEntity?.monthlyImpressionTarget}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date" span={3}>
            {String(moment(campaignEntity?.startDate, 'DD-MM-YY'))}
          </Descriptions.Item>
          <Descriptions.Item label="End Date" span={3}>
            {String(moment(campaignEntity?.endDate, 'DD-MM-YY'))}
          </Descriptions.Item>
          <Descriptions.Item label="CPM" span={3}>
            {campaignEntity?.price}
          </Descriptions.Item>
          <Descriptions.Item label="Media Count" span={3}>
            {3}
          </Descriptions.Item>
        </Descriptions>

        <Typography.Title className="m-5" level={3}>
          Assets
        </Typography.Title>
        <MediaList videoData={assetList} isAssetPage={false} />
      </div>
    </LayoutMain>
  );
};

export default index;
