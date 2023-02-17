import { User } from '@interfaces/user';
import { MarketplaceStats } from './marketplace';

export type ProjectSocial = {
  web: string;
  twitter: string;
  discord: string;
  medium?: string;
  etherScan?: string;
  instagram: string;
};

export type Project = {
  id: string;
  maxSupply: number;
  limit: number;
  mintPrice: string;
  mintPriceAddr: string;
  mintPriceEth: string;
  name: string;
  creator: string;
  creatorAddr: string;
  license: string;
  desc: string;
  image: string;
  scriptType: string[];
  social: ProjectSocial | null;
  scripts: string[];
  styles: string;
  completeTime: number;
  genNFTAddr: string;
  itemDesc: string;
  status: boolean;
  nftTokenURI: string;
  projectURI: string;
  royalty?: number;
  tokenID: string;
  mintingInfo: {
    index: number;
    indexReserve: number;
  };
  creatorProfile?: User;
  mintedTime: number;
  stats: MarketplaceStats;
  traitStat: TraitStats[];
  closeMintUnixTimestamp?: number;
  openMintUnixTimestamp?: number;
  whiteListEthContracts?: string[];
  isFullChain: boolean;
  isHidden: boolean;
  networkFee?: string;
  networkFeeEth?: string;
  totalImages?: number;
  categories?: string[];
};

export type BTCProject = Project & {
  creatorName: string;
  creatorAddrr: string;
};

export type TraitStats = {
  traitName: string;
  traitValuesStat: {
    value: string;
    rarity: number;
  }[];
};
