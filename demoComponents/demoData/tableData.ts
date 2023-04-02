import { CampaignAntType } from '../../pages/demo/types';

const campaignData: any = [
  {
    _id: '1',
    campaignName: 'Campaign 1',
    status: 'PROPOSED',
    totalDuration: 200,
    monthlyImpressionTarget: 30,
    price: 5,
    totalPrice: 20000,
    startDateMoment: '18-09-21',
    endDateMoment: '18-10-23',
  },
  {
    _id: '2',
    campaignName: 'Campaign 2',
    status: 'PROPOSED',
    totalDuration: 200,
    monthlyImpressionTarget: 30,
    price: 5,
    totalPrice: 15000,
    startDateMoment: '18-09-21',
    endDateMoment: '18-10-23',
  },
  {
    _id: '3',
    campaignName: 'Campaign 3',
    status: 'PROPOSED',
    totalDuration: 200,
    monthlyImpressionTarget: 30,
    price: 5,
    totalPrice: 10000,
    startDateMoment: '18-09-21',
    endDateMoment: '18-10-23',
  },
  {
    _id: '4',
    campaignName: 'Campaign 4',
    status: 'PROPOSED',
    totalDuration: 200,
    monthlyImpressionTarget: 30,
    price: 5,
    totalPrice: 40000,
    startDateMoment: '18-09-21',
    endDateMoment: '18-10-23',
  },
  {
    _id: '5',
    campaignName: 'Campaign 5',
    status: 'PROPOSED',
    totalDuration: 200,
    monthlyImpressionTarget: 30,
    price: 5,
    totalPrice: 12500,
    startDateMoment: '18-09-21',
    endDateMoment: '18-10-23',
  },
  {
    _id: '6',
    campaignName: 'Campaign 6',
    status: 'PROPOSED',
    totalDuration: 200,
    monthlyImpressionTarget: 30,
    price: 5,
    totalPrice: 25000,
    startDateMoment: '18-09-21',
    endDateMoment: '18-10-23',
  },
  {
    _id: '7',
    campaignName: 'Campaign 7',
    status: 'PROPOSED',
    totalDuration: 200,
    monthlyImpressionTarget: 30,
    price: 5,
    totalPrice: 50000,
    startDateMoment: '18-09-21',
    endDateMoment: '18-10-23',
  },
];

const pieData = campaignData.map((campaign: any) => ({
  type: campaign.campaignName,
  value: campaign.totalPrice,
}));

export default campaignData;

export { pieData };
