import Avatar from '@components/Avatar';
import Link from '@components/Link';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { APP_TOKEN_SYMBOL, CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { NFTHolder } from '@interfaces/nft';
import { formatCurrency, formatLongAddress } from '@utils/format';
import cs from 'classnames';
import { useCallback } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { v4 } from 'uuid';
import Web3 from 'web3';
import s from './styles.module.scss';

type Props = {
  className?: string;
  userList: (NFTHolder & { genBalance?: string })[];
};

const LeaderboardTable = (props: Props) => {
  const { className, userList } = props;

  const renderBadges = (position: number) => {
    switch (position) {
      case 0:
        return (
          <SvgInset
            className={s.trophyIcon}
            size={24}
            svgUrl={`${CDN_URL}/icons/ic-badge-gold.svg`}
          />
        );
      case 1:
        return (
          <SvgInset
            className={s.trophyIcon}
            size={24}
            svgUrl={`${CDN_URL}/icons/ic-badge-silver.svg`}
          />
        );
      case 2:
        return (
          <SvgInset
            className={s.trophyIcon}
            size={24}
            svgUrl={`${CDN_URL}/icons/ic-badge-bronze.svg`}
          />
        );

      default:
        return position + 1;
    }
  };

  const calculatePositionChange = useCallback(
    (currentRank: number, oldRank: number) => {
      const diff = currentRank - oldRank;
      if (diff === 0) return null;
      return (
        <div className={s.positionChange}>
          {diff > 0 ? (
            <SvgInset
              className={s.positionChangeIcon}
              size={16}
              svgUrl={`${CDN_URL}/icons/ic-arrow-up.svg`}
            />
          ) : (
            <SvgInset
              className={s.positionChangeIcon}
              size={16}
              svgUrl={`${CDN_URL}/icons/ic-arrow-down.svg`}
            />
          )}
          {Math.abs(diff)}
        </div>
      );
    },
    []
  );

  //   const ExpandTableToggle = ({
  //     children,
  //     eventKey,
  //   }: PropsWithChildren<{ eventKey: string }>) => {
  //     const decoratedOnClick = useAccordionButton(eventKey);

  //     return (
  //       <button type="button" onClick={decoratedOnClick}>
  //         {children}
  //       </button>
  //     );
  //   };

  const data = userList.map((item, index) => {
    const displayName = item.profile?.display_name
      ? item.profile.display_name
      : formatLongAddress(item.address);

    const balanceChange =
      parseFloat(item.balance) - parseFloat(item.old_balance);

    return {
      id: index.toString(),
      render: {
        rank: (
          <div className={s.rankCol}>
            {renderBadges(index)}
            {calculatePositionChange(item.current_rank + 1, item.old_rank + 1)}
          </div>
        ),
        artist: (
          <div className={s.artistCol}>
            <Avatar
              imgSrcs={
                item?.profile?.avatar ||
                (item?.projects && item?.projects[0]?.creatorProfile?.avatar) ||
                ''
              }
              width={34}
              height={34}
            />
            <Link
              className={s.displayName}
              href={`${ROUTE_PATH.PROFILE}/${item.address}`}
            >
              <Text as="span" size="16" fontWeight="medium">
                {displayName}
              </Text>
            </Link>
          </div>
        ),
        collections: !item.projects ? (
          <div className={s.collectionsCol}>-</div>
        ) : item?.projects?.length === 1 ? (
          <div className={s.collectionsCol}>
            <Avatar
              imgSrcs={item?.projects[0]?.thumbnail || ''}
              width={34}
              height={34}
            />
            {/* <ExpandTableToggle eventKey={'0'}>Show All</ExpandTableToggle> */}
            <Link
              className={s.displayName}
              href={`${ROUTE_PATH.GENERATIVE}/${item.projects[0].tokenID}`}
            >
              <Text as="span" size="16" fontWeight="medium">
                {item?.projects[0].name}
              </Text>
            </Link>
          </div>
        ) : (
          <div className={s.collectionsCol}>
            <Avatar
              imgSrcs={
                item?.projects?.length > 2
                  ? [
                      item?.projects[0]?.thumbnail || '',
                      item?.projects[1]?.thumbnail || '',
                      item?.projects[2]?.thumbnail || '',
                    ]
                  : [
                      item?.projects[0]?.thumbnail || '',
                      item?.projects[1]?.thumbnail || '',
                    ]
              }
              width={34}
              height={34}
              className={s.collection_thumbnail}
            />
            <Text
              as="span"
              size="16"
              fontWeight="medium"
              className={s.displayName}
            >
              Show All
            </Text>
          </div>
        ),
        owners: (
          <div className={s.ownersCol}>
            <Text as="span" size="16" fontWeight="medium">
              {item.owner_count}
            </Text>
          </div>
        ),
        balance: (
          <div className={s.balanceRow}>
            <div className={s.balanceCol}>
              <SvgInset
                className={s.tokenIcon}
                size={18}
                svgUrl={`${CDN_URL}/icons/ic-gen-token.svg`}
              />
              <Text as="span" size="16" fontWeight="medium">
                {item.genBalance}
              </Text>
            </div>
            {balanceChange > 0 ? (
              <Text color="green-c" as="span" size="16" fontWeight="medium">
                +{formatCurrency(parseFloat(Web3.utils.fromWei(item.balance)))}
              </Text>
            ) : (
              <div className={s.balanceChange}></div>
            )}
          </div>
        ),
      },
    };
  });

  return (
    <div className={cs(s.table, className)}>
      <div className={s.tableHead}>
        <div key={`thead-${v4()}`} className={cs(s.tableHead_item, s.rankHead)}>
          Rank
        </div>
        <div
          key={`thead-${v4()}`}
          className={cs(s.tableHead_item, s.artistHead)}
        >
          Artist
        </div>
        <div
          key={`thead-${v4()}`}
          className={cs(s.tableHead_item, s.collectionsHead)}
        >
          Collections
        </div>
        <div
          key={`thead-${v4()}`}
          className={cs(s.tableHead_item, s.ownersHead)}
        >
          Owners
        </div>
        <div
          key={`thead-${v4()}`}
          className={cs(s.tableHead_item, s.balanceHead)}
        >
          ${APP_TOKEN_SYMBOL} Mining Rewards
        </div>
      </div>
      <div className={s.tableBody}>
        {data &&
          data?.length > 0 &&
          data.map(rowData => (
            <Accordion className={s.tableBody_row} key={`trowData-${v4()}`}>
              <div className={s.tableData}>
                {rowData.render &&
                  Object.values(rowData.render).map(value => (
                    <div key={`tdata-${v4()}`} className={s.tableData_item}>
                      {value}
                    </div>
                  ))}
              </div>
              <Accordion.Collapse eventKey="0">
                <Text>Hello! I am another body</Text>
              </Accordion.Collapse>
            </Accordion>
          ))}
      </div>
    </div>
  );
};

export default LeaderboardTable;
