import useAsyncEffect from 'use-async-effect';
import { getProductList } from '@services/product';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { useAppDispatch } from '@redux';
import { setCheckoutProduct } from '@redux/general/action';
import { Container } from 'react-bootstrap';
import { default as classNames } from 'classnames';
import s from './OrderNow.module.scss';
import { FrameItem } from '@containers/Display/FrameItem';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { WalletContext } from '@contexts/wallet-context';
import CheckoutModal from '@containers/CheckoutModal';
import Text from '@components/Text';
import Heading from '@components/Heading';
import { SOCIALS } from '@constants/common';
import { Product } from '@interfaces/product';

const LOG_PREFIX = 'OrderNow';
export const OrderNowTemplate = (): JSX.Element => {
  const { connect } = useContext(WalletContext);
  const user = useSelector(getUserSelector);
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      await connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.Debug, LOG_PREFIX);
    }
  };

  const openCheckoutPopup = (product: Product) => {
    if (!user) {
      handleConnectWallet();
    }
    dispatch(setCheckoutProduct(product));
  };

  useAsyncEffect(async () => {
    try {
      const { products } = await getProductList();
      if (products) {
        setProducts(products);
      }
    } catch (_: unknown) {
      log('failed to get products', LogLevel.Error, LOG_PREFIX);
    }
  }, []);

  if (products.length === 0) return <></>;

  return (
    <>
      <div className={s.orderNow}>
        <Container>
          <div className={s.orderNow_header}>
            <Heading as={'h2'}>Shop Generative Displays</Heading>
            <Text as={'p'} fontWeight={'regular'} size={'16'}>
              Need shopping help?{' '}
              <a href={SOCIALS.discord} target="_blank" rel="noreferrer">
                Ask the community
              </a>
            </Text>
            <Text as={'p'} fontWeight={'regular'} size={'16'}>
              Visit a Generative Showroom?{' '}
              <a href={SOCIALS.bookATour} target="_blank" rel="noreferrer">
                Book an appointment
              </a>
            </Text>
          </div>

          <div
            className={classNames(
              s.orderNow_rowFrame,
              'row justify-content-center'
            )}
          >
            <div className="col-xl-4 col-sm-6 col-12">
              <FrameItem
                data={products[1]}
                openCheckoutPopup={() => openCheckoutPopup(products[1])}
              />
            </div>
            <div className="col-xl-4 col-sm-6 col-12">
              <FrameItem
                data={products[2]}
                openCheckoutPopup={() => openCheckoutPopup(products[2])}
              />
            </div>
            <div className="col-xl-4 col-sm-6 col-12">
              <FrameItem
                data={products[0]}
                openCheckoutPopup={() => openCheckoutPopup(products[0])}
              />
            </div>
            <div className="col-xl-4 col-sm-6 col-12">
              <FrameItem
                data={products[5]}
                openCheckoutPopup={() => openCheckoutPopup(products[5])}
              />
            </div>
            <div className="col-xl-4 col-sm-6 col-12">
              <FrameItem
                data={products[4]}
                openCheckoutPopup={() => openCheckoutPopup(products[4])}
              />
            </div>
            <div className="col-xl-4 col-sm-6 col-12">
              <FrameItem
                data={products[3]}
                openCheckoutPopup={() => openCheckoutPopup(products[3])}
              />
            </div>
          </div>
        </Container>
      </div>
      <CheckoutModal />
    </>
  );
};
