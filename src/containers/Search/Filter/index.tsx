import React from 'react';
import { Row, Col } from 'react-bootstrap';
import cn from 'classnames';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { getSearchByKeyword, getApiKey } from '@services/search';
import { CDN_URL } from '@constants/config';
import SvgInset from '@components/SvgInset';
import { prettyNumberWithCommas } from '@utils/units';

import s from './Filter.module.scss';
import { PAYLOAD_DEFAULT, OBJECT_TYPE } from '../constant';

interface FilterProps {
  className?: string;
}

const Filter = ({ className }: FilterProps): JSX.Element => {
  const router = useRouter();
  const { keyword = '' } = router.query;

  const filterParams = {
    ...PAYLOAD_DEFAULT,
    keyword,
    type: OBJECT_TYPE.ARTIST,
  };
  const { data: searchResults } = useSWR(
    getApiKey(getSearchByKeyword, filterParams),
    getSearchByKeyword
  );

  const onRemoveKeyword = () => {
    router.replace({
      query: { ...router.query, keyword: '' },
    });
  };

  return (
    <div className={cn(s.filter, className)}>
      <Row>
        <Col md={12}>
          <div className={s.filter_totalResult}>
            <span>{prettyNumberWithCommas(searchResults?.total || 0)}</span>
            &nbsp;items
          </div>
          {keyword && (
            <div className="horizontalStack">
              <div className={s.filter_tag}>
                <span>{keyword}</span>
                <SvgInset
                  svgUrl={`${CDN_URL}/icons/close.svg`}
                  onClick={onRemoveKeyword}
                />
              </div>
              {/* <button className={s.filter_btnClear}>Clear all</button> */}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(Filter);
