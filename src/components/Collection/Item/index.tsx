import { CreatorInfo } from '@components/CreatorInfo';
import Heading from '@components/Heading';
import Link from '@components/Link';
import Text from '@components/Text';
import { LOGO_MARKETPLACE_URL } from '@constants/common';
import { ROUTE_PATH } from '@constants/route-path';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { ProfileContext } from '@contexts/profile-context';
import useWindowSize from '@hooks/useWindowSize';
import { Token } from '@interfaces/token';
import { User } from '@interfaces/user';
import { convertToETH } from '@utils/currency';
import {
  formatAddress,
  formatTokenId,
  getProjectIdFromTokenId,
} from '@utils/format';
import cs from 'classnames';
import { useContext, useMemo, useState } from 'react';
import { Stack } from 'react-bootstrap';

import s from './styles.module.scss';

const CollectionItem = ({
  data,
  className,
}: {
  data: Token;
  className?: string;
}) => {
  const tokenID = useMemo(
    () => data.name.split('#')[1] || data.name,
    [data.name]
  );
  const { currentUser } = useContext(ProfileContext);
  const { mobileScreen } = useWindowSize();
  const { isBitcoinProject } = useContext(GenerativeProjectDetailContext);

  const [thumb, setThumb] = useState<string>(data.image);

  const onThumbError = () => {
    setThumb(LOGO_MARKETPLACE_URL);
  };

  // const clickDetail = () => {
  //   // if (isBitcoinProject) return;
  //   router.push(
  //     `${ROUTE_PATH.GENERATIVE}/${
  //       isBitcoinProject
  //         ? data.project.tokenID
  //         : getProjectIdFromTokenId(parseInt(tokenID))
  //     }/${tokenID}`
  //   );
  // };

  return (
    <div className={`${s.collectionCard} ${className}`}>
      <div className={s.collectionCard_inner_wrapper}>
        <Link
          href={`${ROUTE_PATH.GENERATIVE}/${
            isBitcoinProject
              ? data.project.tokenID
              : getProjectIdFromTokenId(parseInt(tokenID))
          }/${tokenID}`}
          className={s.collectionCard_inner}
        >
          <div
            className={`${s.collectionCard_thumb} ${
              thumb === LOGO_MARKETPLACE_URL ? s.isDefault : ''
            }`}
          >
            <img
              onError={onThumbError}
              src={thumb}
              alt={data.name}
              loading={'lazy'}
            />
          </div>
          {mobileScreen ? (
            <div className={cs(s.collectionCard_info, s.mobile)}>
              <Text size="11" fontWeight="medium">
                {data?.owner?.displayName ||
                  formatAddress(
                    data?.owner?.walletAddress || data?.ownerAddr || ''
                  )}
              </Text>
              <div className={s.collectionCard_info_title}>
                <Text
                  className={s.textOverflow}
                  size="14"
                  fontWeight="semibold"
                >
                  <span
                    title={data?.project?.name}
                    className={s.collectionCard_info_title_name}
                  >
                    {data?.project?.name}
                  </span>{' '}
                  <span className={s.textOverflow}>
                    #{formatTokenId(tokenID, !isBitcoinProject)}
                  </span>
                </Text>
                <Text size="14" fontWeight="bold">
                  {data.stats?.price
                    ? `${convertToETH(data.stats?.price)}`
                    : ''}
                </Text>
              </div>
            </div>
          ) : (
            <div className={cs(s.collectionCard_info, s.desktop)}>
              {data.owner ? (
                <CreatorInfo creator={data.owner as User} />
              ) : (
                <CreatorInfo
                  creator={{ walletAddress: data.ownerAddr } as User}
                />
              )}
              <div className={s.collectionCard_info_title}>
                <Stack
                  className={s.collectionCard_info_stack}
                  direction="horizontal"
                >
                  <Heading
                    as={'h4'}
                    className={`token_id ml-auto ${s.textOverflow}}`}
                    style={{
                      maxWidth: data.stats?.price ? '70%' : '100%',
                    }}
                  >
                    {currentUser && (
                      <span
                        title={data?.project?.name}
                        className={s.collectionCard_info_title_name}
                      >
                        {data?.project?.name}
                      </span>
                    )}
                    <span>#{formatTokenId(tokenID, !isBitcoinProject)}</span>
                  </Heading>
                  {!!data.stats?.price && (
                    <Stack
                      direction="horizontal"
                      className={s.collectionCard_info_listing}
                    >
                      <b>{convertToETH(data.stats?.price)}</b>
                    </Stack>
                  )}
                </Stack>
              </div>
            </div>
          )}
        </Link>
        {isBitcoinProject && (
          <ul className={s.ordinalsLinks}>
            <li>
              <a
                className={s.inscription}
                target="_blank"
                href={`https://ordinals.com/inscription/${tokenID}`}
                rel="noreferrer"
              >
                Inscription
              </a>
            </li>
            <li>
              <a
                className={s.content}
                target="_blank"
                href={`https://ordinals.com/content/${tokenID}`}
                rel="noreferrer"
              >
                Content
              </a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default CollectionItem;
