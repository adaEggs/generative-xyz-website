export interface IDaoProject {
  id: string;
  uuid: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface IGetDaoArtist {
  id: string;
  uuid: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface IGetDaoProjectsPayload {
  keyword?: string | string[];
  status?: string | string[];
  limit: number;
  cursor?: string;
  sort?: string | string[];
}

export interface IGetDaoProjectsResponse {
  result: IDaoProject[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  cursor: string;
  sort: number;
}

export interface IGetDaoArtistsPayload {
  keyword?: string | string[];
  status?: string | string[];
  limit: number;
  cursor?: string;
  sort?: string | string[];
}

export interface IGetDaoArtistsResponse {
  result: IGetDaoArtist[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  cursor: string;
  sort: number;
}
