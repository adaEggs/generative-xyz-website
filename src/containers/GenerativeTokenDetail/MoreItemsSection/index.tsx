import CollectionList from '@components/Collection/List';
import Heading from '@components/Heading';
import { LogLevel } from '@enums/log-level';
import { Token } from '@interfaces/token';
import { getProjectItems } from '@services/project';
import log from '@utils/logger';
import { useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';
import s from './styles.module.scss';

const LOG_PREFIX = 'MoreItemsSection';

// const SORT_OPTIONS: Array<{ value: string; label: string }> = [
//   {
//     value: 'newest',
//     label: 'Recently listed',
//   },
//   {
//     value: 'minted-newest',
//     label: 'Date minted: Newest',
//   },
// ];

type TMoreItemsSection = {
  genNFTAddr: string;
};

const MoreItemsSection = ({ genNFTAddr }: TMoreItemsSection) => {
  // const router = useRouter();
  // const { projectID } = router.query;

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [listItems, setListItems] = useState<Token[] | null>(null);
  const [sort, _] = useState('newest');

  const fetchProjectItems = async (): Promise<void> => {
    setIsLoaded(false);
    if (genNFTAddr) {
      try {
        const res = await getProjectItems(
          {
            contractAddress: genNFTAddr,
          },
          {
            limit: 4,
            page: 1,
            sort,
          }
        );
        setIsLoaded(true);
        setListItems(res.result);
      } catch (_: unknown) {
        log('failed to fetch project items data', LogLevel.ERROR, LOG_PREFIX);
      }
    }
  };

  useEffect(() => {
    fetchProjectItems();
  }, [genNFTAddr, sort]);

  return (
    <div className="position-relative">
      <Stack direction="horizontal" className={s.heading}>
        <Heading as="h4" fontWeight="bold">
          More from this collection
        </Heading>
        {/* <div className={s.dropDownWrapper}>
          <Select
            isSearchable={false}
            isClearable={false}
            defaultValue={SORT_OPTIONS[0]}
            options={SORT_OPTIONS}
            className={s.selectInput}
            classNamePrefix="select"
            onChange={(op: SingleValue<SelectOption>) => {
              if (op) setSort(op.value);
            }}
          />
        </div> */}
      </Stack>
      <div className={s.listWrapper}>
        {/* <Loading isLoaded={isLoaded} className={s.loading} /> */}

        <CollectionList listData={listItems} isLoaded={isLoaded} />
        {/* {isLoaded && (
          <div className={s.view_collection}>
            <ButtonIcon
              sizes="large"
              variants="outline"
              endIcon={
                <SvgInset
                  className={s.icon_btn}
                  svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
                />
              }
              onClick={() => {
                router.push(`${ROUTE_PATH.GENERATIVE}/${projectID}`);
              }}
            >
              View collection
            </ButtonIcon>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default MoreItemsSection;
