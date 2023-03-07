import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import React, { useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import s from './styles.module.scss';
import { CDN_URL } from '@constants/config';
import Heading from '@components/Heading';
import Text from '@components/Text';
import Link from '@components/Link';
import { SOCIALS } from '@constants/common';
import { IWithdrawRefereeRewardPayload } from '@interfaces/api/profile';
import { formatBTCPrice } from '@utils/format';
import { CurrencyType } from '@enums/currency';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import Image from 'next/image';

type Props = {
  data: { isShow: boolean; data: IWithdrawRefereeRewardPayload | null };
  onHideModal: () => void;
};

const WithdrawModal = ({ data, onHideModal }: Props) => {
  const user = useSelector(getUserSelector);
  const { isShow } = data;
  const amount = data.data ? data.data.amount : 0;
  const currency = data.data ? data.data.paymentType : '--';
  const amoutText = useMemo(() => {
    return currency.toLowerCase() === CurrencyType.ETH.toString().toLowerCase()
      ? `${formatBTCPrice(`${amount}`)} ETH`
      : `${formatBTCPrice(amount || '')} BTC`;
  }, [amount, currency]);

  return (
    <div className={s.withdrawModal}>
      <Modal
        show={isShow}
        onHide={onHideModal}
        centered
        className={s.modalWrapper}
      >
        <Modal.Header className={s.modalHeader}>
          <ButtonIcon
            onClick={onHideModal}
            className={s.closeBtn}
            variants="ghost"
          >
            <SvgInset
              className={s.closeIcon}
              svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
            />
          </ButtonIcon>
        </Modal.Header>
        <Modal.Body>
          <Heading className={s.modalTitle} as="h5">
            You are withdrawing {amoutText} to{' '}
            {currency.toLowerCase() ===
            CurrencyType.ETH.toString().toLowerCase()
              ? user?.walletAddressPayment
              : user?.walletAddressBtc}
            .
          </Heading>
          <br></br>
          <Text size="18">
            It might take some time for Generative to process your withdrawal.
            Please be patient in the meantime. Should you need any further
            support,{' '}
            <Link href={SOCIALS.discord} className={s.discordLink}>
              Join our Discord
            </Link>
            <Image
              className={s.arrowIcon}
              src={`${CDN_URL}/icons/ic-arrow-right-black-20x20.svg`}
              width={20}
              height={20}
              alt="ic-arrow"
            ></Image>
          </Text>
          <br />
          <div className="divider"></div>
          <div className={s.actionWrapper}>
            <ButtonIcon onClick={onHideModal} className={s.actionBtn}>
              I understand
            </ButtonIcon>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default WithdrawModal;
