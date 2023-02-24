import { Referral } from '@interfaces/referrals';
import { IPagingParams, IPagingResponse } from './paging';
export interface IPostReferralCode {
  data: boolean;
  error: {
    code: number;
    message: string;
  };
  status: boolean;
}

export interface IGetReferralsParams extends IPagingParams {
  referrerID?: string;
  referreeID?: string;
}

export interface IGetReferralsResponse extends IPagingResponse {
  result: {
    id: string;
    referrerID: string;
    referreeID: string;
    referree: Referral;
    referrer: Referral;
  }[];
}
