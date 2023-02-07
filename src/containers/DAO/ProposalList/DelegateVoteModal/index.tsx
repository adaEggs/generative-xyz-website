import Button from '@components/ButtonIcon';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import s from './styles.module.scss';
import SvgInset from '@components/SvgInset';
import { CDN_URL, NETWORK_CHAIN_ID } from '@constants/config';
import Heading from '@components/Heading';
import Input from '@components/Formik/Input';
import useContractOperation from '@hooks/useContractOperation';
import DelegateGENTokenOperation from '@services/contract-operations/gen-token/delegate-token';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';

type Props = {
  isShow: boolean;
  onHideModal?: () => void;
};

const DelegateVoteModal = (props: Props) => {
  const { isShow, onHideModal } = props;
  const { call: delegateGENToken } = useContractOperation(
    DelegateGENTokenOperation,
    true
  );

  const [isDelegating, setIsDelegating] = useState(false);
  const [delegateAddress, setDelegateAddress] = useState('');

  const handleDelegateGENToken = async (): Promise<void> => {
    try {
      setIsDelegating(true);
      if (delegateAddress) {
        const tx = await delegateGENToken({
          chainID: NETWORK_CHAIN_ID,
          delegateeAddress: delegateAddress,
        });
        // eslint-disable-next-line no-console
        console.log(tx);
      }
    } catch (err: unknown) {
      toast.error('Delegate unsuccessful.');
      throw Error();
    } finally {
      setIsDelegating(false);
    }
  };

  return (
    <Modal
      show={isShow}
      onHide={onHideModal}
      centered
      className={s.modalWrapper}
    >
      <Modal.Header className={s.modalHeader}>
        <Button onClick={onHideModal} className={s.closeBtn} variants="ghost">
          <SvgInset
            className={s.closeIcon}
            svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
          />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Heading as="h5" fontWeight="medium">
          Delegate your vote
        </Heading>
        <Input
          name={'address'}
          label="Address"
          sizes={'small'}
          className={s.delegate_input}
          onChange={debounce(e => {
            setDelegateAddress(e.target.value);
          }, 500)}
        />
        <div className="divider"></div>
        <div className={s.actionWrapper}>
          <Button
            disabled={isDelegating}
            onClick={onHideModal}
            className={s.actionBtn}
            variants="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={isDelegating}
            onClick={handleDelegateGENToken}
            className={s.actionBtn}
          >
            {isDelegating ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DelegateVoteModal;
