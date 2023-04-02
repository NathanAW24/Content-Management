import React, { useState } from 'react';
import { Table } from 'antd';
import Router from 'next/router';
// @ts-expect-error
import styled from 'styled-components';
import { CampaignAntType, FetchedCampaignType } from '../pages/types/CampaignListType';

type columnsType = {
  title: string;
  dataIndex: string;
  key: string;
};

type CustomTablePropsType = {
  dataSource: CampaignAntType[];
  loading: boolean;
};

const columns = [
  // {
  //   title: 'ID',
  //   dataIndex: '_id',
  //   key: '_id',
  // },
  {
    title: 'Campaign',
    dataIndex: 'campaignName',
    key: 'campaignName',
  },
  {
    title: 'Duration (Seconds)',
    dataIndex: 'totalDuration',
    key: 'totalDuration',
  },
  {
    title: 'Monthly Impression',
    dataIndex: 'monthlyImpressionTarget',
    key: 'monthlyImpressionTarget',
  },
  {
    title: 'Cost per Minute',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Total Price',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Start Date',
    dataIndex: 'startDateMoment',
    key: 'startDateMoment',
  },
  {
    title: 'End Date',
    dataIndex: 'endDateMoment',
    key: 'endDateMoment',
  },
];

const StyledTable = styled((props: any) => <Table {...props} />)`
  && tbody > tr:hover > td {
    background: rgba(0, 210, 196, 0.1);
    cursor: pointer;
  }
`;

// eslint-disable-next-line react/function-component-definition
function CustomTable({ dataSource, loading }: CustomTablePropsType) {
  return (
    <StyledTable
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      pagination={{ position: ['bottomCenter'], pageSize: 6 }}
      scroll={{ x: true }}
      onRow={(record: FetchedCampaignType, rowIndex: number) => ({
        onClick: () => {
          Router.push(`/demo/campaign/${record._id}`);
        },
      })}
      rowKey={(record: FetchedCampaignType) => record._id}
    />
  );
}

export default CustomTable;
