import { HOST_ORDINALS_EXPLORER } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import {
  CollectedNFTStatus,
  ICollectedNFTItem,
  IGetCollectedNFTsResp,
  IGetMintingCollectedNFTResp,
  IGetProfileResponse,
  IInscriptionResp,
  IUpdateProfilePayload,
  IUpdateProfileResponse,
} from '@interfaces/api/profile';
import { IGetProjectItemsResponse } from '@interfaces/api/project';
import { IGetProfileTokensResponse } from '@interfaces/api/token-uri';
import { get, put } from '@services/http-client';
import log from '@utils/logger';

const LOG_PREFIX = 'ProfileService';

const API_PATH = '/profile';

export const getProfile = async (): Promise<IGetProfileResponse> => {
  try {
    return await get<IGetProfileResponse>(`${API_PATH}`);
  } catch (err: unknown) {
    log('failed to get profile', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get profile');
  }
};

export const getProfileByWallet = async ({
  walletAddress,
}: {
  walletAddress: string;
}): Promise<IGetProfileResponse> => {
  try {
    return await get<IGetProfileResponse>(
      `${API_PATH}/wallet/${walletAddress}`
    );
  } catch (err: unknown) {
    log('failed to get profile', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get profile');
  }
};

export const getProfileProjects =
  async (): Promise<IGetProjectItemsResponse> => {
    try {
      return await get<IGetProjectItemsResponse>(`${API_PATH}/projects`);
    } catch (err: unknown) {
      log('failed to get profile projects', LogLevel.ERROR, LOG_PREFIX);
      throw Error('Failed to get profile projects');
    }
  };

export const getProfileProjectsByWallet = async ({
  walletAddress,
  limit = 10,
  page = 1,
}: {
  walletAddress: string;
  limit?: number;
  page?: number;
}): Promise<IGetProjectItemsResponse> => {
  try {
    return await get<IGetProjectItemsResponse>(
      `${API_PATH}/wallet/${walletAddress}/projects?limit=${limit}&page=${page}`
    );
  } catch (err: unknown) {
    log('failed to get profile', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get profile');
  }
};

export const getProfileTokens = async ({
  walletAddress,
  limit = 10,
  page = 1,
}: {
  walletAddress: string;
  limit?: number;
  page?: number;
}): Promise<IGetProfileTokensResponse> => {
  try {
    return await get<IGetProfileTokensResponse>(
      `${API_PATH}/wallet/${walletAddress}/nfts?limit=${limit}&page=${page}`
    );
  } catch (err: unknown) {
    log('failed to get profile nfts', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get profile nfts');
  }
};

export const updateProfile = async (
  payload: IUpdateProfilePayload
): Promise<IUpdateProfileResponse> => {
  try {
    const res = await put<IUpdateProfilePayload, IUpdateProfileResponse>(
      API_PATH,
      payload
    );
    return res;
  } catch (err: unknown) {
    log('failed to update profile', LogLevel.ERROR, LOG_PREFIX);
    throw Error();
  }
};

// Collected tab

export const getCollectedNFTs = async (
  btcAddress: string
): Promise<ICollectedNFTItem[]> => {
  try {
    const res = await get<IGetCollectedNFTsResp>(
      `/wallet/wallet-info?address=${btcAddress}`
    );
    const dataRes = Object.values(res.inscriptions || {});
    const tasks = dataRes.map(async (inscriptionID: string) => {
      return getCollectedNFTDetail(inscriptionID);
    });
    const data = await Promise.all(tasks);
    return data;
  } catch (err: unknown) {
    log('failed to get collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get collected NFTs');
  }
};

export const getCollectedNFTDetail = async (
  inscriptionID: string
): Promise<ICollectedNFTItem> => {
  try {
    const res = await fetch(
      `${HOST_ORDINALS_EXPLORER}/api/inscription/${inscriptionID}`
    );
    const dataRes: IInscriptionResp = await res.json();
    const randomStr = Date.now().toString();
    return {
      inscriptionID,
      inscriptionNumber: `${dataRes.number}`,
      contentType: dataRes.content_type,
      name: randomStr,
      orderID: randomStr,
      isCompleted: false,
      image: '',
      contentLength: randomStr,
      status: CollectedNFTStatus.success,
    };
  } catch (err: unknown) {
    log('failed to get inscription detail', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get inscription detail');
  }
};

export const getMintingCollectedNFTs = async (): Promise<
  ICollectedNFTItem[]
> => {
  try {
    const res = await get<Array<IGetMintingCollectedNFTResp>>(
      '/wallet/mint-status'
    );
    let tasks: ICollectedNFTItem[] = [];
    if (res && res.length > 0) {
      tasks = res.map((item: IGetMintingCollectedNFTResp) => {
        const randomStr = Date.now().toString();
        return {
          image: item.fileURI,
          name: '',
          projectName: item.projectName,
          projectID: item.projectID,
          orderID: randomStr,
          isCompleted: false,
          contentLength: randomStr,
          status: CollectedNFTStatus.minting,
        };
      });
    }
    return tasks;
  } catch (err: unknown) {
    log('failed to get minting collected NFTs', LogLevel.ERROR, LOG_PREFIX);
    throw Error('Failed to get collected NFTs');
  }
};
