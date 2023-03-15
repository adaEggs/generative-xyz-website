import React from 'react';

interface IProps {
  buyable?: boolean;
  isVerified?: boolean;
  priceBTC?: string | number;
  priceETH?: string | number;
  orderID?: string;
}
const usePurchaseStatus = ({
  buyable,
  priceBTC,
  priceETH,
  isVerified,
  orderID,
}: IProps) => {
  const isBuyable = React.useMemo(() => {
    return buyable && isVerified;
  }, [buyable, isVerified]);

  const isBuyBTC = React.useMemo(() => {
    return isBuyable && !!priceBTC && orderID;
  }, [isBuyable, priceBTC, orderID]);

  const isBuyETH = React.useMemo(() => {
    return isBuyable && !!priceETH;
  }, [isBuyable, priceETH]);

  const isWaiting = React.useMemo(() => {
    return buyable && !isVerified;
  }, [buyable, isVerified]);

  return {
    isBuyable,
    isBuyBTC,
    isBuyETH,
    isWaiting,
  };
};

export default usePurchaseStatus;
