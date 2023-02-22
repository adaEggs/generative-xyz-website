import Text from '@components/Text';
import { Col, Row } from 'react-bootstrap';
import s from './styles.module.scss';
import { Container } from 'react-bootstrap';
import React, { useCallback, useContext, useState } from 'react';
import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import useAsyncEffect from 'use-async-effect';
import cs from 'classnames';
import { User } from '@interfaces/user';
import { ArtistCard } from '@components/ArtistCard';
import ArtistCardSkeleton from '@components/ArtistCard/skeleton';
import { TriggerLoad } from '@components/TriggerLoader';
import { SOCIALS } from '@constants/common';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@constants/route-path';
import { getUserSelector } from '@redux/user/selector';
import { useAppSelector } from '@redux';
import log from '@utils/logger';
import { LogLevel } from '@enums/log-level';
import { WalletContext } from '@contexts/wallet-context';
import { getArtists } from '@services/user';

const LOG_PREFIX = 'ArtistsPage';

const ArtistsPage = () => {
  const limit = 12;
  const router = useRouter();
  const { connect } = useContext(WalletContext);
  const user = useAppSelector(getUserSelector);
  const [isConnecting, setIsConnecting] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [artists, setArtists] = useState<User[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadArtist = useCallback(async () => {
    setIsLoading(false);
    const tmp = await getArtists({ limit, page });
    const merArr = [...(artists || []), ...tmp.result];
    setPage(page + 1);
    setArtists(merArr);
    setTotal(tmp.total);
    setIsLoading(true);
  }, [setArtists, setTotal, setIsLoading, setPage, artists]);

  useAsyncEffect(async () => {
    loadArtist();
  }, []);

  const handleConnectWallet = async (): Promise<void> => {
    try {
      setIsConnecting(true);
      await connect();
      router.push(ROUTE_PATH.CREATE_BTC_PROJECT);
    } catch (err: unknown) {
      log(err as Error, LogLevel.DEBUG, LOG_PREFIX);
    } finally {
      setIsConnecting(false);
    }
  };

  const onClickToUpload = useCallback(async () => {
    if (user) {
      router.push(ROUTE_PATH.CREATE_BTC_PROJECT);
    } else {
      handleConnectWallet();
    }
  }, [user]);

  return (
    <div className={s.artistPage}>
      <Container>
        <Row className={s.artistPage_row}>
          <Col md={'12'} xl={'7'} className={s.leftContainer}>
            <Heading as={'h4'} fontWeight={'semibold'} color={'black-40-solid'}>
              <strong>Be the first.</strong> Join the over 200 artists who are
              putting their own unique creations on the world’s most trusted
              blockchain: Bitcoin. Fully on-chain, decentralized, and immutable
              — an entirely new frontier.
            </Heading>
          </Col>
          <Col md={'12'} xl={'2'} className={s.rightAction}>
            <ButtonIcon
              sizes={'large'}
              variants={'secondary'}
              disabled={isConnecting}
              onClick={onClickToUpload}
              endIcon={
                !isConnecting && (
                  <SvgInset
                    svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
                  />
                )
              }
            >
              {isConnecting ? 'Connecting...' : 'Launch Your Art On Bitcoin'}
            </ButtonIcon>
            <Text
              as={'p'}
              size="16"
              fontWeight="semibold"
              color={'black-40-solid'}
              className={s.artistPage_row_link}
            >
              Need help?{' '}
              <a href={SOCIALS.discord} target="_blank" rel="noreferrer">
                Ask the community
              </a>
            </Text>
          </Col>
        </Row>

        <div className={cs(s.artistList, `row animate-grid`)}>
          {artists?.map(artist => (
            <ArtistCard
              profile={artist}
              className={`col-wide-2_5 col-xl-3 col-lg-4 col-sm-6 col-12`}
              key={`collection-item-${artist.id}`}
            />
          ))}
        </div>

        {!isLoading && page === 1 && (
          <div className={cs(s.artistList, `row animate-grid`)}>
            {[...Array(12)].map((_, key) => (
              <ArtistCardSkeleton
                key={`sk_${key}`}
                className={`col-wide-2_5 col-xl-3 col-lg-4 col-sm-6 col-12`}
              />
            ))}
          </div>
        )}

        <TriggerLoad
          len={(page - 1) * limit}
          total={total}
          isLoaded={isLoading}
          onEnter={loadArtist}
        />
      </Container>
    </div>
  );
};

export default ArtistsPage;
