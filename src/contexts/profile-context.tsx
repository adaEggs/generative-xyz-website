import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { useAppSelector } from '@redux';
import {
  getProfileByWallet,
  getProfileProjectsByWallet,
  getProfileTokens,
} from '@services/profile';
import { User } from '@interfaces/user';
import {
  getListingTokensByWallet,
  getMakeOffersByWallet,
} from '@services/marketplace';
import { getUserSelector } from '@redux/user/selector';
import { IGetProfileTokensResponse } from '@interfaces/api/token-uri';
import { IGetProjectItemsResponse } from '@interfaces/api/project';
import {
  IListingTokensResponse,
  ITokenOfferListResponse,
} from '@interfaces/api/marketplace';
import { useRouter } from 'next/router';
import useAsyncEffect from 'use-async-effect';
import { ROUTE_PATH } from '@constants/route-path';
import { SimpleLoading } from '@components/SimpleLoading';
import { TokenOffer } from '@interfaces/token';
import { NETWORK_CHAIN_ID } from '@constants/config';
import { ErrorMessage } from '@enums/error-message';
import useContractOperation from '@hooks/useContractOperation';
import CancelTokenOfferOperation from '@services/contract-operations/generative-marketplace/cancel-token-offer';
import { IGetTokenActivitiesResponse } from '@interfaces/api/nfts';

const LOG_PREFIX = 'ProfileContext';

export interface IProfileContext {
  currentUser: User | null;
  userWalletAddress?: string;
  profileTokens?: IGetProfileTokensResponse;
  profileProjects?: IGetProjectItemsResponse;
  profileMakeOffer?: ITokenOfferListResponse;
  profileListing?: IListingTokensResponse;
  profileActivity?: IGetTokenActivitiesResponse;

  isLoaded: boolean;

  isLoadedProfileTokens: boolean;
  isLoadedProfileProjects: boolean;
  isLoadedProfileMakeOffer: boolean;
  isLoadedProfileListing: boolean;
  isLoadedProfileActivity: boolean;

  handleFetchTokens: () => void;
  handleFetchProjects: () => void;
  handleFetchMakeOffers: () => void;
  handleFetchListingTokens: () => void;
  handleFetchProfileActivity: () => void;
  handleCancelOffer: (offer: TokenOffer) => void;
}

const initialValue: IProfileContext = {
  currentUser: null,
  isLoaded: false,
  isLoadedProfileTokens: false,
  isLoadedProfileProjects: false,
  isLoadedProfileMakeOffer: false,
  isLoadedProfileListing: false,
  isLoadedProfileActivity: false,
  handleFetchTokens: () => new Promise<void>(r => r()),
  handleFetchProjects: () => new Promise<void>(r => r()),
  handleFetchMakeOffers: () => new Promise<void>(r => r()),
  handleFetchListingTokens: () => new Promise<void>(r => r()),
  handleCancelOffer: () => new Promise<void>(r => r()),
  handleFetchProfileActivity: () => new Promise<void>(r => r()),
};

export const ProfileContext =
  React.createContext<IProfileContext>(initialValue);

