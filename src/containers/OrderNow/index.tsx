import useAsyncEffect from 'use-async-effect';
import { getProductList } from '@services/api/product';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
// import { useContext, useState } from 'react';
// import { LoadingContext } from '@contexts/loading-context';
import { useAppDispatch } from '@redux';
import { setCheckoutProduct } from '@redux/general/action';
import { Container } from 'react-bootstrap';
import { default as classNames } from 'classnames';
import s from './OrderNow.module.scss';
import { FrameItem } from '@containers/Display/components/frame-item';
import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@redux/user/selector';
import { WalletContext } from '@contexts/wallet-context';
import CheckoutModal from '@containers/CheckoutModal';
import { ROUTE_PATH } from '@constants/route-path';
import Link from 'next/link';
import Text from '@components/Text';
import Heading from '@components/Heading';

const LOG_PREFIX = 'OrderNow';
export const OrderNowTemplate = (): JSX.Element => {
  const { connect } = useContext(WalletContext);
  const use = useSelector(getUserSelector);
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<IFrame[]>([]);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      await connect();
    } catch (err: unknown) {
      log(err as Error, LogLevel.Debug, LOG_PREFIX);
    }
  };

  const openCheckoutPopup = (product: IFrame) => {
    if (!use.id) {
      handleConnectWallet();
    }
    dispatch(setCheckoutProduct(product));
  };

  useAsyncEffect(async () => {
    try {
      const { data } = await getProductList();
      if (data.products) {
        setProducts(data.products);
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
          <Link className={s.orderNow_back} href={ROUTE_PATH.DISPLAY}>
            <Text color={'black-60'} as="span" size={'16'}>
              Back
            </Text>
          </Link>
          <Heading as={'h2'}>All displays</Heading>
          <div
            className={classNames(
              s.orderNow_rowFrame,
              'row justify-content-center'
            )}
          >
            <div className="col-xl-4 col-sm-6 col-12">
              <FrameItem
                data={products[0]}
                openCheckoutPopup={() => openCheckoutPopup(products[0])}
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
                data={products[1]}
                openCheckoutPopup={() => openCheckoutPopup(products[1])}
              />
            </div>
          </div>
        </Container>
      </div>
      <CheckoutModal />
    </>
  );
};
