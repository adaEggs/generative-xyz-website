import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import Link from 'next/link';
import { Stack } from 'react-bootstrap';
import { v4 } from 'uuid';
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

const Stats = ({ data }: TStats) => {
  if (!data) return null;
  return (
    <>
      {data.length > 0 &&
        data.map(item => (
          <div className={s.statsInfo} key={`token-${v4()}`}>
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
    </>
  );
};

export default Stats;
