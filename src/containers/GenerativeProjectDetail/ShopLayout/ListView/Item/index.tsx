import { Token } from '@interfaces/token';
import React, { useContext } from 'react';
import styles from './styles.module.scss';
import Link from '@components/Link';
import { ROUTE_PATH } from '@constants/route-path';
import { useRouter } from 'next/router';
import { formatAddressDisplayName } from '@utils/format';
import ButtonBuyListedFromETH from '@components/Transactor/ButtonBuyListedFromETH';
import ButtonBuyListedFromBTC from '@components/Transactor/ButtonBuyListedFromBTC';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import usePurchaseStatus from '@hooks/usePurchaseStatus';
import Text from '@components/Text';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';

type Props = {
  data: Token;
};

const ListViewItem = ({ data }: Props) => {
  const router = useRouter();

  const { projectID } = router.query;

  const {
    isLayoutShop,
    selectedOrders,
    removeSelectedOrder,
    addSelectedOrder,
  } = useContext(GenerativeProjectDetailContext);

  const { isBuyETH, isBuyBTC, isBuyable } = usePurchaseStatus({
    buyable: data?.buyable,
    isVerified: data?.sell_verified,
    orderID: data?.orderID,
    priceBTC: data?.priceBTC,
    priceETH: data?.priceETH,
  });

  const isSelectedOrder = selectedOrders.includes(data.orderID);

  const onSelectItem = () => {
    if (isBuyable) {
      isSelectedOrder
        ? removeSelectedOrder(data.orderID)
        : addSelectedOrder(data.orderID);
    }
  };

  const renderBuyButton = () => {
    if (!isBuyable) return null;
    return (
      <div className={`${styles.row} ${styles.buy_btn}`}>
        {isBuyETH && (
          <Link
            href=""
            onClick={() => {
              // DO NOTHING
            }}
            className={styles.eth_btn}
          >
            <ButtonBuyListedFromETH
              sizes={isLayoutShop ? 'small' : 'medium'}
              inscriptionID={data.tokenID}
              price={data.priceETH}
              inscriptionNumber={Number(data.inscriptionIndex || 0)}
              orderID={data.orderID}
            />
          </Link>
        )}
        {isBuyBTC && (
          <Link
            href=""
            className={styles.btc_btn}
            onClick={() => {
              // DO NOTHING
            }}
          >
            <ButtonBuyListedFromBTC
              sizes={isLayoutShop ? 'small' : 'medium'}
              inscriptionID={data.tokenID}
              price={data.priceBTC}
              inscriptionNumber={Number(data.inscriptionIndex || 0)}
              orderID={data.orderID}
            />
          </Link>
        )}
      </div>
    );
  };

  return (
    <tr>
      <td className="checkbox">
        <SvgInset
          size={14}
          svgUrl={`${CDN_URL}/icons/${
            isSelectedOrder ? 'ic_checkboxed' : 'ic_checkbox'
          }.svg`}
          onClick={onSelectItem}
        />
      </td>
      <td>
        <div className={styles.itemInfo}>
          <img
            className={styles.itemThumbnail}
            src={data?.thumbnail}
            alt={data?.name}
          />
          <div className={styles.itemName}>
            <Link
              href={`${ROUTE_PATH.GENERATIVE}/${projectID}/${data.tokenID}`}
            >
              <Text fontWeight="medium">
                #{data?.orderInscriptionIndex || data?.inscriptionIndex}
              </Text>
            </Link>
          </div>
        </div>
      </td>
      <td>
        <div className={styles.owners}>
          <Link
            href={`${ROUTE_PATH.PROFILE}/${
              data?.owner?.walletAddressBtcTaproot || data?.owner?.walletAddress
            }`}
          >
            <Text fontWeight="medium">
              {formatAddressDisplayName(
                data?.owner?.displayName ||
                  data?.owner?.walletAddressBtcTaproot ||
                  data?.ownerAddr ||
                  '-'
              )}
            </Text>
          </Link>
        </div>
      </td>
      <td>{renderBuyButton()}</td>
    </tr>
  );
};

export default ListViewItem;
