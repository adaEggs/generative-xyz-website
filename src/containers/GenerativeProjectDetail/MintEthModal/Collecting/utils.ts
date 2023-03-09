import { generateMintReceiverAddress } from '@services/mint';
import { sendAAEvent } from '@services/aa-tracking';
import { BTC_PROJECT } from '@constants/tracking-event-name';
import { formatEthPrice } from '@utils/format';
import { Project } from '@interfaces/project';
import { PaymentMethod } from '@enums/mint-generative';
import { LogLevel } from '@enums/log-level';
import log from '@utils/logger';

const LOG_PREFIX = 'MintService';
interface IResponse {
  address: string;
  price: string;
  networkFeeByPayType: string;
  mintPriceByPayType: string;
}

export const getBTCAddress = async ({
  walletAddress,
  refundAddress,
  projectData,
  paymentMethod,
  quantity,
}: {
  walletAddress: string;
  refundAddress: string;
  projectData: Project;
  paymentMethod: PaymentMethod;
  quantity: number;
}): Promise<IResponse> => {
  let _address = '';
  let _price: string = projectData.mintPrice;
  let _networkFeeByPayType = '';
  let _mintPriceByPayType = '';

  try {
    const { address, price, networkFeeByPayType, mintPriceByPayType } =
      await generateMintReceiverAddress({
        walletAddress,
        projectID: projectData.tokenID,
        payType: 'eth',
        refundUserAddress: refundAddress,
        quantity,
      });

    sendAAEvent({
      eventName: BTC_PROJECT.MINT_NFT,
      data: {
        projectId: projectData.id,
        projectName: projectData.name,
        projectThumbnail: projectData.image,
        mintPrice: formatEthPrice(projectData?.mintPrice),
        mintType: paymentMethod,
        networkFee: formatEthPrice(projectData?.networkFee || null),
        masterAddress: address,
        totalPrice: formatEthPrice(price),
      },
    });

    _address = address;
    _price = price || projectData?.mintPrice;
    _networkFeeByPayType = networkFeeByPayType || '';
    _mintPriceByPayType = mintPriceByPayType || '';
    // setReceiverAddress(address);
    // setPrice(price || projectData?.mintPrice);
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    log('failed to generate receiver address', LogLevel.ERROR, LOG_PREFIX);
    throw err;
  }
  return {
    address: _address,
    price: _price,
    networkFeeByPayType: _networkFeeByPayType,
    mintPriceByPayType: _mintPriceByPayType,
  };
};
