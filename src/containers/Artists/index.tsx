import Text from '@components/Text';
import { Col, Row } from 'react-bootstrap';
import s from './styles.module.scss';
import { Container } from 'react-bootstrap';
import React, { useState } from 'react';
import { getArtists } from '@services/profile';
import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import useAsyncEffect from 'use-async-effect';
import cs from 'classnames';
import { User } from '@interfaces/user';
import { ArtistCard } from '@components/ArtistCard';

const ArtistsPage = () => {
  const [page, _setPage] = useState<number>(0);
  const [_total, setTotal] = useState<number>(0);
  const [artists, setArtists] = useState<User[]>();

  const loadArtist = async () => {
    const tmp = await getArtists({ limit: 12, page });

    setArtists(tmp.result);
    setTotal(tmp.total);
  };

  useAsyncEffect(async () => {
    loadArtist();
  });

  return (
    <Container>
      <Row>
        <Col md={'12'} xl={'7'} className={s.leftContainer}>
          <Heading as={'h2'} color={'black-40-solid'}>
            <strong>Be the first.</strong> Join the over 200 artists who are
            putting their own unique creations on the world’s most trusted
            blockchain: Bitcoin. Decentralized, immutable—an entirely new
            frontier.
          </Heading>
        </Col>
        <Col md={'12'} xl={'2'}>
          <ButtonIcon
            sizes={'medium'}
            variants={'secondary'}
            endIcon={
              <SvgInset svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`} />
            }
          >
            REALEASE YOUR ART
          </ButtonIcon>
          <Text as={'p'}>Need help? Ask the community</Text>
        </Col>
      </Row>
      <div className={cs(s.collectionList, `row animate-grid`)}>
        {artists?.map(artist => (
          <ArtistCard
            profile={artist}
            className={`col-wide-2_5 col-xl-3 col-lg-4 col-12`}
            key={`collection-item-${artist.id}`}
          />
        ))}
      </div>
    </Container>
  );
};

export default ArtistsPage;
