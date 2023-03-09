import React from 'react';
import ButtonIcon, { ButtonSizesType } from '@components/ButtonIcon';
import cs from 'classnames';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { Loading } from '@components/Loading';
import { useBitcoin } from '@bitcoin/index';
import useFeeRate from '@containers/Profile/FeeRate/useFeeRate';
import { getError } from '@utils/text';
import { toast } from 'react-hot-toast';

interface IProps {
  className?: string;
  sizes?: ButtonSizesType;
  inscriptionID: string;
  inscriptionNumber: number;
  orderID: string;
}

const ButtonCancelListed = React.memo(
  ({
    className,
    orderID,
    inscriptionID,
    inscriptionNumber,
    sizes = 'xsmall',
  }: IProps) => {
    const user = useSelector(getUserSelector);
    const { selectedRate, allRate } = useFeeRate();
    const { cancelInscription } = useBitcoin({ inscriptionID });
    const [isLoading, setLoading] = React.useState(false);

    const onCancel = async () => {
      try {
        setLoading(true);
        await cancelInscription({
          feeRate: allRate[selectedRate],
          inscriptionNumber: inscriptionNumber,
          receiverAddress: user?.walletAddressBtcTaproot || '',
          orderID,
        });
        toast.success('Canceled listing successfully');
        setTimeout(() => {
          window.location.reload();
          setLoading(false);
        }, 2000);
      } catch (e) {
        const err = getError(e);
        toast.error(err.message);
        setLoading(false);
      }
    };

    return (
      <>
        <ButtonIcon
          variants="secondary"
          sizes={sizes}
          className={cs(`${className}`)}
          onClick={onCancel}
        >
          Cancel listing
        </ButtonIcon>
        <Loading isLoaded={!isLoading} />
      </>
    );
  }
);

ButtonCancelListed.displayName = 'ButtonCancelListed';

export default ButtonCancelListed;
