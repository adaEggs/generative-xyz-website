import { Category } from '@interfaces/category';
import { IPagingParams, IPagingResponse } from '@interfaces/api/paging';

export type IGetCategoryListParams = IPagingParams;

export interface IGetCategoryListResponse extends IPagingResponse {
  result: Array<Category>;
}
