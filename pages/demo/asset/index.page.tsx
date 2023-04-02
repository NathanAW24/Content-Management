/* eslint-disable indent */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Spin,
  Button,
  Popover,
  Row,
  Col,
  Typography,
  Progress,
  Image,
  Space,
  message,
  Descriptions,
  Badge,
  Divider,
  InputNumber,
} from 'antd';
import { UploadOutlined, DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import LayoutMain from '../../../demoComponents/LayoutMain';
import VerifyEmailPage from '../../../demoComponents/VerifyEmailPage';
// import ProgressBar from '../../../democomponents/ProgressBar';
import MediaList from '../../../demoComponents/MediaList';
import DeleteConfirmationModal from '../../../demoComponents/DeleteConfirmationModal';
import gqlInit from '../../../demoComponents/gql';
import { MediaDataType } from '../types';
import useUserMongoDB from '../../../demoComponents/useUserMongoDB';
import { storage } from '../../../demoComponents/firebase';

const PopoverContent = <p>Choose Media!</p>;
const { Text } = Typography;

type FileInputType = File & {
  duration: number;
  isEditing?: boolean;
  _id: string;
};

// eslint-disable-next-line react/function-component-definition
const Asset = () => {
  // hooks
  const { userMDB, isLoadingUser } = useUserMongoDB();
  const [listOfMedia, setListOfMedia] = useState<MediaDataType[]>([]);

  const [storageUsed, setStorageUsed] = useState(0);
  const [uploadFile, setUploadFile] = useState<FileInputType>();

  // for upload asset
  const [fileInputDurationOnLoad, setFileInputDurationOnLoad] = useState(3);
  const [previewFileURL, setPreviewFileURL] = useState('');
  const [isOnConfirmingUpload, setIsOnConfirmingUpload] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [percentUpload, setPercentUpload] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // just code to get window width and height

  const fetchInitialPayload = async () => {
    // const GET_ASSETS = `
    //     query {
    //       getUser(args: { userSub: "${user.sub}" }) {
    //         assets {
    //           _id
    //           assetName
    //           fileUrl
    //           fileType
    //           fileSize
    //           duration
    //         }
    //       }
    //     }
    //   `;
    // const gqlclient = gqlInit(user);
    // const fetchedData: { getUser: { assets: MediaDataType[] } } = await gqlclient.request(GET_ASSETS);
    const mediaArray: MediaDataType[] = [
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
      {
        _id: 'med4',
        assetName: 'Sample 4',
        fileUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
        fileType: 'video/mp4',
        fileSize: 25.78,
        duration: 5,
      },
      {
        _id: 'med5',
        assetName: 'Sample 5',
        fileUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
        fileType: 'video/mp4',
        fileSize: 25.78,
        duration: 5,
      },
      {
        _id: 'med6',
        assetName: 'Sample 6',
        fileUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
        fileType: 'video/mp4',
        fileSize: 25.78,
        duration: 5,
      },
      {
        _id: 'med7',
        assetName: 'Sample 7',
        fileUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
        fileType: 'video/mp4',
        fileSize: 25.78,
        duration: 5,
      },
      {
        _id: 'med8',
        assetName: 'Sample 8',
        fileUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
        fileType: 'video/mp4',
        fileSize: 25.78,
        duration: 5,
      },
    ];

    // total filesize = sum of assets.duration, units in MB
    const fetchedTotalFileSize: number = mediaArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue.fileSize,
      0,
    );
    setListOfMedia(mediaArray);
    setStorageUsed(fetchedTotalFileSize);
  };
  // fetch graphql, fetch media at the beginning
  useEffect(() => {
    fetchInitialPayload();
  }, []);

  const percent = (storageUsed * 100) / Number(process.env.NEXT_PUBLIC_MAX_MB_ASSET);

  return (
    <LayoutMain menuKey="demo/asset">
      <Row>
        <Col span={18}>
          <div className="m-3">
            <MediaList videoData={listOfMedia} isAssetPage fetchInitialPayload={fetchInitialPayload} />
          </div>
        </Col>
        <Col span={6} className="flex flex-col items-center mt-3 mb-3">
          <Typography.Title level={4}>Storage Usage</Typography.Title>
          <Progress
            className="w-parent mx-3 my-2"
            percent={percent}
            strokeColor={percent > 85 ? '#ff4d4f' : '#1890ff'}
            trailColor="#c9c9c9"
            status={percent === 100 ? 'exception' : 'active'}
            showInfo={false}
          />
          <Typography.Text className="text-base">{`${Math.round(storageUsed * 100) / 100} MB out of ${Number(
            process.env.NEXT_PUBLIC_MAX_MB_ASSET,
          )} MB used`}</Typography.Text>
          <Divider />
          <Button onClick={() => message.error("This is a demo, you aren't allowed to make changes")} size="large">
            <FileAddOutlined />

            <p className="hidden lg:inline">Upload Media</p>
          </Button>
        </Col>
      </Row>
    </LayoutMain>
  );
};

export default Asset;
