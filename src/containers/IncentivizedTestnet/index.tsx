import React, { useEffect } from 'react';
import s from './styles.module.scss';
import Heading from '@components/Heading';
import { AnimFade } from '@animations/fade';
import { LoadingProvider } from '@contexts/loading-context';
import Text from '@components/Text';
import Card from '@components/Card';
import { SOCIALS } from '@constants/common';

const IncentivizedTestnet = (): JSX.Element => {
  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.classList.add('is-landing');
    }

    return () => {
      if (html) {
        html.classList.remove('is-landing');
      }
    };
  }, []);

  return (
    <div className={s.incentivized}>
      <div className={s.incentivized_inner}>
        <Heading
          as="h1"
          className={s.incentivized_heading}
          animOption={{ screen: 0.1, offset: 0, type: 'heading' }}
        >
          Incentivized Testnet
        </Heading>
        <Text
          className={s.incentivized_desc}
          as="p"
          size={'16'}
          animOption={{ screen: 0.3, offset: 0, type: 'random' }}
        >
          {`Help get Generative ready for the mainnet launch and earn GEN testnet
          tokens that can be converted into GEN mainnet tokens. The exchange
          rate will be announced prior to the mainnet's launch.`}
        </Text>
        <div className="container">
          <div className="row">
            <div className={`col-4 offset-2`}>
              <AnimFade screen={0.5} className={s.incentivized_card}>
                <Card heading={'Launching an art collection'}>
                  <div className={s.incentivized_card_content}>
                    <ul>
                      <li>
                        Proof-of-Art Testnet Reward = Proof-of-Art Mainnet
                        Reward x 100
                      </li>
                    </ul>
                    <p>
                      Launch an art collection on the testnet to mine GEN
                      testnet token with the Proof-of-Art mining mechanism.
                    </p>
                    <p>
                      You can re-publish an existing collection on the testnet.
                      This is only for testnet purposes. Check out some
                      collections on the testnet:{' '}
                      <a href={'#'} target="_blank" rel="noreferrer">
                        Fermi Origins
                      </a>{' '}
                      by George H.K. and{' '}
                      <a href={'#asdf'} target="_blank" rel="noreferrer">
                        ASDF
                      </a>{' '}
                      by jeres.
                    </p>
                  </div>
                </Card>
              </AnimFade>
            </div>
            <div className={`col-4`}>
              <AnimFade screen={0.5} className={s.incentivized_card}>
                <Card heading={'Finding bugs'}>
                  <div className={s.incentivized_card_content}>
                    <ul>
                      <li>1 bug = 100 GEN testnet tokens</li>
                    </ul>
                    <p>
                      Found a bug? Please submit the issue in the #finding-bugs
                      channel on the{' '}
                      <a
                        href={SOCIALS.discord}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Generative Discord
                      </a>{' '}
                      server.
                    </p>
                    <p>
                      The issue will be accepted if it's a reoccurring bug and
                      not a duplicate of an existing bug.
                    </p>
                  </div>
                </Card>
              </AnimFade>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WrapperIncentivizedTestnet = (): JSX.Element => {
  return (
    <LoadingProvider simple={{ theme: 'light', isCssLoading: false }}>
      <IncentivizedTestnet />
    </LoadingProvider>
  );
};

export default WrapperIncentivizedTestnet;
