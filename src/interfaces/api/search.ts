export interface IGetSearchPayload {
  page: number;
  limit: number;
  keyword: string | string[];
  type: string;
}

export interface IProjectItem {
  objectId: string;
  tokenId: string;
  name: string;
  image: string;
  creatorAddr: string;
  maxSupply: string;
  mintPrice: string;
  index: string;
}

export interface IGetSearchItem {
  objectType: string;
  artist: Record<string, string> | null;
  inscription: Record<string, string> | null;
  project: IProjectItem;
  tokenUri: string | string[] | null;
}

export interface IGetSearchResponse {
  result: IGetSearchItem[];
  page: number;
  pageSize: number;
  total: number | null;
}
