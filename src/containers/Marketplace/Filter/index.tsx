import cs from 'classnames';
import React, { useRef } from 'react';
import s from './styles.module.scss';
import Input from '@containers/Marketplace/Filter/Filter.input';
import Selector from '@containers/Marketplace/Filter/Filter.selector';
import { Loading } from '@components/Loading';
import {
  getFilterData,
  getMarketplaceBtcFilterInfo,
} from '@services/marketplace-btc';
import {
  FilterKey,
  FilterKeyType,
  IFilterInfo,
  IGetMarketplaceBtcListItem,
} from '@interfaces/api/marketplace-btc';
import { toast } from 'react-hot-toast';
import { ErrorMessage } from '@enums/error-message';
import { debounce } from 'lodash';

interface ICheck {
  collection: string[];
  inscriptionID: string[];
  price: string[];
}

interface IProps {
  setListData: (data: IGetMarketplaceBtcListItem[]) => void;
  setLoadedListData: (isLoaded: boolean) => void;
}

const Filter = ({ setListData, setLoadedListData }: IProps) => {
  const initRef = useRef(false);
  const [loaded, setLoaded] = React.useState(false);
  const [filter, setFilter] = React.useState<IFilterInfo>();
  const [checkedValues, setCheckedValues] = React.useState<ICheck>({
    collection: [],
    inscriptionID: [],
    price: [],
  });

  const fetchFilterInfo = async () => {
    try {
      setLoaded(false);
      const data = await getMarketplaceBtcFilterInfo();
      setFilter(data);
    } catch (_: unknown) {
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setLoaded(true);
    }
  };

  const updateChecker = (filterKey: FilterKeyType, value: string) => {
    let _checkedValues = Object.assign({}, checkedValues);
    const isChecked = _checkedValues[filterKey].some(
      _value => _value === value
    );
    if (!isChecked) {
      _checkedValues[filterKey].push(value);
    } else {
      _checkedValues = {
        ..._checkedValues,
        [filterKey]: _checkedValues[filterKey].filter(
          _value => _value !== value
        ),
      };
    }
    return _checkedValues;
  };

  const toggleChecker = (name: string, value: string) => {
    let newState = undefined;
    switch (name) {
      case filter?.collection?.name:
        newState = updateChecker(FilterKey.collection, value);
        break;
      case filter?.inscriptionID?.name:
        newState = updateChecker(FilterKey.inscriptionID, value);
        break;
      case filter?.price?.name:
        newState = updateChecker(FilterKey.price, value);
        break;
    }
    if (newState) {
      setCheckedValues(Object.assign({}, newState));
    }
  };

  const fetchData = async (_checkValues: ICheck, keyword?: string) => {
    try {
      setLoadedListData(false);
      const list = await getFilterData({
        collections: _checkValues.collection,
        prices: _checkValues.price,
        inscriptionIDs: _checkValues.inscriptionID,
        keyword,
      });
      setListData(list);
    } catch (e) {
      toast.error(ErrorMessage.DEFAULT);
    } finally {
      setLoadedListData(true);
    }
  };

  const debounceFetch = React.useCallback(debounce(fetchData, 300), []);

  const onKeywordChange = React.useCallback((keyword: string) => {
    debounceFetch(
      {
        collection: [],
        inscriptionID: [],
        price: [],
      },
      keyword
    );
  }, []);

  React.useEffect(() => {
    fetchFilterInfo().then();
  }, []);

  React.useEffect(() => {
    if (!initRef || !initRef.current) {
      setTimeout(() => {
        initRef.current = true;
      }, 300);
      return;
    }
    debounceFetch(checkedValues);
  }, [checkedValues]);
  return (
    <div className={cs(s.container)}>
      <Loading isLoaded={loaded} />
      {loaded && (
        <>
          <Input onKeyWordChange={onKeywordChange} />
          {!!filter?.collection && (
            <Selector
              value={filter?.collection}
              checkedValues={checkedValues.collection}
              onClick={toggleChecker}
            />
          )}
          {!!filter?.inscriptionID && (
            <Selector
              value={filter?.inscriptionID}
              checkedValues={checkedValues.inscriptionID}
              onClick={toggleChecker}
            />
          )}
          {!!filter?.price && (
            <Selector
              value={filter?.price}
              checkedValues={checkedValues.price}
              onClick={toggleChecker}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Filter;
