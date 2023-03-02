import { MINT_TRANSFER_FEE } from '@constants/config';
import { InscribeMintFeeRate } from '@enums/inscribe';

export const calculateMintFee = (
  feeRate: InscribeMintFeeRate,
  fileSizeByte: number,
  isAuthentic = false
): number => {
  const minSize = 1024 * 4;
  if (fileSizeByte < minSize) {
    fileSizeByte = minSize;
  }
  const totalFee = (feeRate * fileSizeByte) / 4 + MINT_TRANSFER_FEE;
  if (isAuthentic) {
    return totalFee * 1.2;
  }
  return totalFee;
};

export const calculateNetworkFee = (
  feeRate: InscribeMintFeeRate,
  fileBase64: string,
  transferFee = MINT_TRANSFER_FEE
): number => {
  const fileSizeByte = new Blob([fileBase64]).size;
  return (feeRate * fileSizeByte) / 4 + transferFee;
};

export const getOrdinalImgURL = (inscriptionID: string) => {
  if (!inscriptionID) return '';
  return `https://dev-v5.generativeexplorer.com/preview/${inscriptionID}`;
};
