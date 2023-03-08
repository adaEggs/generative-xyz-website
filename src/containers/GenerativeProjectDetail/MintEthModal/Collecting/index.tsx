import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import React, { useCallback, useContext, useEffect } from 'react';
import s from './styles.module.scss';
import _debounce from 'lodash/debounce';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { BitcoinProjectContext } from '@contexts/bitcoin-project-context';
import { formatEthPrice } from '@utils/format';
import { useAppSelector } from '@redux';
import { getUserSelector } from '@redux/user/selector';
import { WalletContext } from '@contexts/wallet-context';
import _throttle from 'lodash/throttle';
import { getBTCAddress } from '@containers/GenerativeProjectDetail/MintEthModal/Collecting/utils';
import { Loading } from '@components/Loading';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import ButtonIcon from '@components/ButtonIcon';
import { ROUTE_PATH } from '@constants/route-path';
import { useRouter } from 'next/router';

const LOG_PREFIX = 'MintEthModal';

const MintEthModal: React.FC = () => {
  const [isLoad, setIsLoad] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const router = useRouter();

  const isLoading = !isLoad;

  const user = useAppSelector(getUserSelector);
  const { projectData } = useContext(GenerativeProjectDetailContext);
  const { transfer } = useContext(WalletContext);
  const { setIsPopupPayment, paymentMethod } = useContext(
    BitcoinProjectContext
  );

  const userAddress = React.useMemo(() => {
    return {
      taproot: user?.walletAddressBtcTaproot || '',
      evm: user?.walletAddress || '',
    };
  }, [user]);

  const handleTransfer = React.useCallback(
    _throttle(async (toAddress: string, val: string): Promise<void> => {
      try {
        setIsSent(false);
        await transfer(toAddress, val);
        setIsSent(true);
      } catch (err: unknown) {
        log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
        onClose();
      }
    }, 400),
    []
  );

  const onClose = () => {
    setIsPopupPayment(false);
  };

  const debounceGetBTCAddress = useCallback(
    _debounce(async (ordAddress, refundAddress) => {
      if (!projectData) return;
      setIsLoad(false);
      try {
        const { price: _price, address: _address } = await getBTCAddress({
          walletAddress: ordAddress,
          refundAddress: refundAddress,
          projectData,
          paymentMethod,
          quantity: 1,
        });
        setIsLoad(true);
        if (!_address || !_price) {
          toast.error(ErrorMessage.DEFAULT);
          return;
        }
        setIsConfirming(true);
        await handleTransfer(_address, formatEthPrice(_price));
        setIsConfirming(false);
        setIsSent(true);
      } catch (e: unknown) {
        setIsLoad(false);
        setIsConfirming(false);
        setIsSent(false);
      }
    }, 500),
    [projectData]
  );

  useEffect(() => {
    if (userAddress && userAddress.evm && userAddress.taproot) {
      debounceGetBTCAddress(userAddress.taproot, userAddress.evm);
    }
  }, [userAddress]);

  if (!projectData) {
    return <></>;
  }

  if (isLoading) return <Loading isLoaded={false} />;

  return (
    <div className={s.mintBTCGenerativeModal}>
      <div className={s.backdrop}>
        <div className={s.modalWrapper}>
          <div className={s.modalContainer}>
            <div className={s.modalHeader}>
              <Button onClick={onClose} className={s.closeBtn} variants="ghost">
                <SvgInset
                  className={s.closeIcon}
                  svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
                />
              </Button>
            </div>
            <div className={s.modalBody}>
              <h3 className={s.modalTitle}>
                {isConfirming ? 'Waiting for confirmation' : `You're all set`}
              </h3>
              <div>
                {isConfirming && (
                  <div className={s.loadingWrapper}>
                    <Loading isLoaded={false} />
                  </div>
                )}
                {isSent && (
                  <div>
                    <p>
                      We are working on your order. You can check the status of
                      the order periodically in Your Profile.
                    </p>
                    <div className={s.row}>
                      <ButtonIcon
                        sizes="large"
                        variants="filter"
                        className={s.button}
                        onClick={() => {
                          onClose();
                          router.push(ROUTE_PATH.PROFILE);
                        }}
                      >
                        Check order status
                      </ButtonIcon>
                      <ButtonIcon
                        sizes="large"
                        variants="primary"
                        className={s.button}
                        onClick={onClose}
                      >
                        Continue collecting
                      </ButtonIcon>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintEthModal;
