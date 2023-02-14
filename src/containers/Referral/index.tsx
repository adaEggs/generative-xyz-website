import { AnimFade } from '@animations/fade';
import ButtonIcon from '@components/ButtonIcon';
import Heading from '@components/Heading';
import Link from '@components/Link';
import Text from '@components/Text';
import { LoadingProvider } from '@contexts/loading-context';
import React from 'react';
import s from './styles.module.scss';

const Referral = () => {
  return (
    <LoadingProvider simple={{ theme: 'light', isCssLoading: false }}>
      <div className={s.referral}>
        <div className="container">
          <div className={s.pageHeader}>
            <Heading
              as="h2"
              className={s.pageTitle}
              fontWeight="medium"
              animOption={{ screen: 0.1, offset: 0, type: 'heading' }}
            >
              Referral
            </Heading>
            <div className={s.pageDescription}>
              <Text animOption={{ screen: 0.3, offset: 0, type: 'paragraph' }}>
                The fellows below have shown tremendous passion for generative
                art by promoting the movement and making significant
                contributions to the community.
              </Text>
              <Text animOption={{ screen: 0.3, offset: 0, type: 'paragraph' }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
                minima, maxime necessitatibus maiores nemo soluta laudantium,
                nesciunt similique qui ducimus voluptas quis adipisci tempore
                consectetur! Placeat cumque dolorum praesentium recusandae.
              </Text>
              <AnimFade screen={0.4}>
                <ButtonIcon className={s.referralBtn}>
                  <Link href={'/'}>Earn Now</Link>
                </ButtonIcon>
              </AnimFade>
            </div>
          </div>
        </div>
      </div>
    </LoadingProvider>
  );
};

export default Referral;
