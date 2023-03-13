import { LogLevel } from '@enums/log-level';
import { IUploadFilePayload } from '@interfaces/api/files';
import {
  ICreateBTCProjectPayload,
  ICreateBTCProjectResponse,
  ICreateProjectMetadataPayload,
  ICreateProjectMetadataResponse,
  IGetProjectDetailParams,
  IGetProjectDetailResponse,
  IGetProjectItemsParams,
  IGetProjectItemsQuery,
  IGetProjectItemsTraitsListResponse,
  IGetProjectListParams,
  IGetProjectListResponse,
  IGetProjectTokensResponse,
  IGetProjectVolumeResponse,
  IProjectMarketplaceData,
  IReportProjectPayload,
  IReportProjectResponse,
  IUpdateProjectPayload,
  IUploadBTCProjectFilePayload,
  IUploadBTCProjectFileResponse,
} from '@interfaces/api/project';
import { Project } from '@interfaces/project';
import { deleteMethod, get, post, postFile, put } from '@services/http-client';
import { getCollectionFloorPrice } from '@services/marketplace-btc';
import log from '@utils/logger';
import { orderBy } from 'lodash';
import querystring from 'query-string';

const LOG_PREFIX = 'ProjectService';

const API_PATH = '/project';

export const getProjectDetail = async (
  params: IGetProjectDetailParams
): Promise<IGetProjectDetailResponse> => {
  try {
    const project = await get<IGetProjectDetailResponse>(
      `${API_PATH}/${params.contractAddress}/tokens/${params.projectID}`
    );
    const { tokenID: projectID, maxSupply, mintingInfo } = project;
    if (
      !!projectID &&
      mintingInfo &&
      mintingInfo.index &&
      mintingInfo.index >= maxSupply
    ) {
      const resp = await getCollectionFloorPrice({ projectID });
      return {
        ...project,
        btcFloorPrice: resp.floor_price,
      };
    }
    return { ...project };
  } catch (err: unknown) {
    log('failed to get project detail', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get project detail');
  }
};

export const getProjectVolume = async (
  params: IGetProjectDetailParams,
  { payType }: { payType: string }
): Promise<IGetProjectVolumeResponse> => {
  try {
    const res = await get<IGetProjectVolumeResponse>(
      `${API_PATH}/${params.contractAddress}/tokens/${params.projectID}/volumn?payType=${payType}`
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

    const sortedList = orderBy(
      res.result,
      [
        function (o) {
          return o.buyable;
        },
        function (o) {
          return Number(o.priceBTC);
        },
        function (o) {
          return Number(o.orderInscriptionIndex || o.inscriptionIndex || 0);
        },
      ],
      ['desc', 'asc', 'asc']
    );
    return {
      ...res,
      result: sortedList,
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
    const tasks = res.result.map(async project => {
      const { tokenID: projectID, maxSupply, mintingInfo } = project;
      if (
        !!projectID &&
        mintingInfo &&
        mintingInfo.index &&
        mintingInfo.index >= maxSupply
      ) {
        const resp = await getCollectionFloorPrice({ projectID });
        return {
          ...project,
          btcFloorPrice: resp.floor_price,
        };
      }
      return { ...project };
    });
    const projects = await Promise.all(tasks);
    return {
      ...res,
      result: projects,
    };
  } catch (err: unknown) {
    log('failed to get project list', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get project list');
  }
};

export const getProjectItemsTraitsList = async ({
  contractAddress,
  projectID,
}: IGetProjectDetailParams): Promise<IGetProjectItemsTraitsListResponse[]> => {
  try {
    // const qs = '?' + querystring.stringify(params);
    const res = await get<IGetProjectItemsTraitsListResponse[]>(
      `${API_PATH}/${contractAddress}/tokens/${projectID}/token-traits`
    );
    return res;
  } catch (err: unknown) {
    log('failed to get project items trait list', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get project items trait list');
  }
};

export const uploadUpdatedTraitList = async (
  payload: IUploadFilePayload & IGetProjectDetailParams
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await postFile<IUploadFilePayload, any>(
      `${API_PATH}/${payload.contractAddress}/tokens/${payload.projectID}/token-traits`,
      payload
    );
    return res;
  } catch (err: unknown) {
    log('failed to upload file', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to upload file');
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

export const updateProject = async (
  contractAddress: string,
  projectId: string,
  payload: IUpdateProjectPayload
): Promise<Project> => {
  try {
    const res = await put<IUpdateProjectPayload, Project>(
      `${API_PATH}/${contractAddress}/tokens/${projectId}`,
      payload
    );
    return res;
  } catch (err: unknown) {
    log('failed to create btc project', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to create btc project');
  }
};

export const deleteProject = async (
  contractAddress: string,
  projectId: string
): Promise<Project> => {
  try {
    const res = await deleteMethod<Project>(
      `${API_PATH}/${contractAddress}/${projectId}`
    );
    return res;
  } catch (err: unknown) {
    log('failed to create btc project', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to create btc project');
  }
};

export const reportProject = async (
  { projectID }: { projectID: string },
  payload: IReportProjectPayload
): Promise<void> => {
  try {
    await post<IReportProjectPayload, IReportProjectResponse>(
      `${API_PATH}/${projectID}/report`,
      payload
    );
  } catch (err: unknown) {
    log('failed to report project', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to report project');
  }
};

export const projectMarketplaceData = async ({
  projectId,
  contractAddress,
}: {
  projectId: string;
  contractAddress: string;
}): Promise<IProjectMarketplaceData> => {
  try {
    const res = await get<IProjectMarketplaceData>(
      `${API_PATH}/${contractAddress}/tokens/${projectId}/marketplace-data`
    );

    return res;
  } catch (err: unknown) {
    log('failed to report project', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to report project');
  }
};
