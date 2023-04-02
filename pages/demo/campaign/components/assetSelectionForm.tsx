import { useUser } from '@auth0/nextjs-auth0';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import gqlInit from '../../../../demoComponents/gql';
import MediaPick from '../../../../demoComponents/MediaPick';
import VerifyEmailPage from '../../../../demoComponents/VerifyEmailPage';
import { MediaDataType } from '../../types';
import type { CampaignPayload } from './payload.type';

type PropsType = {
  payload: CampaignPayload;
  setPayload: React.Dispatch<React.SetStateAction<CampaignPayload>>;
};

// eslint-disable-next-line no-shadow
function AssetSelectionForm({ payload, setPayload }: PropsType) {
  const { user, error, isLoading } = useUser();
  const [listOfMedia, setListOfMedia] = useState<MediaDataType[]>([]);
  const [assetIdSelected, setAssetIdSelected] = useState<string[]>([]);
  const { assets, totalDuration, ...restFields } = payload;
  const [campaignTotalDuration, setCampaignTotalDuration] = useState(0);

  // upadte payload
  useEffect(() => {
    setPayload({ assets: assetIdSelected, totalDuration: campaignTotalDuration, ...restFields });
    // console.log('kontol ', { assets: assetIdSelected, totalDuration: campaignTotalDuration, ...restFields });
  }, [assetIdSelected]);

  useEffect(() => {
    setAssetIdSelected(payload.assets);
    setCampaignTotalDuration(payload.totalDuration);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchGQL = async () => {
      const GET_ASSETS = `
              query {
                getUser(args: { userSub: "${user?.sub}" }) {
                  assets {
                    _id
                    assetName
                    fileUrl
                    fileType
                    fileSize
                    duration
                  }
                }
              }
            `;
      const gqlclient = gqlInit(user);
      const fetchedData: { getUser: { assets: MediaDataType[] } } = await gqlclient.request(GET_ASSETS);
      const mediaArray: MediaDataType[] = fetchedData?.getUser?.assets;
      // console.log(mediaArray);

      setListOfMedia(mediaArray);
    };
    fetchGQL();
  }, [user]);

  if (isLoading) return <Spin>Loading...</Spin>;
  if (error) return <div>{error.message}</div>;
  // check if user exist and user_email is verified.
  if (user && !user?.email_verified) {
    return <VerifyEmailPage />;
  }
  return (
    <div>
      <MediaPick
        videoData={listOfMedia}
        assetIdSelected={assetIdSelected}
        setAssetIdSelected={setAssetIdSelected}
        campaignTotalDuration={campaignTotalDuration}
        setCampaignTotalDuration={setCampaignTotalDuration}
      />
    </div>
  );
}

export default AssetSelectionForm;
