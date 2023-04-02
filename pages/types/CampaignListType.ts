import { FetchedAssetType } from './AssetListType';

export type FetchedCampaignType = {
  _id: string;

  campaignName: string;

  status:
    | 'DRAFT'
    | 'PROPOSED'
    | 'REJECTED_NEED_REVISION'
    | 'APPROVED_PENDING_PAYMENT'
    | 'WAITING_DEPLOYMENT'
    | 'DEPLOYED'
    | 'ERROR';

  totalDuration: number;

  monthlyImpressionTarget: number;

  price: number;
  startDate: Date;
  endDate: Date;
  assets?: FetchedAssetType[];
};

export type CampaignAntType = {
  _id: string;

  campaignName: string;

  status:
    | 'DRAFT'
    | 'PROPOSED'
    | 'REJECTED_NEED_REVISION'
    | 'APPROVED_PENDING_PAYMENT'
    | 'WAITING_DEPLOYMENT'
    | 'DEPLOYED'
    | 'ERROR';

  totalDuration: number;

  monthlyImpressionTarget: number;

  price: number;
  totalPrice: number;
  startDateMoment: string;
  endDateMoment: string;
};
