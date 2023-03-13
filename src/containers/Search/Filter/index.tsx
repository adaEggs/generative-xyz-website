import React from 'react';
import { Row, Col } from 'react-bootstrap';
import cn from 'classnames';
import { useRouter } from 'next/router';

// import { CDN_URL } from '@constants/config';
// import SvgInset from '@components/SvgInset';
// import { prettyNumberWithCommas } from '@utils/units';
import Heading from '@components/Heading';

import s from './Filter.module.scss';
// import useSearchApi from '../useApi';

interface FilterProps {
  className?: string;
}

const Filter = ({ className }: FilterProps): JSX.Element => {
  const router = useRouter();
  const { keyword = '' } = router.query;

  // const { searchTotal } = useSearchApi({ keyword });

  // const onRemoveKeyword = () => {
  //   router.replace({
  //     query: { ...router.query, keyword: '' },
  //   });
  // };

  if (!keyword) return <></>;

  return (
    <div className={cn(s.filter, className)}>
      <Row>
        <Col md={12}>
          <Heading as="h4" fontWeight="medium" className={s.filter_title}>
            {keyword}
          </Heading>
          {/* <div className={s.filter_totalResult}>
            <span>{prettyNumberWithCommas(searchTotal)}</span>
            &nbsp;items
          </div> */}
          {/* <div className="horizontalStack">
            <div className={s.filter_tag}>
              <span>{keyword}</span>
              <SvgInset
                svgUrl={`${CDN_URL}/icons/close.svg`}
                onClick={onRemoveKeyword}
              />
            </div>
          </div> */}
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(Filter);
