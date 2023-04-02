import React, { useState } from 'react';
import { MenuProps, MenuTheme, Typography, Menu, Avatar, Dropdown } from 'antd';
import Image from 'next/image';
import Router from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import { LogoutOutlined } from '@ant-design/icons';

const pageItems = [
  { label: 'Dashboard', key: '' }, // remember to pass the key prop
  { label: 'Campaign', key: 'campaign' }, // which is required
  { label: 'Asset', key: 'asset' },
];

const dropdownMenu = (
  <Menu
    items={[
      {
        key: '1',
        label: (
          <a target="_blank" rel="noopener noreferrer" href="/api/auth/logout">
            Logout
          </a>
        ),
        icon: <LogoutOutlined />,
        danger: true,
      },
    ]}
  />
);

interface defaultSelectedKeysType {
  defaultSelectedKeys: string;
}

// eslint-disable-next-line react/function-component-definition
const Navbar = ({ defaultSelectedKeys }: defaultSelectedKeysType) => {
  const { user, error, isLoading } = useUser();
  const onClickMenu: MenuProps['onClick'] = (e) => {
    Router.push(`/${e.key}`);
  };
  return (
    <div className="flex relative">
      {/* The purpose of the div below --> so the NextJS Image fill is contained within the div */}
      <div className="mr-10 w-24 relative max-h-fit">
        <Image layout="fill" alt="LOGO" src="/logo.png" />
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[defaultSelectedKeys]}
        items={pageItems}
        className="flex-1"
        onClick={onClickMenu}
      />
      <Dropdown overlay={dropdownMenu} placement="bottomLeft">
        <span style={{ cursor: 'pointer' }}>
          <div className="text-white flex flex-row items-center">
            <Avatar src={user?.picture} size={35} />
            <Typography.Text className="pl-3 text-white">{user?.name}</Typography.Text>
          </div>
        </span>
      </Dropdown>
    </div>
  );
};

export default Navbar;
