import { ICollection } from '@interfaces/shop';
import { IPagingParams, IPagingResponse } from './paging';

export type IGetCollectionListParams = IPagingParams;

export interface IGetCollectionListResponse extends IPagingResponse {
  result: Array<ICollection>;
}
