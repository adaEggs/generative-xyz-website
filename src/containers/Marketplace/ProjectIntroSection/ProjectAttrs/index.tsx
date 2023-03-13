import s from '@containers/Marketplace/ProjectIntroSection/styles.module.scss';
import Text from '@components/Text';
import { useContext } from 'react';
import { ProjectLayoutContext } from '@contexts/project-layout-context';
import { ROUTE_PATH } from '@constants/route-path';
import Link from 'next/link';

export const RenderProjectAttrs = (): JSX.Element => {
  const { mintedDate, isFullonChain, categoryName } =
    useContext(ProjectLayoutContext);
  return (
    <>
      <Text size="14" color="black-40" className={s.attrs_item}>
        Created date: {mintedDate}
      </Text>
      {!!categoryName && (
        <Text size="14" color="black-40" className={s.attrs_item}>
          Category:{' '}
          <Link href={`${ROUTE_PATH.DROPS}?category=${categoryName}`}>
            {categoryName}
          </Link>
        </Text>
      )}
      <Text size="14" color="black-40" className={s.attrs_item}>
        Fully on-chain: {isFullonChain ? 'Yes' : 'No'}
      </Text>
    </>
  );
};
