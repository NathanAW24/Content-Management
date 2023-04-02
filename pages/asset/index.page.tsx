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
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import LayoutMain from '../../components/LayoutMain';
import VerifyEmailPage from '../../components/VerifyEmailPage';
// import ProgressBar from '../../components/ProgressBar';
import MediaList from '../../components/MediaList';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import gqlInit from '../../components/gql';
import { MediaDataType } from '../types';
import useUserMongoDB from '../../components/useUserMongoDB';
import { storage } from '../../components/firebase';

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
  const { user, error, isLoading } = useUser();
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
  const fetchInitialPayload = async () => {
    if (!user) return;
    const GET_ASSETS = `
        query {
          getUser(args: { userSub: "${user.sub}" }) {
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
    if (!user) return;
    fetchInitialPayload();
  }, [user]);

  const uploadRef = useRef<HTMLInputElement>(null);

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setFileInputDurationOnLoad(e.currentTarget.duration);
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  function UploadAsset() {
    if (!uploadFile) return null;
    return (
      <>
        {uploadFile && (
          <>
            {uploadFile.type === 'video/mp4' ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video className="h-36 my-5" controls onLoadedMetadata={(e) => handleMetadata(e)}>
                <source src={previewFileURL} type="video/mp4" />
              </video>
            ) : (
              <Image src={previewFileURL} className="h-36 my-5" />
            )}
            {uploadFile.type.indexOf('image') === 0 && (
              <div>
                <Typography.Text className="mx-2 ">Input duration for image:</Typography.Text>
                <InputNumber
                  min={1}
                  max={Number(process.env.NEXT_PUBLIC_MAXIMUM_MEDIA_LENGTH_SEC)}
                  defaultValue={3}
                  autoFocus
                  value={fileInputDurationOnLoad}
                  size="large"
                  onChange={(value: number) => setFileInputDurationOnLoad(value)}
                />
                <Typography.Text className="mx-2">seconds</Typography.Text>
              </div>
            )}

            <Descriptions title="Media Information" bordered className="bg-white p-5 rounded-lg my-10">
              <Descriptions.Item label="File name" span={3}>
                {uploadFile.name}
              </Descriptions.Item>
              <Descriptions.Item label="File size" span={3}>
                {Math.round((uploadFile.size / (1024 * 1024)) * 100) / 100} MB
              </Descriptions.Item>
              <Descriptions.Item label="Duration" span={3}>
                {Math.round(fileInputDurationOnLoad * 100) / 100} seconds
              </Descriptions.Item>
              <Descriptions.Item label="File Type" span={3}>
                <Badge status="processing" text={uploadFile.type} />
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </>
    );
  }

  const onUploadFileButtonClick = () => {
    uploadRef?.current?.click();
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    // default duration is 3. if it is video, there will be a call back that updates it (in media sequence) once it is fully loaded.\

    const temp: any = input.files?.item(0)!;
    temp.duration = temp.duration ? temp.duration : 3;
    const file: FileInputType = temp;
    if (!file) return;
    const fileFormat = file?.type.split('/')[1];
    const acceptedFormat = ['jpeg', 'mp4'];

    // if duration exceed total allowed duration
    if (fileInputDurationOnLoad > Number(process.env.NEXT_PUBLIC_MAXIMUM_MEDIA_LENGTH_SEC)) {
      message.error('One campaign maximum duration is 10 minutes! Please separate to other campaigns!');
      return false;
    }

    if (file.size / 1024 / 1024 > Number(process.env.NEXT_PUBLIC_MAX_MB_ASSET) - storageUsed) {
      message.error('Your storage capacity is full. Delete assets to gain spaces/ Upgrade to our next plan.');
      return false;
    }

    if (!acceptedFormat.includes(fileFormat)) {
      message.error(`Your file format is ${fileFormat}. You can only upload ${acceptedFormat}`);
      return false;
    }
    // You can remove this validation if you want
    const isLt5M = file.size / 1024 / 1024 < 500;
    if (!isLt5M) {
      message.error('File must smaller than 500MB!');
      return isLt5M;
    }
    setUploadFile(file);
    message.info('Verify your media and confirm your upload');
    setIsOnConfirmingUpload(true);
  };

  useEffect(() => {
    if (!uploadFile) {
      setPreviewFileURL('');
      return;
    }

    const objectUrl = URL.createObjectURL(uploadFile);
    setPreviewFileURL(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadFile]);

  const onRemoveFile = () => {
    setUploadFile(undefined);
    setFileInputDurationOnLoad(3);
    setPreviewFileURL('');
    setIsOnConfirmingUpload(false);
    setPercentUpload(0);
    if (uploadRef.current) uploadRef.current.value = '';
  };

  const onSubmit = async () => {
    // steps
    // 1. upload to graphql to get MDB _id
    // 2. upload to cloud storage with the _id and get the fileUrl
    // 3. update fileUrl with graphql to MDB.
    if (!uploadFile || !userMDB || !uploadFile) {
      setErrorMessage('Error uploading file. Some of the variables are undefined.');
      throw new Error('Upload');
    }
    // upload to graphql
    const ADD_ASSETS = `
      mutation {
        createAsset (input: {
          assetName: "${uploadFile.name}",
          owner: "${userMDB._id}",
          duration: ${fileInputDurationOnLoad},
          fileSize: ${uploadFile.size / (1024 * 1024)},
          fileType: "${uploadFile.type}",
          fileUrl: "${
            process.env.NEXT_PUBLIC_PLACEHOLDER_VIDEO !== '' ? process.env.NEXT_PUBLIC_PLACEHOLDER_VIDEO : 'null'
          }",
        }){
          _id
        }
      }
      `;
    setIsUploading(true);
    const gqlclient = gqlInit(user);
    const fetchedData: { createAsset: { _id: string } } = await gqlclient.request(ADD_ASSETS);
    const fileId = fetchedData.createAsset._id;
    // upload to firebase storage
    const fileExtension = uploadFile.type.split('/')[1];
    const fileRef = ref(storage, `userAssets/${fileId}.${fileExtension}`);
    const uploadTask = uploadBytesResumable(fileRef, uploadFile);
    uploadTask.on(
      'state_changed',
      (snap) => {
        setPercentUpload(Math.round((snap.bytesTransferred / snap.totalBytes) * 10000) / 100);
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        throw new Error(String(err));
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const UPDATE_FILEURL = `
        mutation {
          editAsset (args: {
            _id: "${fileId}",
            fileUrl: "${downloadURL}",
          }){
            _id
            assetName
            fileUrl
            fileType
            fileSize
            duration
          }
        }
        `;

        const fetchedUpdatedAsset: { editAsset: MediaDataType[] } = await gqlclient.request(UPDATE_FILEURL);
        setIsUploading(false);
        setIsOnConfirmingUpload(false);
        message.info('Upload Success! Your new asset is shown below.');
        onRemoveFile();
        fetchInitialPayload();
      },
    );
  };

  // auth0 stuff
  if (isLoading) return <Spin>Loading...</Spin>;
  if (error) return <div>{error.message}</div>;
  // check if user exist and user_email is verified.
  if (user && !user?.email_verified) {
    return <VerifyEmailPage />;
  }

  const percent = (storageUsed * 100) / Number(process.env.NEXT_PUBLIC_MAX_MB_ASSET);

  return (
    <LayoutMain menuKey="asset">
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
          {!isUploading && <UploadAsset />}

          {isOnConfirmingUpload ? (
            <>
              {isUploading ? (
                <>
                  <Progress
                    className="w-parent my-2"
                    percent={percentUpload}
                    strokeColor={percentUpload > 85 ? '#008000' : '#1890ff'}
                    trailColor="#c9c9c9"
                    status={percentUpload === 100 ? 'exception' : 'active'}
                    showInfo={false}
                  />
                  <Typography.Text>Uploading in progress... </Typography.Text>
                  <Typography.Text>Do not close your browser</Typography.Text>
                  <Typography.Text>{percentUpload} %</Typography.Text>
                </>
              ) : (
                <div className="flex flex-row space-x-3">
                  <Button onClick={onRemoveFile} size="large" danger>
                    <DeleteOutlined />
                    Remove File
                  </Button>
                  <Button onClick={onSubmit} size="large" type="primary">
                    <FileAddOutlined />
                    Confirm Upload
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Button onClick={onUploadFileButtonClick} size="large">
              <FileAddOutlined />
              Upload Media
            </Button>
          )}
          {errorMessage !== '' && errorMessage}

          <input ref={uploadRef} type="file" style={{ display: 'none' }} onChange={(e) => onInputChange(e)} />
        </Col>
      </Row>
    </LayoutMain>
  );
};

export default withPageAuthRequired(Asset);
