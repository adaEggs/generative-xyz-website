import { Project } from '@interfaces/project';
export interface IGetSearchPayload {
  page: number;
  limit: number;
  keyword: string | string[];
  type: string;
}

export interface IGetSearchItem {
  objectType: string;
  artist: Record<string, string> | null;
  inscription: Record<string, string> | null;
  project: Project;
  tokenUri: string | string[] | null;
}

export interface IGetSearchResponse {
  result: IGetSearchItem[];
  page: number;
  pageSize: number;
  total: number | null;
  totalPage: number;
}
