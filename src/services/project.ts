import { LogLevel } from '@enums/log-level';
import {
  ICreateBTCProjectPayload,
  ICreateBTCProjectResponse,
  ICreateProjectMetadataPayload,
  ICreateProjectMetadataResponse,
  IGetProjectDetailParams,
  IGetProjectDetailResponse,
  IGetProjectItemsParams,
  IGetProjectItemsQuery,
  IGetProjectListParams,
  IGetProjectListResponse,
  IGetProjectTokensResponse,
  IUploadBTCProjectFilePayload,
  IUploadBTCProjectFileResponse,
} from '@interfaces/api/project';
import { get, post, postFile } from '@services/http-client';
import log from '@utils/logger';
import querystring from 'query-string';
import { orderBy } from 'lodash';

const LOG_PREFIX = 'ProjectService';

const API_PATH = '/project';

export const getProjectDetail = async (
  params: IGetProjectDetailParams
): Promise<IGetProjectDetailResponse> => {
  try {
    const res = await get<IGetProjectDetailResponse>(
      `${API_PATH}/${params.contractAddress}/tokens/${params.projectID}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get project detail', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get project detail');
  }
};

export const getRandomProject =
  async (): Promise<IGetProjectDetailResponse> => {
    try {
      const res = await get<IGetProjectDetailResponse>(`${API_PATH}/random`);
      return res;
    } catch (err: unknown) {
      log('failed to get project detail', LogLevel.ERROR, LOG_PREFIX);
      throw Error('Failed to get project detail');
    }
  };

export const getProjectItems = async (
  params: IGetProjectItemsParams,
  query: IGetProjectItemsQuery
): Promise<IGetProjectTokensResponse> => {
  try {
    const qs = '?' + querystring.stringify(query);
    const res = await get<IGetProjectTokensResponse>(
      `${API_PATH}/${params.contractAddress}/tokens${qs}`
    );
    return {
      ...res,
      result: orderBy(res.result, ['buyable'], 'desc'),
    };
  } catch (err: unknown) {
    log('failed to get project items', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get project items');
  }
};

export const createProjectMetadata = async (
  payload: ICreateProjectMetadataPayload
): Promise<ICreateProjectMetadataResponse> => {
  try {
    const res = await post<
      ICreateProjectMetadataPayload,
      ICreateProjectMetadataResponse
    >(`${API_PATH}`, payload);
    return res;
  } catch (err: unknown) {
    log('failed to create project metadata', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to create project metadata');
  }
};

export const getProjectList = async (
  params: IGetProjectListParams
): Promise<IGetProjectListResponse> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetProjectListResponse>(`${API_PATH}${qs}`);
    return res;
  } catch (err: unknown) {
    log('failed to get project list', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get project list');
  }
};

export const getProjectListMinited = async (
  params: IGetProjectListParams
): Promise<IGetProjectListResponse> => {
  try {
    const qs = '?' + querystring.stringify(params);
    const res = await get<IGetProjectListResponse>(`${API_PATH}${qs}`);
    return res;
  } catch (err: unknown) {
    log('failed to get project list minted', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get project list minted');
  }
};

export const createBTCProject = async (
  payload: ICreateBTCProjectPayload
): Promise<ICreateBTCProjectResponse> => {
  try {
    const res = await post<ICreateBTCProjectPayload, ICreateBTCProjectResponse>(
      `${API_PATH}/btc`,
      payload
    );
    return res;
  } catch (err: unknown) {
    log('failed to create btc project', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to create btc project');
  }
};

export const uploadBTCProjectFiles = async (
  payload: IUploadBTCProjectFilePayload
): Promise<IUploadBTCProjectFileResponse> => {
  try {
    const res = await postFile<
      IUploadBTCProjectFilePayload,
      IUploadBTCProjectFileResponse
    >(`${API_PATH}/btc/files`, payload);
    return res;
  } catch (err: unknown) {
    log('failed to upload btc project file', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to upload btc project file');
  }
};
