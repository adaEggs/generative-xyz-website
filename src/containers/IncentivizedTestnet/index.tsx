import React, { useEffect } from 'react';
import s from './styles.module.scss';
import Heading from '@components/Heading';
import { AnimFade } from '@animations/fade';
import { LoadingProvider } from '@contexts/loading-context';
import Text from '@components/Text';
import Card from '@components/Card';
import { SOCIALS } from '@constants/common';
import ButtonIcon from '@components/ButtonIcon';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@constants/route-path';

const IncentivizedTestnet = (): JSX.Element => {
  const rounter = useRouter();
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
          animOption={{ screen: 0.3, offset: 0, type: 'paragraph' }}
        >
          Help get Generative ready for the mainnet launch and earn GEN testnet
          tokens that can be converted into GEN mainnet tokens. The exchange
          rate will be announced prior to the {`mainnet's`} launch.
        </Text>
        <div className="container">
          <div className="row">
            <div
              className={`col-xl-4 col-md-6 col-12 offset-xl-2 ${s.incentivized_col} ${s.incentivized_col_left}`}
            >
              <AnimFade screen={0.4} className={s.incentivized_card}>
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
                    <ButtonIcon
                      onClick={() => rounter.push(ROUTE_PATH.BENEFIT)}
                      sizes={'medium'}
                      variants={'outline-small'}
                    >
                      Launch art collection
                    </ButtonIcon>
                  </div>
                </Card>
              </AnimFade>
              <AnimFade screen={0.6} className={s.incentivized_card}>
                <Card heading={'Suggesting new features'}>
                  <div className={s.incentivized_card_content}>
                    <ul>
                      <li>1 feature = 1,000 GEN testnet tokens</li>
                    </ul>
                    <p>
                      Have a great idea? Please submit a suggestion in the
                      #suggest-features channel on the Generative Discord
                      server.
                    </p>
                    <p>
                      {`The feature suggestion will be accepted if the community
                      thinks it's a good idea and it is not a duplicate of an
                      existing suggestion.`}
                    </p>
                    <ButtonIcon
                      onClick={() =>
                        window.open(`${SOCIALS.discord}/#suggest-features`)
                      }
                      sizes={'medium'}
                      variants={'outline-small'}
                    >
                      Make suggestion
                    </ButtonIcon>
                  </div>
                </Card>
              </AnimFade>
              <AnimFade screen={0.8} className={s.incentivized_card}>
                <Card heading={'Submitting pull requests'}>
                  <div className={s.incentivized_card_content}>
                    <ul>
                      <li>
                        1 pull request = 1,000 to 10,000 GEN testnet tokens
                      </li>
                    </ul>
                    <p>
                      Are you a dev? Help develop the Generative protocol by
                      submitting a pull request on the{' '}
                      <a
                        href="https://github.com/generative-xyz"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Generative Github
                      </a>{' '}
                      repo.
                    </p>
                    <p>
                      GEN testnet tokens are rewarded if the pull request gets
                      accepted and merged. Depending on the impact of the pull
                      request, the reward is between 1,000 and 10,000 tokens.
                    </p>
                    <ButtonIcon
                      onClick={() =>
                        window.open(`https://github.com/generative-xyz`)
                      }
                      sizes={'medium'}
                      variants={'outline-small'}
                    >
                      Submit pull request
                    </ButtonIcon>
                  </div>
                </Card>
              </AnimFade>
            </div>
            <div
              className={`col-xl-4 col-sm-6 col-12 ${s.incentivized_col} ${s.incentivized_col_right}`}
            >
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
                      The issue will be accepted if {`it's`} a reoccurring bug
                      and not a duplicate of an existing bug.
                    </p>
                    <ButtonIcon
                      onClick={() => window.open(SOCIALS.discord)}
                      sizes={'medium'}
                      variants={'outline-small'}
                    >
                      Report bugs
                    </ButtonIcon>
                  </div>
                </Card>
              </AnimFade>
              <AnimFade screen={0.7} className={s.incentivized_card}>
                <Card heading={'Promoting the testnet'}>
                  <div className={s.incentivized_card_content}>
                    <ul>
                      <li>1 promotion = 10 to 1,000 GEN testnet tokens</li>
                    </ul>
                    <p>
                      Help promote Generative to the generative art community.
                      Submit your contribution in the #promote-the-testnet
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
                      Tweets, videos, tutorials, forum posts, and translations
                      are examples of contributions that can earn you GEN
                      testnet tokens. Depending on the impact of the
                      contribution, the reward is between 10 and 1000 tokens.
                    </p>
                    <ButtonIcon
                      onClick={() =>
                        window.open(
                          'https://twitter.com/intent/tweet?text=' +
                            encodeURIComponent('Your tweet text here') +
                            '&url=' +
                            encodeURIComponent(
                              'https://testnet.generative.xyz'
                            ),
                          '',
                          'width=500,height=300'
                        )
                      }
                      sizes={'medium'}
                      variants={'outline-small'}
                    >
                      Share on Twitter
                    </ButtonIcon>
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
