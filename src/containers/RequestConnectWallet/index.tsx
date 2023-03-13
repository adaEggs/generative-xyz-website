import Button from '@components/ButtonIcon';
import React from 'react';
import s from './styles.module.scss';

interface IProps {
  isProcessing: boolean;
  handleConnectWallet: () => Promise<void>;
}

const RequestConnectWallet: React.FC<IProps> = (
  props: IProps
): React.ReactElement => {
  const { isProcessing, handleConnectWallet } = props;

  return (
    <div className={s.requestConnectWallet}>
      <div className={s.actionWrapper}>
        <Button disabled={isProcessing} onClick={handleConnectWallet}>
          {isProcessing ? 'Connecting' : 'Connect wallet'}
        </Button>
        <p className={s.text}>To continue you need to connect your wallet.</p>
      </div>
    </div>
  );
};

export default RequestConnectWallet;
