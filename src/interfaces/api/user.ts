import { User } from '@interfaces/user';
import { IPagingResponse } from './paging';

export interface IGetArtistsResponse extends IPagingResponse {
  result: Array<User>;
}
