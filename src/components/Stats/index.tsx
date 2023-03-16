import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';
import s from './styles.module.scss';

type TStats = {
  data:
    | {
        id: string;
        info: string;
        value: string;
        link: string;
        rarity?: string;
      }[]
    | null;
};

const MAX_LINES = 7;

const Stats = ({ data }: TStats) => {
  const [seeMore, setSeeMore] = useState(false);
  const [showData, setShowData] = useState<TStats>({ data });

  const handleShowMore = () => {
    setShowData({ data });
    setSeeMore(false);
  };

  const handleShowLess = () => {
    setShowData({ data: data?.slice(0, MAX_LINES) || data });
    setSeeMore(true);
  };

  useEffect(() => {
    if (data && data.length > MAX_LINES) {
      handleShowLess();
    }
  }, [data]);

  if (!data) return null;

  return (
    <>
      {showData?.data &&
        showData?.data.length > 0 &&
        showData?.data.map(item => (
          <div className={s.statsInfo} key={`token-${item.id}`}>
            <Text size="18" color="black-80">
              {item.info}
            </Text>
            <Stack direction="horizontal" gap={3}>
              {!!item?.link && (
                <Link href={item.link} target="_blank">
                  <SvgInset svgUrl={`${CDN_URL}/icons/ic-link.svg`} />
                </Link>
              )}
              <Text size="18" color="black-80">
                {item.value}
              </Text>
              {!!item?.rarity && (
                <Text size="18" color="black-80">
                  {item?.rarity}
                </Text>
              )}
            </Stack>
          </div>
        ))}
      {data.length > MAX_LINES ? (
        seeMore ? (
          <>
            <Text fontWeight="semibold">...</Text>
            <Text
              as="span"
              onClick={handleShowMore}
              fontWeight="semibold"
              className={s.seeMore}
            >
              See more
            </Text>
          </>
        ) : (
          <Text
            as="span"
            onClick={handleShowLess}
            fontWeight="semibold"
            className={s.seeMore}
          >
            See less
          </Text>
        )
      ) : null}
    </>
  );
};

export default Stats;
