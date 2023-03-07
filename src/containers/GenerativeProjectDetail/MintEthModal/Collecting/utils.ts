import { generateMintReceiverAddress } from '@services/mint';
import { sendAAEvent } from '@services/aa-tracking';
import { BTC_PROJECT } from '@constants/tracking-event-name';
import { formatEthPrice } from '@utils/format';
import { Project } from '@interfaces/project';
import { PaymentMethod } from '@enums/mint-generative';

interface IResponse {
  address: string;
  price: string;
  networkFeeByPayType: string;
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
  let _networkFeeByPayType: string = projectData?.networkFeeEth || '';
  try {
    const { address, price, networkFeeByPayType } =
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
    _networkFeeByPayType =
      networkFeeByPayType || projectData?.networkFeeEth || '';
    // setReceiverAddress(address);
    // setPrice(price || projectData?.mintPrice);
  } catch (err: unknown) {
    // TODO HANDLE ERROR
  }
  return {
    address: _address,
    price: _price,
    networkFeeByPayType: _networkFeeByPayType,
  };
};
