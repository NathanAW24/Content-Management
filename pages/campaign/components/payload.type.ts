export type CampaignPayload = {
  campaignName: string;
  owner: string;
  assets: string[];
  status: string;
  totalDuration: number;
  preferences: string[];
  monthlyImpressionTarget: number;
  startDate: Date;
  endDate: Date;
  deployWhenApproved?: boolean;
};
