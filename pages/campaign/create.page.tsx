/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useMemo, useState } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  Breadcrumb,
  Layout,
  Menu,
  Card,
  Avatar,
  Image,
  Typography,
  Table,
  Spin,
  List,
  Skeleton,
  Button,
  message,
  notification,
} from 'antd';
import moment from 'moment';
import { Router, useRouter } from 'next/router';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import LayoutMain from '../../components/LayoutMain';
import VerifyEmailPage from '../../components/VerifyEmailPage';
import { FetchedCampaignType, FetchedAssetType, PieDataType, CampaignAntType } from '../types';
import gqlInit from '../../components/gql';
import CustomTable from '../../components/CustomTable';
import useCreateCampaignForms from './useCreateCampaignForms';
import { CampaignPayload } from './components/payload.type';
import useUserMongoDB from '../../components/useUserMongoDB';

export type FormType = {
  formName: string;
  title: string;
  desc: string;
  // eslint-disable-next-line no-undef
  form: JSX.Element;
};

const createCampaignPage = () => {
  // auth0 stuff
  const [formIdx, setFormIdx] = useState(0);
  const [forms, setForms] = useState<FormType[]>([]);
  const { user, error, isLoading } = useUser();
  const { userMDB, isLoadingUser } = useUserMongoDB();
  const [payload, setPayload] = useState<CampaignPayload>({
    campaignName: '',
    owner: '',
    assets: [],
    status: 'PROPOSED',
    totalDuration: 0,
    preferences: [],
    monthlyImpressionTarget: 0,
    startDate: new Date(),
    endDate: new Date(),
    deployWhenApproved: false,
  });

  const router = useRouter();

  // create campaign function using GQL
  const createCampaignGQL = async (mergedPayload: CampaignPayload) => {
    if (!user || !userMDB) throw new Error('Please login, user undefined');
    const CREATE_CAMPAIGN = `
    mutation {
      createCampaign(input: {
          assets: [${mergedPayload.assets.length === 0 ? '' : `"${mergedPayload.assets.join('","')}"`}]
          campaignName: "${mergedPayload.campaignName}"
          deployWhenApproved: ${mergedPayload.deployWhenApproved}
          monthlyImpressionTarget: ${mergedPayload.monthlyImpressionTarget}
          owner: "${userMDB?._id}"
          preferences: [${mergedPayload.preferences.length === 0 ? '' : `"${mergedPayload.preferences.join('","')}"`}]
          startDate: "${new Date(mergedPayload.startDate)}"
          endDate: "${new Date(mergedPayload.endDate)}"
          status: "PROPOSED"
          totalDuration: ${mergedPayload.totalDuration}
      }) {
        _id
      }
    }
    `;
    // console.log(CREATE_CAMPAIGN);

    const gqlclient = gqlInit(user);
    await gqlclient.request(CREATE_CAMPAIGN);
  };
  const openNotification = () => {
    const btn = (
      <Button type="primary" size="small" href="/campaign">
        Go to campaign page
      </Button>
    );
    const args = {
      message: 'Notification Title',
      description: 'Submitted Campaign!',
      duration: 0,
      btn,
    };
    notification.open(args);
  };

  const { generateForms, isSubmitting, setIsSubmitted }: any = useCreateCampaignForms({
    initialPayload: payload,
    onNext: (newPayload: any) => {
      if (formIdx === 0 && newPayload.assets.length === 0) {
        message.error('You must select at least one asset to continue.');
        return;
      }
      const mergedPayload = { ...payload, ...newPayload };
      setPayload(mergedPayload);
      if (formIdx === 1) {
        createCampaignGQL(mergedPayload);
        openNotification();
        setIsSubmitted(true);
        return;
      }
      setFormIdx((idx) => idx + 1);
    },
    onPrev: () => {
      setFormIdx((idx) => idx - 1);
    },
  });
  useEffect(() => {
    setForms(generateForms());
  }, [payload, generateForms]);

  useEffect(() => {
    // console.log('root payload', payload);
  }, [payload]);

  const FormComponent = useMemo(() => {
    if (forms.length === 0) {
      return null;
    }
    if (formIdx > forms.length - 1) {
      return null;
    }
    const currentForm = forms[formIdx];
    return (
      <>
        <Typography.Title level={4}>{currentForm.formName}</Typography.Title>
        <Typography.Title level={5}>{currentForm.desc}</Typography.Title>
        <Spin spinning={isSubmitting}>
          <section>{currentForm.form}</section>
        </Spin>
      </>
    );
  }, [formIdx, isSubmitting, forms]);

  if (isLoading) return <Spin>Loading...</Spin>;
  if (error) return <div>{error.message}</div>;
  // check if user exist and user_email is verified.
  if (user && !user?.email_verified) {
    return <VerifyEmailPage />;
  }

  return (
    <LayoutMain menuKey="campaign">
      <div className="m-10 flex flex-col">
        <div className="justify-between flex text-gray-500">
          <div className="flex items-center hover:cursor-pointer " onClick={() => router.push('/campaign')}>
            <LeftOutlined className="text-2xl my-5 " />
            <div className="flex mx-2 text-xl mb-2">Back to Campaign</div>
          </div>
        </div>
        {/* <Typography.Title className="inline" level={5}>
          Create New Campaign
        </Typography.Title> */}
        <div>{FormComponent}</div>
      </div>
    </LayoutMain>
  );
};

export default withPageAuthRequired(createCampaignPage);
