import Button from '@components/ButtonIcon';
import React, { Dispatch, SetStateAction } from 'react';
import s from './styles.module.scss';

interface IProps {
  isSuccessShow: boolean;
  setIsSuccessShow: Dispatch<SetStateAction<boolean>>;
}
export const TransactionSuccessModal: React.FC<IProps> = ({
  isSuccessShow,
  setIsSuccessShow,
}): React.ReactElement => {
  if (!isSuccessShow) return <></>;
  return (
    <div className={s.transactionSuccessModal}>
      <div className={s.backdrop}>
        <div className={s.modalWrapper}>
          <div className={s.modalContainer}>
            <div className={s.modalBody}>
              <h3 className={s.modalTitle}>NFT is being minted...</h3>
              <div className={s.contentWrapper}>
                <p>
                  The NFT will be sent to your wallet once it is minted
                  successfully on the Bitcoin blockchain.
                </p>
                <p>
                  This process can take over 10 minutes, so please be patient!
                </p>
              </div>
              <Button
                type="button"
                variants="primary"
                onClick={(): void => setIsSuccessShow(false)}
                className={s.cancelBtn}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
