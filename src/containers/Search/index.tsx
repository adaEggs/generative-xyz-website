import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import CategoryTab from '@components/CategoryTab';
import { prettyNumberWithCommas } from '@utils/units';

import Filter from './Filter';
import CollectionItems from './CollectionItems';
import TokenItems from './TokenItems';
import ArtistItems from './ArtistItems';
import InscriptionItems from './InscriptionItems';
import { OBJECT_TYPE } from './constant';
import useSearchApi from './useApi';
import s from './Search.module.scss';

import { LoadingProvider } from '@contexts/loading-context';

const ITEMS_TYPE = [
  {
    id: 0,
    name: 'Collections',
    type: OBJECT_TYPE.PROJECT,
  },
  {
    id: 1,
    name: 'Items',
    type: OBJECT_TYPE.TOKEN,
  },
  {
    id: 2,
    name: 'Users',
    type: OBJECT_TYPE.ARTIST,
  },
  {
    id: 3,
    name: 'All Ordinals',
    type: OBJECT_TYPE.INSCRIPTION,
  },
];

const SearchPage = (): JSX.Element => {
  const router = useRouter();
  const { keyword = '' } = router.query;
  const { totalCollection, totalArtist, totalToken, totalInscription } =
    useSearchApi({
      keyword,
    });
  const [currentTabActive, setCurrentTabActive] = useState<{
    id: number;
    name: string;
    type: string;
  }>(ITEMS_TYPE[0]);

  useEffect(() => {
    if (totalCollection > 0) {
      setCurrentTabActive(ITEMS_TYPE[0]);
    } else if (totalToken > 0) {
      setCurrentTabActive(ITEMS_TYPE[1]);
    } else if (totalArtist > 0) {
      setCurrentTabActive(ITEMS_TYPE[2]);
    } else if (totalInscription > 0) {
      setCurrentTabActive(ITEMS_TYPE[3]);
    }
  }, [keyword, totalCollection, totalToken, totalArtist, totalInscription]);

  const getTotalEachItem = (name: string, type: string): string => {
    if (type === OBJECT_TYPE.PROJECT) {
      return `${name} (${prettyNumberWithCommas(totalCollection)})`;
    }
    if (type === OBJECT_TYPE.TOKEN) {
      return `${name} (${prettyNumberWithCommas(totalToken)})`;
    }
    if (type === OBJECT_TYPE.INSCRIPTION) {
      return `${name} (${prettyNumberWithCommas(totalInscription)})`;
    }
    if (type === OBJECT_TYPE.ARTIST) {
      return `${name} (${prettyNumberWithCommas(totalArtist)})`;
    }
    return name;
  };

  const renderItemList = useMemo(() => {
    if (currentTabActive.type === OBJECT_TYPE.PROJECT) {
      return <CollectionItems />;
    }
    if (currentTabActive.type === OBJECT_TYPE.TOKEN) {
      return <TokenItems />;
    }
    if (currentTabActive.type === OBJECT_TYPE.INSCRIPTION) {
      return <InscriptionItems />;
    }
    if (currentTabActive.type === OBJECT_TYPE.ARTIST) {
      return <ArtistItems />;
    }
    return null;
  }, [currentTabActive.type]);

  return (
    <div className={s.search}>
      <Container>
        <Filter />
        <Row>
          <Col md={12}>
            <div className={s.search_category}>
              {ITEMS_TYPE.map(item => (
                <CategoryTab
                  type="3"
                  text={getTotalEachItem(item.name, item.type)}
                  key={item.id}
                  onClick={() => {
                    setCurrentTabActive(item);
                  }}
                  active={currentTabActive.id === item.id}
                  loading={false}
                />
              ))}
            </div>
          </Col>
        </Row>
        <div className={s.search_results}>{renderItemList}</div>
      </Container>
    </div>
  );
};

const WrapperTrade = (): JSX.Element => {
  return (
    <LoadingProvider simple={{ theme: 'light', isCssLoading: false }}>
      <SearchPage />
    </LoadingProvider>
  );
};

export default WrapperTrade;
