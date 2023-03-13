import { MintGenerativeStep } from '@enums/mint-generative';

export interface IMintStep {
  path: MintGenerativeStep;
  title: string;
  stepIndex: number;
}

export interface IFormValue {
  maxSupply: number;
  mintPrice: string;
  name: string;
  description: string;
  thirdPartyScripts: Array<string>;
  tokenDescription: string;
  royalty: number;
  socialWeb: string;
  socialTwitter: string;
  socialDiscord: string;
  socialMedium: string;
  socialInstagram: string;
  license: string;
  tags: Array<string>;
  categories: Array<string>;
}

export interface IBTCFormValue {
  maxSupply: number;
  mintPrice: number;
  name: string;
  description: string;
  thirdPartyScripts: Array<string>;
  tokenDescription: string;
  royalty: number;
  socialWeb: string;
  socialTwitter: string;
  socialDiscord: string;
  socialMedium: string;
  socialInstagram: string;
  license: string;
  tags: Array<string>;
  categories: Array<string>;
  creatorWalletAddress: string;
  captureImageTime: number;
  reserveMintPrice?: number;
  reserveMintLimit?: number;
  reservers?: Array<string>;
}
