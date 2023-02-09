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
                as={'h1'}
                color={'white'}
                fontWeight={'medium'}
                className={'spacing__small'}
                animOption={{ screen: 0.2, offset: 0, type: 'heading' }}
              >
                {`Launch your artwork on Bitcoin. It's easy!`}
              </Heading>
              <Text
                size="20"
                color={'white-80'}
                className={'spacing__large'}
                fontWeight="regular"
                as="p"
                animOption={{ screen: 0.4, offset: 0, type: 'paragraph' }}
              >
                {`Generative gives you the tools to transform your creative code
                into a variety of generative art that’s stored securely on
                Bitcoin's blockchain.`}
                <br />
                <br />
                Be one of the first to discover this new frontier today!
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
                poster={`${CDN_URL}/pages/home/create-poster.png`}
              >
                <source
                  src={`${CDN_URL}/pages/home/Block%201-1-1.mp4`}
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
