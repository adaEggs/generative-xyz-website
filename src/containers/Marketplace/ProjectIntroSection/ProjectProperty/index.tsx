import s from '@containers/Marketplace/ProjectIntroSection/styles.module.scss';
import Text from '@components/Text';
import Heading from '@components/Heading';
import { formatBTCPrice } from '@utils/format';
import { useContext, useState } from 'react';
import { ProjectLayoutContext } from '@contexts/project-layout-context';
import { IProjectMarketplaceData } from '@interfaces/api/project';
import useAsyncEffect from 'use-async-effect';
import { projectMarketplaceData } from '@services/project';
import { CDN_URL } from '@constants/config';
import SvgInset from '@components/SvgInset';

export const ProjectProperty = (): JSX.Element => {
  const { project, isRoyalty } = useContext(ProjectLayoutContext);
  const [marketplaceData, setMarketplaceData] =
    useState<IProjectMarketplaceData>();
  useAsyncEffect(async () => {
    if (project?.tokenID && project?.contractAddress) {
      const data = await projectMarketplaceData({
        projectId: String(project?.tokenID),
        contractAddress: String(project?.contractAddress),
      });
      setMarketplaceData(data);
    }
  }, [project]);
  return (
    <div className={s.stats}>
      <div className={s.stats_item}>
        <Text size="12" fontWeight="medium">
          Items
        </Text>
        <Heading as="h6" fontWeight="medium">
          {project?.maxSupply}
        </Heading>
      </div>
      {marketplaceData?.listed &&
        marketplaceData?.listed > 1 &&
        project?.maxSupply && (
          <div className={s.stats_item}>
            <Text size="12" fontWeight="medium">
              Listed
            </Text>
            <Heading as="h6" fontWeight="medium">
              {Math.floor((marketplaceData?.listed / project?.maxSupply) * 100)}
              %
            </Heading>
          </div>
        )}
      {isRoyalty && (
        <div className={s.stats_item}>
          <Text size="12" fontWeight="medium">
            royalty
          </Text>
          <Heading as="h6" fontWeight="medium">
            {(project?.royalty || 0) / 100}%
          </Heading>
        </div>
      )}
      {!!project?.btcFloorPrice && (
        <div className={`${s.stats_item} ${s.stats_item__icon}`}>
          <Text size="12" fontWeight="medium">
            Floor Price
          </Text>
          <Heading className={s.stats_item_text} as="h6" fontWeight="medium">
            <SvgInset
              size={24}
              svgUrl={`${CDN_URL}/icons/Frame%20427319538.svg`}
            />{' '}
            {formatBTCPrice(project?.btcFloorPrice)}
          </Heading>
        </div>
      )}
      {!!marketplaceData?.volume && (
        <div className={`${s.stats_item} ${s.stats_item__icon}`}>
          <Text size="12" fontWeight="medium">
            Volume
          </Text>
          <Heading className={s.stats_item_text} as="h6" fontWeight="medium">
            <SvgInset
              size={24}
              svgUrl={`${CDN_URL}/icons/Frame%20427319538.svg`}
            />{' '}
            {formatBTCPrice(marketplaceData?.volume)}
          </Heading>
        </div>
      )}
    </div>
  );
};
