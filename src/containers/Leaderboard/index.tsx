import { AnimFade } from '@animations/fade';
import ButtonIcon from '@components/ButtonIcon';
import Card from '@components/Card';
import Heading from '@components/Heading';
import Text from '@components/Text';
import { SOCIALS } from '@constants/common';
import { APP_TOKEN_SYMBOL, CDN_URL } from '@constants/config';
import {
  GEN_TOKEN_ADDRESS,
  IGNORABLE_GEN_HOLDER_ADDRESS_LIST,
} from '@constants/contract-address';
import { ROUTE_PATH } from '@constants/route-path';
import { LoadingProvider } from '@contexts/loading-context';
import { NFTHolder } from '@interfaces/nft';
import { getNFTHolderList } from '@services/nfts';
import { formatCurrency } from '@utils/format';
import cs from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import Web3 from 'web3';
import LeaderboardTable from './Table';
import s from './styles.module.scss';

const Leaderboard: React.FC = (): React.ReactElement => {
  const rounter = useRouter();

  const [userList, setUserList] = useState<Array<NFTHolder>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useAsyncEffect(async () => {
    try {
      const { result } = await getNFTHolderList({
        contractAddress: GEN_TOKEN_ADDRESS,
        page: 1,
        limit: 100,
      });
      const formattedData = result
        .filter(
          item => !IGNORABLE_GEN_HOLDER_ADDRESS_LIST.includes(item.address)
        )
        .map(item => {
          return {
            ...item,
            profile: item.profile,
            balance: formatCurrency(
              parseFloat(Web3.utils.fromWei(item.balance))
            ),
          };
        });
      setUserList(formattedData);
    } catch (err: unknown) {
      setErrorMessage('Failed to fetch leaderboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <LoadingProvider simple={{ theme: 'light', isCssLoading: false }}>
        <div className="container">
          <div className="row">
            <div className={cs(s.leaderboard, 'col-7')}>
              <div className={s.pageHeader}>
                <Heading
                  as="h2"
                  className={s.pageTitle}
                  fontWeight="medium"
                  animOption={{ screen: 0.1, offset: 0, type: 'heading' }}
                >
                  Artist Leaderboard
                </Heading>
                <div className={s.pageDescription}>
                  {/* <Text
                    animOption={{ screen: 0.3, offset: 0, type: 'paragraph' }}
                  >
                    The fellows below have shown tremendous passion for
                    generative art by promoting the movement and making
                    significant contributions to the community.
                  </Text>
                  <Text
                    animOption={{ screen: 0.3, offset: 0, type: 'paragraph' }}
                  >
                    Earn {APP_TOKEN_SYMBOL} and start climbing the ladder today!
                  </Text> */}
                  <Text>
                    Launch your art collection, share it with the world, and
                    earn {APP_TOKEN_SYMBOL} testnet tokens to compete with
                    others.
                    <Text>
                      Need more {APP_TOKEN_SYMBOL} to climb to the top? Complete
                      the tasks listed on the right.
                    </Text>
                    <Text>
                      <span className="text-secondary-purple-c">*</span>
                      {APP_TOKEN_SYMBOL} testnet tokens can be converted into{' '}
                      {APP_TOKEN_SYMBOL} mainnet tokens. The testnet-to-mainnet
                      conversion rate will be announced before the mainnet
                      launch.
                    </Text>
                  </Text>
                </div>
              </div>
              <AnimFade screen={0.5}>
                <div className={s.pageBody}>
                  {/* <Loading isLoaded={!isLoading} /> */}
                  {!isLoading && (
                    <>
                      {userList.length === 0 && (
                        <div className={s.emptyDataWrapper}>
                          <Image
                            className={s.emptyImage}
                            width={74}
                            height={100}
                            src={`${CDN_URL} / icons / ic - empty.svg`}
                            alt="empty.svg"
                          />
                          <Text className={s.emptyText}>
                            {errorMessage ? errorMessage : 'No available data'}
                          </Text>
                        </div>
                      )}
                      {userList.length > 0 && (
                        // <Table
                        //   className={s.dataTable}
                        //   tableHead={TABLE_LEADERBOARD_HEADING}
                        //   data={tableData}
                        // />
                        <LeaderboardTable userList={userList} />
                      )}
                    </>
                  )}
                </div>
              </AnimFade>
            </div>
            <div className={cs(s.earnGen, 'col-5')}>
              <Heading as="h5" fontWeight="medium" className={s.earnGen_title}>
                Earn GEN
              </Heading>
              <div className={s.earnGen_list}>
                <Card className={s.earnGen_card}>
                  <div className={s.earnGen_card_info}>
                    <Heading as="h5">Launching an art collection</Heading>
                    <Text size="18" color="black-80">
                      3,000 GEN testnet tokens
                    </Text>
                  </div>
                  <ButtonIcon
                    onClick={() => rounter.push(ROUTE_PATH.BENEFIT)}
                    sizes={'medium'}
                    variants={'outline-small'}
                  >
                    Launch art collection
                  </ButtonIcon>
                </Card>
                <Card className={s.earnGen_card}>
                  <div className={s.earnGen_card_info}>
                    <Heading as="h5">Sharing your artwork</Heading>
                    <Text size="18" color="black-80">
                      Up to 1,000 GEN testnet tokens
                    </Text>
                  </div>
                  <ButtonIcon
                    onClick={() =>
                      window.open(
                        'https://twitter.com/intent/tweet?text=' +
                          encodeURIComponent('Your tweet text here') +
                          '&url=' +
                          encodeURIComponent('https://testnet.generative.xyz'),
                        '',
                        'width=500,height=300'
                      )
                    }
                    sizes={'medium'}
                    variants={'outline-small'}
                  >
                    Share on Twitter
                  </ButtonIcon>
                </Card>
                <Card className={s.earnGen_card}>
                  <div className={s.earnGen_card_info}>
                    <Heading as="h5">Finding bugs</Heading>
                    <Text size="18" color="black-80">
                      Up to 1,000 GEN testnet tokens
                    </Text>
                  </div>
                  <ButtonIcon
                    onClick={() => window.open(SOCIALS.discord)}
                    sizes={'medium'}
                    variants={'outline-small'}
                  >
                    Report bugs
                  </ButtonIcon>
                </Card>
                <Card className={s.earnGen_card}>
                  <div className={s.earnGen_card_info}>
                    <Heading as="h5">Suggesting new features</Heading>
                    <Text size="18" color="black-80">
                      Up to 1,000 GEN testnet tokens
                    </Text>
                  </div>
                  <ButtonIcon
                    onClick={() =>
                      window.open(`${SOCIALS.discord}/#suggest-features`)
                    }
                    sizes={'medium'}
                    variants={'outline-small'}
                  >
                    Make suggestion
                  </ButtonIcon>
                </Card>
                <Card className={s.earnGen_card}>
                  <div className={s.earnGen_card_info}>
                    <Heading as="h5">Submitting pull request</Heading>
                    <Text size="18" color="black-80">
                      Up to 10,000 GEN testnet tokens
                    </Text>
                  </div>
                  <ButtonIcon
                    onClick={() =>
                      window.open(`https://github.com/generative-xyz`)
                    }
                    sizes={'medium'}
                    variants={'outline-small'}
                  >
                    Submit pull request
                  </ButtonIcon>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </LoadingProvider>
    </>
  );
};

export default Leaderboard;
