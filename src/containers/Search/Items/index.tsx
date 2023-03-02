/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  AutoSizer,
  InfiniteLoader,
  List,
  Grid,
  WindowScroller,
} from 'react-virtualized';
import cn from 'classnames';

// import Heading from '@components/Heading';
// import ListForSaleModal from '@containers/Trade/ListForSaleModal';
import ProjectListLoading from '@containers/Trade/ProjectListLoading';
// import { ProjectList } from '@containers/Trade/ProjectLists';
import { ProjectCardOrd } from '@containers/Trade/ProjectCardOrd';

// import ButtonIcon from '@components/ButtonIcon';
// import { Loading } from '@components/Loading';
// import { ROUTE_PATH } from '@constants/route-path';
import { getListingOrdinals } from '@services/marketplace-btc';
import debounce from 'lodash/debounce';
// import uniqBy from 'lodash/uniqBy';
// import { useRouter } from 'next/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
// import InfiniteScroll from 'react-infinite-scroll-component';
import s from './Items.module.scss';
import { IGetMarketplaceBtcListItem } from '@interfaces/api/marketplace-btc';
// import useBTCSignOrd from '@hooks/useBTCSignOrd';

export const Items = (): JSX.Element => {
  // const router = useRouter();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [dataOrd, setdataOrd] = useState<IGetMarketplaceBtcListItem[]>([]);
  const [dataOrd, setdataOrd] = useState<any>([]);
  const [fromOrd, setFromOrd] = useState(0);

  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  useEffect(() => {
    debounceFetchDataOrdinals();
  }, []);

  // const [showModal, setShowModal] = useState<boolean>(false);

  // const { ordAddress, onButtonClick } = useBTCSignOrd();

  // const onShowModal = () => {
  //   onButtonClick({
  //     cbSigned: () => setShowModal(true),
  //   }).then();
  // };

  // const goToInscriptionsPage = () => {
  //   router.push(ROUTE_PATH.INSCRIBE);
  // };

  const fetchDataOrdinals = async () => {
    try {
      setIsLoaded(true);
      setIsNextPageLoading(true);
      const res = await getListingOrdinals(fromOrd);
      setFromOrd(res.prev);
      console.time('tam');
      // const newList = uniqBy(
      //   [...dataOrd, ...res.data],
      //   item => item.inscriptionID
      // );
      const array = res.data || [];
      const chunkSize = 3;
      for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        // do whatever
        dataOrd.push(chunk);
      }
      setdataOrd(dataOrd);
      console.timeEnd('tam');
    } catch (error) {
      // handle fetch data error here
    } finally {
      setIsLoading(false);
      setIsNextPageLoading(false);
    }
  };

  const debounceFetchDataOrdinals = debounce(fetchDataOrdinals, 300);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const loadMoreRows = isNextPageLoading ? () => {} : debounceFetchDataOrdinals;

  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    // style, // Style object to be applied to row (to position it)
  }) => {
    return (
      <div key={key} className={s.items_projectItem}>
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAXNSR0IArs4c6QAAFclJREFUeF7tnYWS5cYSRLVmZmZm9v//gZmZmZntdaTCcmhqSlLr3tHG5tTpiAm/tyNpqk+W8nZXt3RPPPXUUyc7GgQgAAEDAicwLAOVCBECEOgJYFgkAgQgYEMAw7KRikAhAAEMixyAAARsCGBYNlIRKAQggGGRAxCAgA0BDMtGKgKFAAQwLHIAAhCwIYBh2UhFoBCAAIZFDkAAAjYEMCwbqQgUAhDAsMgBCEDAhgCGZSMVgUIAAhgWOQABCNgQwLBspCJQCEAAwyIHIAABGwIYlo1UBAoBCGBY5AAEIGBDAMOykYpAIQABDIscgAAEbAhgWDZSESgEIIBhkQMQgIANAQzLRioChQAEMCxyAAIQsCGAYdlIRaAQgACGRQ5AAAI2BDAsG6kIFAIQwLDIAQhAwIYAhmUjFYFCAAIYFjkAAQjYEMCwbKQiUAhAAMMiByAAARsCGJaNVAQKAQhgWOQABCBgQwDDspGKQCEAAQyLHIAABGwIYFg2UhEoBCCAYZEDEICADQEMy0YqAoUABDAscgACELAhgGHZSEWgEIAAhkUOQAACNgQwLBupCBQCEMCwyAEIQMCGAIZlIxWBQgACGBY5AAEI2BDAsGykIlAIQADDIgcgAAEbAhiWjVQECgEIYFjkAAQgYEMAw7KRikAhAAEMixyAAARsCGBYNlIRKAQggGGRAxCAgA0BDMtGKgKFAAQwLHIAAhCwIYBh2UhFoBCAAIZFDkAAAjYEMCwbqQgUAhDAsMgBCEDAhgCGZSMVgUIAAhgWOQABCNgQwLBspCJQCEAAwyIHIAABGwIYlo1UBAoBCGBY5AAEIGBDAMOykYpAIQABDIscgAAEbAhgWDZSESgEIIBhkQMQgIANAQzLRioChQAEMCxyAAIQsCGAYdlIRaAQgACGRQ5AAAI2BDAsG6kIFAIQwLDIAQhAwIYAhmUjFYFCAAIYFjkAAQjYEMCwbKQiUAhAAMMiByAAARsCGJaNVAQKAQhgWOQABCBgQwDDspGKQCEAAQyLHIAABGwIYFg2UhEoBCCAYZEDEICADQEMy0YqAoUABDAscgACELAhgGHZSEWgEIAAhkUOQAACNgQwLBupCBQCEMCwyAEIQMCGAIZlIxWBQgACGBY5AAEI2BDAsGykIlAIQADDIgcgAAEbAhiWjVQECgEIYFjkAAQgYEMAw7KRikAhAAEMixyAAARsCGBYNlIRKAQggGGRAxCAgA0BDMtGKgKFAAQwLHIAAhCwIYBh2UhFoBCAAIZFDkAAAjYEMCwbqQgUAhDAsMgBCEDAhgCGZSMVgUIAAhgWOQABCNgQwLBspCJQCEAAwyIHIAABGwIYlo1UBAoBCGBY5AAEIGBDAMOykYpAIQABDIscgAAEbAhgWDZSESgEIIBhkQMQgIANAQzLRioChQAEMCxyAAIQsCGAYdlIRaAQgACGRQ5AAAI2BDAsG6kIFAIQwLDIAQhAwIYAhmUjFYFCAAIYFjkAAQjYEMCwbKQiUAhAAMMiByAAARsCGJaNVAQKAQhgWOQABCBgQwDDspGKQCEAAQyLHIAABGwIYFg2UhEoBCCAYSU5cM4553SXXXZZd+6553Znn3129/fff3e//vpr//Pzzz93//zzz86Zo+tddNFF3QUXXNCdeeaZ3V9//dVf98cff+z/965N17rwwgv7H/0Nxfjbb7/11/399993vazNeer3xRdf3Em7s846q/vzzz97rr/88kv/35MnT+7cl/POO6/nev7553dnnHFGz1Nsf/jhh72uu1Uu7NxRgxMxrJFIV1xxRXfTTTf1N/xcU7K+9957vXm1NhnU7bff3in5p5purg8//LD76aefWi/b35y33XZbd+mll06eo5v3008/7b788svm67ocKL2uuuqq3vzn2vfff9+9//77vZG1tiuvvLLPBzHOmkxQHwjKhTXX3SoXWvvlfByG9Z96d955Zz+qWtOUrG+88cbiKTfccEN3/fXXLx43HPDJJ5/0BrPUNKK45557lg77//caEbz11lt7jQqa/9jGB8qg7r///n4UvKaJq/gutfvuu68fVbU0GZe4iu9S2yoXlv7ucfk9htV13c0339xdc801O2n6xRdf9KOiqabr6vpr28cff9x99tlnk6fpU1o31YkTJ1ZdWqO3119/fdU5p+PBDz744OxodS7mN998c9Zc7r777u6SSy5Z3e1XX321n4Ke6lxYHajxCeUNS3WJBx544JCEQ91K0z7VlmQQGoFlBqFRlkZbsenT/6GHHjr076ov6boyj3E9Kx748ssv97WSrD322GOHpkH6pB9qK6rl6NrZ9FYGK6N1bRqtaqQS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"
          alt="placeholder img"
        />
        <div>{index}xInfin1ty</div>
        <div>Genesis Series: Timechain</div>
        <div className="flex">
          <span>0.1 BTC</span>
          <span>138/512 minted</span>
        </div>
      </div>
      // <ProjectCardOrd
      //   key={key}
      //   className={cn('col-12', s.items_maxHeight)}
      //   index={index}
      //   project={dataOrd[index]}
      // />
    );
  };
  const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    return (
      <div key={key} className={s.items_projectItem}>
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAXNSR0IArs4c6QAAFclJREFUeF7tnYWS5cYSRLVmZmZm9v//gZmZmZntdaTCcmhqSlLr3tHG5tTpiAm/tyNpqk+W8nZXt3RPPPXUUyc7GgQgAAEDAicwLAOVCBECEOgJYFgkAgQgYEMAw7KRikAhAAEMixyAAARsCGBYNlIRKAQggGGRAxCAgA0BDMtGKgKFAAQwLHIAAhCwIYBh2UhFoBCAAIZFDkAAAjYEMCwbqQgUAhDAsMgBCEDAhgCGZSMVgUIAAhgWOQABCNgQwLBspCJQCEAAwyIHIAABGwIYlo1UBAoBCGBY5AAEIGBDAMOykYpAIQABDIscgAAEbAhgWDZSESgEIIBhkQMQgIANAQzLRioChQAEMCxyAAIQsCGAYdlIRaAQgACGRQ5AAAI2BDAsG6kIFAIQwLDIAQhAwIYAhmUjFYFCAAIYFjkAAQjYEMCwbKQiUAhAAMMiByAAARsCGJaNVAQKAQhgWOQABCBgQwDDspGKQCEAAQyLHIAABGwIYFg2UhEoBCCAYZEDEICADQEMy0YqAoUABDAscgACELAhgGHZSEWgEIAAhkUOQAACNgQwLBupCBQCEMCwyAEIQMCGAIZlIxWBQgACGBY5AAEI2BDAsGykIlAIQADDIgcgAAEbAhiWjVQECgEIYFjkAAQgYEMAw7KRikAhAAEMixyAAARsCGBYNlIRKAQggGGRAxCAgA0BDMtGKgKFAAQwLHIAAhCwIYBh2UhFoBCAAIZFDkAAAjYEMCwbqQgUAhDAsMgBCEDAhgCGZSMVgUIAAhgWOQABCNgQwLBspCJQCEAAwyIHIAABGwIYlo1UBAoBCGBY5AAEIGBDAMOykYpAIQABDIscgAAEbAhgWDZSESgEIIBhkQMQgIANAQzLRioChQAEMCxyAAIQsCGAYdlIRaAQgACGRQ5AAAI2BDAsG6kIFAIQwLDIAQhAwIYAhmUjFYFCAAIYFjkAAQjYEMCwbKQiUAhAAMMiByAAARsCGJaNVAQKAQhgWOQABCBgQwDDspGKQCEAAQyLHIAABGwIYFg2UhEoBCCAYZEDEICADQEMy0YqAoUABDAscgACELAhgGHZSEWgEIAAhkUOQAACNgQwLBupCBQCEMCwyAEIQMCGAIZlIxWBQgACGBY5AAEI2BDAsGykIlAIQADDIgcgAAEbAhiWjVQECgEIYFjkAAQgYEMAw7KRikAhAAEMixyAAARsCGBYNlIRKAQggGGRAxCAgA0BDMtGKgKFAAQwLHIAAhCwIYBh2UhFoBCAAIZFDkAAAjYEMCwbqQgUAhDAsMgBCEDAhgCGZSMVgUIAAhgWOQABCNgQwLBspCJQCEAAwyIHIAABGwIYlo1UBAoBCGBY5AAEIGBDAMOykYpAIQABDIscgAAEbAhgWDZSESgEIIBhkQMQgIANAQzLRioChQAEMCxyAAIQsCGAYdlIRaAQgACGRQ5AAAI2BDAsG6kIFAIQwLDIAQhAwIYAhmUjFYFCAAIYFjkAAQjYEMCwbKQiUAhAAMMiByAAARsCGJaNVAQKAQhgWOQABCBgQwDDspGKQCEAAQyLHIAABGwIYFg2UhEoBCCAYSU5cM4553SXXXZZd+6553Znn3129/fff3e//vpr//Pzzz93//zzz86Zo+tddNFF3QUXXNCdeeaZ3V9//dVf98cff+z/965N17rwwgv7H/0Nxfjbb7/11/399993vazNeer3xRdf3Em7s846q/vzzz97rr/88kv/35MnT+7cl/POO6/nev7553dnnHFGz1Nsf/jhh72uu1Uu7NxRgxMxrJFIV1xxRXfTTTf1N/xcU7K+9957vXm1NhnU7bff3in5p5purg8//LD76aefWi/b35y33XZbd+mll06eo5v3008/7b788svm67ocKL2uuuqq3vzn2vfff9+9//77vZG1tiuvvLLPBzHOmkxQHwjKhTXX3SoXWvvlfByG9Z96d955Zz+qWtOUrG+88cbiKTfccEN3/fXXLx43HPDJJ5/0BrPUNKK45557lg77//caEbz11lt7jQqa/9jGB8qg7r///n4UvKaJq/gutfvuu68fVbU0GZe4iu9S2yoXlv7ucfk9htV13c0339xdc801O2n6xRdf9KOiqabr6vpr28cff9x99tlnk6fpU1o31YkTJ1ZdWqO3119/fdU5p+PBDz744OxodS7mN998c9Zc7r777u6SSy5Z3e1XX321n4Ke6lxYHajxCeUNS3WJBx544JCEQ91K0z7VlmQQGoFlBqFRlkZbsenT/6GHHjr076ov6boyj3E9Kx748ssv97WSrD322GOHpkH6pB9qK6rl6NrZ9FYGK6N1bRqtaqQS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"
          alt="placeholder img"
        />
        <div>
          {columnIndex},{rowIndex}xInfin1ty
        </div>
        <div>Genesis Series: Timechain</div>
        <div className="flex">
          <span>0.1 BTC</span>
          <span>138/512 minted</span>
        </div>
      </div>
    );
  };

  const isRowLoaded = ({ index }) => {
    return !!dataOrd[index];
  };
  console.log('big list:', dataOrd);
  return (
    <div className={s.items}>
      <Row className={s.items_projects}>
        <Col xs={12}>
          {!isLoaded ? (
            <ProjectListLoading numOfItems={12} />
          ) : (
            <>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <WindowScroller>
                    {({ height, isScrolling, onChildScroll, scrollTop }) => (
                      <InfiniteLoader
                        isRowLoaded={isRowLoaded}
                        loadMoreRows={loadMoreRows}
                        rowCount={dataOrd.length + 1}
                        threshold={1}
                      >
                        {({ onRowsRendered, registerChild }) => (
                          // <List
                          //   autoHeight
                          //   onRowsRendered={onRowsRendered}
                          //   ref={registerChild}
                          //   height={height}
                          //   isScrolling={isScrolling}
                          //   onScroll={onChildScroll}
                          //   rowCount={dataOrd.length}
                          //   rowHeight={50}
                          //   rowRenderer={rowRenderer}
                          //   scrollTop={scrollTop}
                          //   width={width}
                          // />
                          <Grid
                            cellRenderer={cellRenderer}
                            columnCount={dataOrd?.[0]?.length || 3}
                            columnWidth={100}
                            height={height}
                            rowCount={dataOrd.length}
                            rowHeight={50}
                            width={1000}
                          />
                        )}
                      </InfiniteLoader>
                    )}
                  </WindowScroller>
                )}
              </AutoSizer>
              {isNextPageLoading && (
                <div className={s.items_loader}>
                  <span>loading more data..</span>
                </div>
              )}
            </>
            // <InfiniteScroll
            //   dataLength={dataOrd.length}
            //   next={debounceFetchDataOrdinals}
            //   className={s.recentWorks_projects_list}
            //   hasMore={true}
            //   loader={
            //     isLoading ? (
            //       <div className={s.recentWorks_projects_loader}>
            //         <Loading isLoaded={isLoading} />
            //       </div>
            //     ) : null
            //   }
            //   endMessage={<></>}
            // >
            //   <ProjectList isNFTBuy={false} listData={dataOrd} />
            // </InfiniteScroll>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Items;
