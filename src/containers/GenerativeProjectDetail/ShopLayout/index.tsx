import ButtonIcon from '@components/ButtonIcon';
import FilterOptions from '@components/Collection/FilterOptions';
import CollectionList from '@components/Collection/List';
import Link from '@components/Link';
import { Loading } from '@components/Loading';
import ProjectDescription from '@components/ProjectDescription';
import SvgInset from '@components/SvgInset';
import Table from '@components/Table';
import Text from '@components/Text';
import ButtonBuyListedFromBTC from '@components/Transactor/ButtonBuyListedFromBTC';
import ButtonBuyListedFromETH from '@components/Transactor/ButtonBuyListedFromETH';
import { TriggerLoad } from '@components/TriggerLoader';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import s from '@containers/Marketplace/ProjectIntroSection/styles.module.scss';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';
import { LogLevel } from '@enums/log-level';
import useWindowSize from '@hooks/useWindowSize';
import { Category } from '@interfaces/category';
import { getCategoryList } from '@services/category';
import { formatAddressDisplayName } from '@utils/format';
import log from '@utils/logger';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useContext, useMemo, useState } from 'react';
import { Stack, Tab, Tabs } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TwitterShareButton } from 'react-share';
import useAsyncEffect from 'use-async-effect';
import ActivityStats from '../ActivityStats';
import TokenTopFilter from '../TokenTopFilter';
import collectionStyles from '../styles.module.scss';
import styles from './ShopLayout.module.scss';

type Props = {
  showReportMsg?: boolean;
  setShowReportModal: (show: boolean) => void;
};

const LOG_PREFIX = 'ShopLayout';

const TABLE_HEADINGS = [
  // <div className={styles.checkbox}>{/* <input type="checkbox" /> */}</div>,
  '',
  'Item',
  // 'Last sale',
  'Owner',
  'Buy now',
];

