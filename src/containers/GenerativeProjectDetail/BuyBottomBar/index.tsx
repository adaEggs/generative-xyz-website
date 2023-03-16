import ButtonIcon from '@components/ButtonIcon';
import Text from '@components/Text';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { formatBTCPrice, formatEthPrice } from '@utils/format';
import React, { useContext } from 'react';
import s from './styles.module.scss';

const MIN = 0;
const MAX = 30;

const BuyBottomBar: React.FC = (): React.ReactElement => {
  const { listItems, selectedOrders, selectOrders } = useContext(
    GenerativeProjectDetailContext
  );

  const max = selectedOrders.length > MAX ? selectedOrders.length : MAX;

  const changeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(MIN, Math.min(max, Number(event.target.value)));
    selectOrders(value);
  };

  const selectedItems = listItems
    ? listItems.filter(item => selectedOrders.includes(item.orderID))
    : [];

  const totalETHPrice = formatEthPrice(
    selectedItems.reduce(
      (partialSum, item) => partialSum + Number(item.priceETH),
      0
    )
  );

  const totalBTCPrice = formatBTCPrice(
    selectedItems.reduce(
      (partialSum, item) => partialSum + Number(item.priceBTC),
      0
    )
  );

  const onClickBuyBTC = () => {
    // TODO
  };
  const onClickBuyETH = () => {
    // TODO
  };

  return (
    <div className={s.container}>
      <div className={s.leftContainer}>
        <ButtonIcon sizes="mid" variants="blue-deep" onClick={onClickBuyBTC}>
          <Text size="14" fontWeight="medium">
            Buy {selectedItems.length} items&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {totalBTCPrice} BTC
          </Text>
        </ButtonIcon>
        <ButtonIcon
          sizes="mid"
          variants="outline-small"
          onClick={onClickBuyETH}
        >
          <Text size="14" fontWeight="medium">
            Buy {selectedItems.length} items&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {totalETHPrice} ETH
          </Text>
        </ButtonIcon>
      </div>
      <div className={s.rightContainer}>
        <input
          className={s.input}
          onChange={changeWidth}
          placeholder="0"
          min={MIN}
          max={max}
          value={selectedItems.length}
        />
        <input
          type="range"
          onChange={changeWidth}
          min={MIN}
          max={max}
          step={1}
          value={selectedItems.length}
        />
      </div>
    </div>
  );
};

export default React.memo(BuyBottomBar);
