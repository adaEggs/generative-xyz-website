import ButtonIcon from '@components/ButtonIcon';
import Text from '@components/Text';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { formatEthPrice } from '@utils/format';
import React, { useContext } from 'react';
import { Range, getTrackBackground } from 'react-range';
import s from './styles.module.scss';
import ButtonSweepBTC from '@components/Transactor/ButtonSweepBTC';

const MIN = 0;
const MAX = 30;

const BuyBottomBar: React.FC = (): React.ReactElement => {
  const { listItems, selectedOrders, selectOrders } = useContext(
    GenerativeProjectDetailContext
  );

  const max = selectedOrders.length > MAX ? selectedOrders.length : MAX;

  const changeRange = (values: number[]) => {
    if (values.length > 0) {
      const value = Math.max(MIN, Math.min(max, values[0]));
      selectOrders(value);
    }
  };

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

  const onClickBuyETH = () => {
    // TODO
  };

  return (
    <div className={s.container}>
      <div className={s.leftContainer}>
        <ButtonSweepBTC tokens={selectedItems} />
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
        <Range
          onChange={changeRange}
          min={MIN}
          max={max}
          step={1}
          values={[selectedItems.length]}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                background: getTrackBackground({
                  values: [selectedItems.length],
                  colors: ['#1C1C1C', '#F2F2F2'],
                  min: MIN,
                  max: MAX,
                }),
              }}
              className={s.track}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => <div {...props} className={s.thumb} />}
        />
      </div>
    </div>
  );
};

export default React.memo(BuyBottomBar);