const ShopLayout = (props: Props) => {
  const { showReportMsg, setShowReportModal } = props;
  const router = useRouter();

  const { projectID } = router.query;

  const {
    projectData: projectInfo,
    listItems,
    isLoaded,
    total,
    isNextPageLoaded,
    handleFetchNextPage,
    showFilter,
  } = useContext(GenerativeProjectDetailContext);

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [isListLayout, setIsListLayout] = useState(false);

  const { mobileScreen } = useWindowSize();

  const mintedTime = projectInfo?.mintedTime;
  let mintDate = dayjs();
  if (mintedTime) {
    mintDate = dayjs(mintedTime);
  }
  const mintedDate = mintDate.format('MMM DD, YYYY');

  const categoryName = useMemo(() => {
    if (projectInfo && projectInfo?.categories?.length) {
      for (let i = 0; i < categoryList.length; i++) {
        if (projectInfo.categories[0] === categoryList[i].id) {
          return categoryList[i].name;
        }
      }
    }
    return null;
  }, [projectInfo, categoryList]);

  const fetchAllCategory = async () => {
    try {
      const { result } = await getCategoryList();
      setCategoryList(result);
    } catch (err: unknown) {
      log('failed to fetch category list', LogLevel.ERROR, LOG_PREFIX);
    }
  };

  const tableData = listItems?.map(item => {
    const isBuyable = item?.buyable && item?.sell_verified;

    const isBuyBTC = isBuyable && !!item?.priceBTC && item?.orderID;

    const isBuyETH = isBuyable && !!item?.priceETH;

    return {
      id: item.tokenID,

      render: {
        checkbox: (
          <div className={styles.checkbox}>
            {/* <input type="checkbox" /> */}
          </div>
        ),
        name: (
          <div className={styles.itemInfo}>
            <img
              className={styles.itemThumbnail}
              src={item.thumbnail}
              alt={item.name}
            />
            <div className={styles.itemName}>
              <Link
                href={`${ROUTE_PATH.GENERATIVE}/${projectID}/${item.tokenID}`}
              >
                <p className={s.collectionName}>
                  #{item?.orderInscriptionIndex || item?.inscriptionIndex}
                </p>
              </Link>
            </div>
          </div>
        ),
        // lastSale: <div></div>,
        owners: (
          <div className={styles.owners}>
            {formatAddressDisplayName(
              item?.owner?.displayName ||
                item?.owner?.walletAddressBtcTaproot ||
                item?.ownerAddr ||
                '-'
            )}
          </div>
        ),
        buyNow: (
          <>
            {' '}
            {isBuyable ? (
              <div className={styles.buy_btn}>
                {/* <ButtonIcon variants="outline-small" sizes={'xsmall'}>
                  {formatEthPrice(item.priceETH) === '—'
                    ? ''
                    : `${formatEthPrice(item.priceETH)} ETH`}
                </ButtonIcon>

                <ButtonIcon variants="primary" sizes={'xsmall'}>
                  {formatBTCPrice(item.priceBTC) === '—'
                    ? ''
                    : `${formatBTCPrice(item.priceBTC)} BTC`}
                </ButtonIcon> */}
                {isBuyETH && (
                  <Link
                    href=""
                    onClick={() => {
                      // DO NOTHING
                    }}
                    className={s.wrapButton}
                  >
                    <ButtonBuyListedFromETH
                      inscriptionID={item.tokenID}
                      price={item.priceETH}
                      inscriptionNumber={Number(item.inscriptionIndex || 0)}
                      orderID={item.orderID}
                    />
                  </Link>
                )}
                {isBuyBTC && (
                  <Link
                    href=""
                    className={s.wrapButton}
                    onClick={() => {
                      // DO NOTHING
                    }}
                  >
                    <ButtonBuyListedFromBTC
                      inscriptionID={item.tokenID}
                      price={item.priceBTC}
                      inscriptionNumber={Number(item.inscriptionIndex || 0)}
                      orderID={item.orderID}
                    />
                  </Link>
                )}
              </div>
            ) : (
              ''
            )}
          </>
        ),
      },
    };
  });

  useAsyncEffect(() => {
    fetchAllCategory();
  }, []);

  return (
    <div>
      {mobileScreen && (
        <>
          <div className={styles.filterWrapper} id="PROJECT_LIST">
            <TokenTopFilter className={styles.filter_sort} />
          </div>
          {showFilter && <FilterOptions attributes={projectInfo?.traitStat} />}
        </>
      )}

      <div className="row">
        <div className={`${styles.layout_left}`}>
          <Tabs className={styles.tabs} defaultActiveKey="filter">
            <Tab
              tabClassName={styles.tab}
              eventKey="filter"
              title={
                <Text size="18" fontWeight="medium" color="primary-color">
                  Filter
                </Text>
              }
            >
              <div className={styles.tabContent}>
                <div className="spacing__small">
                  <FilterOptions
                    isHideStatusLabel={true}
                    attributes={projectInfo?.traitStat}
                  />
                </div>
              </div>
            </Tab>
            <Tab
              tabClassName={styles.tab}
              eventKey="desc"
              title={
                <Text size="18" fontWeight="medium" color="primary-color">
                  Description
                </Text>
              }
            >
              <div className={styles.tabContent}>
                <ProjectDescription
                  desc={projectInfo?.desc || ''}
                  onlyDesc
                  className={styles.overflow}
                />
                <div className={s.projectAttribute}>
                  <Text size="14" color="black-40" className={s.attrs_item}>
                    Created date: {mintedDate}
                  </Text>
                  {!!categoryName && (
                    <Text size="14" color="black-40" className={s.attrs_item}>
                      Category:{' '}
                      <Link
                        href={`${ROUTE_PATH.DROPS}?category=${categoryName}`}
                      >
                        {categoryName}
                      </Link>
                    </Text>
                  )}
                  <Text size="14" color="black-40" className={s.attrs_item}>
                    Fully on-chain: {projectInfo?.isFullChain ? 'Yes' : 'No'}
                  </Text>
                </div>
                <div className={styles.shares_wrapper}>
                  <ul className={s.shares}>
                    <li>
                      <div>
                        <TwitterShareButton
                          url={`${origin}${ROUTE_PATH.GENERATIVE}/${projectInfo?.tokenID}`}
                          title={''}
                          hashtags={[]}
                        >
                          <ButtonIcon
                            sizes="small"
                            variants="outline-small"
                            className={s.projectBtn}
                            startIcon={
                              <SvgInset
                                size={14}
                                svgUrl={`${CDN_URL}/icons/ic-twitter-20x20.svg`}
                              />
                            }
                          >
                            Share
                          </ButtonIcon>
                        </TwitterShareButton>
                      </div>
                    </li>
                    <li>
                      <div
                        className={s.reportBtn}
                        onClick={() => setShowReportModal(true)}
                      >
                        <SvgInset
                          size={14}
                          svgUrl={`${CDN_URL}/icons/ic-flag.svg`}
                        />
                        <Text as="span" size="14" fontWeight="medium">
                          Report
                        </Text>
                      </div>
                    </li>
                  </ul>

                  {showReportMsg && (
                    <div className={s.reportMsg}>
                      <SvgInset
                        size={18}
                        svgUrl={`${CDN_URL}/icons/ic-bell-ringing.svg`}
                      />
                      <Text size={'14'} fontWeight="bold">
                        This collection is currently under review.
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
        <div className={`${styles.layout_middle}`}>
          {/* <Tabs className={styles.tabs} defaultActiveKey="items">
            <Tab
              tabClassName={styles.tab}
              eventKey="items"
              title={
             
              }
            > */}
          <div className={styles.view_option}>
            <Stack direction="horizontal" gap={3} className={styles.view_title}>
              <SvgInset size={14} svgUrl={`${CDN_URL}/icons/ic-image.svg`} />
              <Text size="18" fontWeight="medium" color="primary-color">
                Items {total > 0 && `(${total})`}
              </Text>
            </Stack>
            <Stack
              direction="horizontal"
              gap={3}
              className={styles.view_layout}
            >
              <SvgInset
                size={15}
                svgUrl={`${CDN_URL}/icons/ic-list.svg`}
                className={`${styles.view_list_ic} ${
                  isListLayout ? styles.active : ''
                }`}
                onClick={() => {
                  setIsListLayout(true);
                }}
              />
              <SvgInset
                size={15}
                svgUrl={`${CDN_URL}/icons/ic-grid.svg`}
                className={`${styles.view_grid_ic} ${
                  !isListLayout ? styles.active : ''
                }`}
                onClick={() => {
                  setIsListLayout(false);
                }}
              />
            </Stack>
          </div>

          <div className={collectionStyles.tokenListWrapper} id="PROJECT_LIST">
            <div
              className={`${collectionStyles.tokenList} ${
                listItems && listItems.length > 0 && styles.spacing
              }`}
            >
              {listItems && listItems.length > 0 && isListLayout ? (
                <InfiniteScroll
                  dataLength={listItems.length}
                  next={handleFetchNextPage}
                  className={s.collectionScroller}
                  hasMore={listItems.length < total}
                  loader={
                    <div className={s.scrollLoading}>
                      <Loading isLoaded={false} />
                    </div>
                  }
                  endMessage={<></>}
                >
                  <div className={styles.table_wrapper}>
                    <Table
                      className={styles.dataTable}
                      tableHead={TABLE_HEADINGS}
                      data={tableData}
                    />
                  </div>
                </InfiniteScroll>
              ) : (
                <div className={styles.projectList}>
                  <CollectionList
                    projectInfo={projectInfo}
                    listData={listItems}
                    isLoaded={isLoaded}
                    layout="shop"
                  />
                  <TriggerLoad
                    len={listItems?.length || 0}
                    total={total || 0}
                    isLoaded={isNextPageLoaded}
                    onEnter={handleFetchNextPage}
                  />
                </div>
              )}
            </div>
          </div>
          {/* </Tab>
          </Tabs> */}
        </div>
        <div className={`${styles.layout_right}`}>
          <ActivityStats />
        </div>
      </div>
    </div>
  );
};

export default ShopLayout;
