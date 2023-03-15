export interface ICollectionProject {
  name: string;
  tokenId: string;
  thumbnail: string;
  contractAddress: string;
  creatorAddress: string;
  mintingInfo: {
    index: number;
  };
}

export interface ICollectionOwner {
  displayName: string;
  avatar: string;
  walletAddress: string;
  walletAddress_btc: string;
  walletAddress_btc_taproot: string;
  walletAddress_payment: string;
}

export interface ICollectionMarketplace {
  cex_volume: number;
  floor_price: number;
  listed: number;
  mint_volume: number;
  volume: number;
}

export interface ICollectionVolume {
  amount: string;
}

export interface ICollectionPrice {
  amount: string;
  percentageChanged: number;
}

export interface ICollection {
  project: ICollectionProject;
  totalSupply: number;
  numberOwners: number;
  numberOwnersPercentage: number;
  floorPrice: ICollectionVolume;
  floorPriceOneDay: ICollectionProject;
  floorPriceOneWeek: ICollectionPrice;
  volumeFifteenMinutes: ICollectionVolume;
  volumeOneDay: ICollectionVolume;
  volumeOneWeek: ICollectionVolume;
  owner: ICollectionOwner;
  projectMarketplaceData: ICollectionMarketplace;
}