export const ProfileProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const user = useAppSelector(getUserSelector);
  const router = useRouter();
  const [userWalletAddress, setUserWalletAddress] = useState<
    string | undefined
  >();
  const { walletAddress } = router.query as { walletAddress: string };
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { call: cancelOffer } = useContractOperation(
    CancelTokenOfferOperation,
    true
  );

  const [profileTokens, setProfileTokens] = useState<
    IGetProfileTokensResponse | undefined
  >();

  const [isLoadedProfileTokens, setIsLoadedProfileTokens] =
    useState<boolean>(false);

  const [profileProjects, setProfileProjects] = useState<
    IGetProjectItemsResponse | undefined
  >();

  const [isLoadedProfileProjects, setIsLoadedProfileProjects] =
    useState<boolean>(false);

  const [profileMakeOffer, setProfileMakeOffer] = useState<
    ITokenOfferListResponse | undefined
  >();

  const [isLoadedProfileMakeOffer, setIsLoadedProfileMakeOffer] =
    useState<boolean>(false);

  const [profileListing, setProfileListing] = useState<
    IListingTokensResponse | undefined
  >();

  const [profileActivity, _] = useState<
    IGetTokenActivitiesResponse | undefined
  >();

  const [isLoadedProfileListing, setIsLoadedProfileListing] =
    useState<boolean>(false);

  const [isLoadedProfileActivity, setIsLoadedProfileActivity] =
    useState<boolean>(false);

  const handleFetchProjects = useCallback(async () => {
    try {
      if (currentUser?.walletAddress) {
        let page = (profileProjects && profileProjects?.page) || 0;
        page += 1;

        setIsLoadedProfileProjects(false);
        const projects = await getProfileProjectsByWallet({
          walletAddress: currentUser.walletAddress,
          page,
          limit: 12,
        });

        if (projects) {
          if (profileProjects && profileProjects?.result) {
            projects.result = [...profileProjects.result, ...projects.result];
          }

          setProfileProjects(projects);
          setIsLoadedProfileProjects(true);
        }
      }
    } catch (ex) {
      log('can not fetch created collections', LogLevel.ERROR, LOG_PREFIX);
      setIsLoadedProfileProjects(true);
    }
  }, [currentUser, profileProjects]);

  const handleFetchListingTokens = useCallback(async () => {
    try {
      if (currentUser?.walletAddress) {
        const listingTokens = await getListingTokensByWallet({
          walletAddress: currentUser.walletAddress,
          closed: false,
        });
        if (listingTokens && listingTokens) {
          setProfileListing(listingTokens);
        }
        setIsLoadedProfileListing(true);
      }
    } catch (ex) {
      log('can not fetch listing tokens', LogLevel.ERROR, LOG_PREFIX);
    }
  }, [currentUser]);

  const handleFetchMakeOffers = useCallback(async () => {
    try {
      if (currentUser?.walletAddress) {
        setIsLoadedProfileMakeOffer(false);
        const makeOffers = await getMakeOffersByWallet({
          walletAddress: currentUser.walletAddress,
          closed: false,
        });
        if (makeOffers) {
          setProfileMakeOffer(makeOffers);
          setIsLoadedProfileMakeOffer(true);
        }
      }
    } catch (ex) {
      log('can not fetch listing tokens', LogLevel.ERROR, LOG_PREFIX);
      setIsLoadedProfileMakeOffer(true);
    }
  }, [currentUser]);

  const handleFetchTokens = useCallback(async () => {
    try {
      if (currentUser?.walletAddress) {
        let page = (profileTokens && profileTokens?.page) || 0;
        page += 1;

        setIsLoadedProfileTokens(false);
        const tokens = await getProfileTokens({
          walletAddress: currentUser.walletAddress,
          limit: 12,
          page,
        });
        if (tokens) {
          if (profileTokens && profileTokens?.result) {
            tokens.result = [...profileTokens.result, ...tokens.result];
          }

          setProfileTokens(tokens);
          setIsLoadedProfileTokens(true);
        }
      }
    } catch (ex) {
      log('can not fetch tokens', LogLevel.ERROR, LOG_PREFIX);
      setIsLoadedProfileTokens(true);
    }
  }, [currentUser, profileTokens]);

  const handleFetchProfileActivity = useCallback(async () => {
    try {
      if (currentUser?.walletAddress) {
        // const profileActivity = await getListingTokensByWallet({
        //   walletAddress: currentUser.walletAddress,
        //   closed: false,
        // });
        // if (listingTokens && listingTokens) {
        //   setProfileListing(listingTokens);
        // }

        // setProfileActivity({
        //   updated_at: '11/11/2022';
        //   items: [
        //     nft_transactions: Array<unknown>;
        //     [x: string]: unknown;
        //   ],
        //   pagination: unknown;
        // });
        setIsLoadedProfileActivity(true);
      }
    } catch (ex) {
      log('can not fetch listing tokens', LogLevel.ERROR, LOG_PREFIX);
    }
  }, [currentUser]);

  const handleFetchProfileByWallet = useCallback(async () => {
    try {
      if (walletAddress) {
        const getUser = await getProfileByWallet({
          walletAddress: walletAddress.toLowerCase(),
        });
        if (getUser && getUser.id) {
          setCurrentUser(getUser);
        } else {
          router.push(ROUTE_PATH.MARKETPLACE);
        }
      }
    } catch (ex) {
      log('can not fetch tokens', LogLevel.ERROR, LOG_PREFIX);
    }
  }, [walletAddress]);

  const handleCancelOffer = async (offer: TokenOffer): Promise<void> => {
    const tx = await cancelOffer({
      offerId: offer.offeringID,
      chainID: NETWORK_CHAIN_ID,
    });

    if (!tx) {
      log('Cancel token offer transaction error.', LogLevel.ERROR, LOG_PREFIX);
      throw Error(ErrorMessage.DEFAULT);
    }

    // Refresh offers data
    handleFetchMakeOffers();
  };

  useAsyncEffect(async () => {
    setIsLoaded(false);
    if (!router.isReady) return;
    if (walletAddress) {
      setUserWalletAddress(walletAddress);
      await handleFetchProfileByWallet();
      setTimeout(() => {
        setIsLoaded(true);
      }, 400);
    } else {
      if (!user) {
        router.push(ROUTE_PATH.MARKETPLACE);
        return;
      } else {
        setCurrentUser(user);
        setTimeout(() => {
          setIsLoaded(true);
        }, 400);
      }
    }
  }, [walletAddress, router]);

  useAsyncEffect(async () => {
    if (!router.isReady) return;
    await handleFetchTokens();
    await handleFetchMakeOffers();
    await handleFetchProjects();
    await handleFetchListingTokens();
  }, [currentUser, user]);

  const contextValues = useMemo((): IProfileContext => {
    return {
      currentUser,
      userWalletAddress,
      profileTokens,
      profileProjects,
      profileMakeOffer,
      profileListing,
      profileActivity,

      isLoaded,

      isLoadedProfileTokens,
      isLoadedProfileProjects,
      isLoadedProfileMakeOffer,
      isLoadedProfileListing,
      isLoadedProfileActivity,

      handleFetchTokens,
      handleFetchProjects,
      handleFetchMakeOffers,
      handleFetchListingTokens,
      handleCancelOffer,
      handleFetchProfileActivity,
    };
  }, [
    currentUser,
    userWalletAddress,
    profileTokens,
    profileProjects,
    profileMakeOffer,
    profileListing,
    profileActivity,

    isLoaded,

    isLoadedProfileTokens,
    isLoadedProfileProjects,
    isLoadedProfileMakeOffer,
    isLoadedProfileListing,
    isLoadedProfileActivity,

    handleFetchTokens,
    handleFetchProjects,
    handleFetchMakeOffers,
    handleFetchListingTokens,
    handleCancelOffer,
    handleFetchProfileActivity,
  ]);

  return (
    <ProfileContext.Provider value={contextValues}>
      <SimpleLoading isCssLoading={false} />
      {children}
    </ProfileContext.Provider>
  );
};
