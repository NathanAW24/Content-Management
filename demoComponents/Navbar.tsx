import React, { useState } from 'react';
import { MenuProps, MenuTheme, Typography, Menu, Avatar, Dropdown, message } from 'antd';
import Image from 'next/image';
import Router from 'next/router';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';

const pageItems = [
  { label: 'Dashboard', key: 'demo' }, // remember to pass the key prop
  { label: 'Campaign', key: 'demo/campaign' }, // which is required
  { label: 'Asset', key: 'demo/asset' },
];

const dropdownMenu = (
  <Menu
    items={[
      {
        key: '1',
        label: (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => message.error('This is a demo, thanks for looking around!')}
          >
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
  const onClickMenu: MenuProps['onClick'] = (e) => {
    Router.push(`/${e.key}`);
  };
  return (
    <div className="flex relative">
      {/* The purpose of the div below --> so the NextJS Image fill is contained within the div */}
      <div className="md:mr-10 relative m-0 ">
        <Image layout="fill" src="/logo.png" />
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[defaultSelectedKeys]}
        items={pageItems}
        className="flex-1"
        onClick={onClickMenu}
        overflowedIndicator={<MenuOutlined />}
      />
      <Dropdown overlay={dropdownMenu} placement="bottomLeft">
        <span style={{ cursor: 'pointer' }}>
          <div className="text-white flex flex-row items-center ">
            <Avatar className="hidden md:inline" size={35}>
              D
            </Avatar>
            <Typography.Text className="pl-3 text-white hidden md:inline">Demo User</Typography.Text>
          </div>
        </span>
      </Dropdown>
    </div>
  );
};

export default Navbar;
