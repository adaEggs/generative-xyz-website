export interface ICollectionProject {
  name: string;
  tokenId: string;
  thumbnail: string;
}

export interface ICollection {
  contractAddress: string;
  project: ICollectionProject;
  totalSupply: number;
  numberOwners: number;
  numberOwnersPercentage: number;
  floorPrice: {
    amount: string;
  };
  floorPriceOneDay: {
    amount: string;
    percentageChanged: number;
  };
  floorPriceOneWeek: {
    amount: string;
    percentageChanged: number;
  };
  volumeFifteenMinutes: {
    amount: string;
  };
  volumeOneDay: {
    amount: string;
  };
  volumeOneWeek: {
    amount: string;
  };
}
