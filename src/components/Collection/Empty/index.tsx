import { CDN_URL, NETWORK_CHAIN_ID } from '@constants/config';
import SvgInset from '@components/SvgInset';
import ButtonIcon from '@components/ButtonIcon';
import s from './styles.module.scss';
import { Project } from '@interfaces/project';
import useContractOperation from '@hooks/useContractOperation';
import { IMintGenerativeNFTParams } from '@interfaces/contract-operations/mint-generative-nft';
import { TransactionReceipt } from 'web3-eth';
import MintGenerativeNFTOperation from '@services/contract-operations/generative-nft/mint-generative-nft';
import { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import _get from 'lodash/get';
import { isTestnet } from '@utils/chain';
import { ErrorMessage } from '@enums/error-message';
import { WalletContext } from '@contexts/wallet-context';
import Web3 from 'web3';
import cs from 'classnames';
import { checkIsBitcoinProject } from '@utils/generative';
import Image from 'next/image';

const LOG_PREFIX = 'Empty';

export const Empty = ({
  projectInfo,
  className,
  content = 'Be the first to mint this collection',
}: {
  projectInfo?: Project | null;
  className?: string;
  content?: ReactNode;
}): JSX.Element => {
  const { getWalletBalance } = useContext(WalletContext);
  const router = useRouter();
  const {
    call: mintToken,
    reset: resetMintToken,
    errorMessage,
  } = useContractOperation<IMintGenerativeNFTParams, TransactionReceipt>(
    MintGenerativeNFTOperation,
    true
  );
  const [isMinting, setIsMinting] = useState(false);

  const isBitcoinProject = useMemo((): boolean => {
    if (!projectInfo) return false;
    return checkIsBitcoinProject(projectInfo.tokenID);
  }, [projectInfo]);

  const handleMintToken = async () => {
    try {
      setIsMinting(true);

      if (!projectInfo) {
        return;
      }

      const walletBalance = await getWalletBalance();
      if (
        walletBalance <
        parseFloat(Web3.utils.fromWei(projectInfo.mintPrice.toString()))
      ) {
        if (isTestnet()) {
          toast.error(
            'Insufficient funds testnet. Go to profile and get testnet faucet'
          );
        } else {
          toast.error('Insufficient funds.');
        }
        return;
      }

      const mintTx = await mintToken({
        projectAddress: projectInfo.genNFTAddr,
        mintFee: projectInfo.mintPrice.toString(),
        chainID: NETWORK_CHAIN_ID,
      });

      if (!mintTx) {
        toast.error(ErrorMessage.DEFAULT);
        return;
      }

      const tokenID: string | null = _get(
        mintTx,
        'events.Transfer.returnValues.tokenId',
        null
      );

      router.push(`/generative/${projectInfo.tokenID}/${tokenID}`);
    } catch (err: unknown) {
      log(err as Error, LogLevel.ERROR, LOG_PREFIX);
    } finally {
      setIsMinting(false);
    }
  };

  const mintedOut = useMemo(() => {
    if (projectInfo) {
      return projectInfo?.maxSupply === projectInfo?.mintingInfo.index;
    }
    return false;
  }, [projectInfo?.maxSupply, projectInfo?.mintingInfo.index]);

  useEffect(() => {
    if (errorMessage) {
      toast.remove();
      toast.error(ErrorMessage.DEFAULT);
      resetMintToken();
    }
  }, [errorMessage]);

  return (
    <div className={cs(s.empty, 'empty', className)}>
      <div className={cs(s.empty_inner, mintedOut && s.minted_out)}>
        <div className={s.empty_thumb}>
          <Image
            width={196}
            height={200}
            src={`${CDN_URL}/images/wiz-gif.gif`}
            alt="wiz-gif.svg"
          />
        </div>
        <div className={s.empty_desc}>
          {mintedOut ? (
            <>
              <p>
                Unfortunately, all outputs of this collection have been minted.
              </p>
              <p>Please browse other collections for availability.</p>
            </>
          ) : (
            content
          )}
        </div>
        {!isBitcoinProject && projectInfo && !mintedOut && (
          <ButtonIcon
            onClick={handleMintToken}
            sizes="large"
            disabled={isMinting}
            endIcon={
              <SvgInset svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`} />
            }
          >
            {isMinting ? 'Minting...' : 'Mint now'}
          </ButtonIcon>
        )}
      </div>
    </div>
  );
};
