import React, { useEffect, useState } from 'react';
import { Button, Upload, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import gqlInit from './gql';

type UserDto = {
  _id: string;
  userSub: string;
  email: string;
  profileName: string;
  profileUrl: string;
  roles: string[];
  assetStorageUsed: number;
  modifiedAt: Date;
  createdAt: Date;
};

// eslint-disable-next-line react/function-component-definition
const useUserMongoDB = () => {
  const { user, error, isLoading } = useUser();
  const [isLoadingUser, setLoadingUser] = useState(false);
  const [userMDB, setUserMDB] = useState<UserDto>();

  const fetchUserInitial = async () => {
    const GET_USER = `
    {
        getUser(args: { userSub: "${user?.sub}" }) {
            _id
            userSub
            email
            profileName
            profileUrl
            roles
            assetStorageUsed
            modifiedAt
            createdAt
        }
    }
  `;

    const gqlclient = gqlInit(user);
    const fetchedData: { getUser: UserDto } = await gqlclient.request(GET_USER);
    setUserMDB(fetchedData?.getUser);
  };

  useEffect(() => {
    if (!user) return;
    fetchUserInitial();
  }, [user]);

  return { isLoadingUser, userMDB };
};

export default useUserMongoDB;
