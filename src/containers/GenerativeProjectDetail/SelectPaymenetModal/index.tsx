import Button from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import s from './styles.module.scss';
import React, { useContext } from 'react';
import { BitcoinProjectContext } from '@contexts/bitcoin-project-context';

const SelectPaymentModel: React.FC = () => {
  const { paymentMethod, setPaymentMethod, setIsPopupPayment, setPaymentStep } =
    useContext(BitcoinProjectContext);

  return (
    <div className={s.selectPaymentModal}>
      <div className={s.backdrop}>
        <div className={s.modalWrapper}>
          <div className={s.modalContainer}>
            <div className={s.modalHeader}>
              <Button
                onClick={() => {
                  setIsPopupPayment(false);
                }}
                className={s.closeBtn}
                variants="ghost"
              >
                <SvgInset
                  className={s.closeIcon}
                  svgUrl={`${CDN_URL}/icons/ic-x-circle-contained-28x28.svg`}
                />
              </Button>
            </div>
            <div className={s.modalBody}>
              <div className={s.modalBody_payments}>
                <h3 className={s.modalTitle}>Select payment token</h3>
                <ul className={s.modalBody_payments_list}>
                  <li>
                    <Button
                      onClick={() => setPaymentMethod('BTC')}
                      className={`${s.payments_item} ${
                        paymentMethod === 'BTC' ? s.payments_item__active : ''
                      }`}
                    >
                      <span>
                        <img
                          src={`${CDN_URL}/icons/bitcoin-circle.svg`}
                          alt="bitcoin"
                        />
                      </span>
                      <span>BTC</span>
                    </Button>
                  </li>
                  <li>
                    <Button
                      onClick={() => setPaymentMethod('ETH')}
                      className={`${s.payments_item} ${
                        paymentMethod === 'ETH' ? s.payments_item__active : ''
                      }`}
                    >
                      <span>
                        <img
                          src={`${CDN_URL}/icons/ethereum-circle.svg`}
                          alt="ethereum"
                        />
                      </span>
                      <span>ETH</span>
                    </Button>
                  </li>
                </ul>
                <div className={s.ctas}>
                  <Button
                    type="submit"
                    variants={'ghost'}
                    onClick={() => setPaymentStep('mint')}
                    className={s.submitBtn}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPaymentModel;
