import React from 'react';
import s from './CreatePage.module.scss';
import Text from '@components/Text';
import { Col, Container, Row } from 'react-bootstrap';
import ButtonIcon from '@components/ButtonIcon';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { ROUTE_PATH } from '@constants/route-path';
import { useRouter } from 'next/router';
import { AnimFade } from '@animations/fade';
import Heading from '@components/Heading';

export const CreatePageSection = (): JSX.Element => {
  const router = useRouter();

  const onClick = () => {
    router.push(ROUTE_PATH.CREATE_PROJECT);
  };

  return (
    <div className={s.createPage}>
      <Container>
        <Row>
          <Col xl={{ span: 5, order: 0 }} xs={{ span: 12, order: 1 }}>
            <div className={s.createPage_content}>
              <Heading
                as={'h5'}
                color={'purple-a'}
                className={'spacing__small'}
                fontWeight={'semibold'}
                animOption={{ screen: 0, offset: 0, type: 'random' }}
              >
                Incentivized testnet
              </Heading>
              <Heading
                as={'h1'}
                color={'white'}
                fontWeight={'semibold'}
                className={'spacing__small'}
                animOption={{ screen: 0.2, offset: 0, type: 'heading' }}
              >
                Empowers generative artists and powers generative artworks.
              </Heading>
              <Text
                size="20"
                color={'white-80'}
                className={'spacing__large'}
                fontWeight="regular"
                as="p"
                animOption={{ screen: 0.4, offset: 0, type: 'paragraph' }}
              >
                Generative is a community-run platform that is fully open and
                permissionless. Allowing artists to transform creative code into
                a variety of generative art that evolves with each minting of a
                collection.
              </Text>
              <AnimFade screen={0.6}>
                <ButtonIcon
                  onClick={onClick}
                  sizes={'medium'}
                  variants={'secondary'}
                  endIcon={
                    <SvgInset
                      svgUrl={`${CDN_URL}/icons/ic-arrow-right-18x18.svg`}
                    />
                  }
                >
                  Launch your art
                </ButtonIcon>
              </AnimFade>
            </div>
          </Col>
          <Col
            xl={{ span: 6, offset: 1, order: 1 }}
            xs={{ span: 12, order: 0 }}
          >
            <div className={s.createPage_project}>
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={`${CDN_URL}/pages/home/videos/poster-video.jpeg`}
              >
                <source
                  src={`${CDN_URL}/pages/landingpage/Block%201-1-1.mp4`}
                  type="video/mp4"
                />
              </video>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
