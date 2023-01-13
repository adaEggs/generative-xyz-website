import { useContext, useEffect } from 'react';
import s from './Benefit.module.scss';
import { CreatePageSection } from '@containers/Benefit/components/CreatePage';
import { ImageContent } from '@containers/Benefit/components/ImageContent';
import { CDN_URL } from '@constants/config';
import { Container } from 'react-bootstrap';
import { LoadingContext, LoadingProvider } from '@contexts/loading-context';

const BenefitPage = (): JSX.Element => {
  const { registerLoading, unRegisterLoading } = useContext(LoadingContext);

  registerLoading();
  useEffect(() => {
    unRegisterLoading();
    const html = document.querySelector('html');
    if (html) {
      html.classList.add('is-landing');
    }

    return () => {
      unRegisterLoading();
      if (html) {
        html.classList.remove('is-landing');
      }
    };
  }, []);

  return (
    <div className={s.benefit}>
      <CreatePageSection />
      <Container>
        <div className={s.benefit_rows}>
          <div className={s.benefit_rows_inner}>
            <ImageContent
              heading={`An open generative art platform.`}
              imageUrl={`${CDN_URL}/pages/landingpage/benefit-section-1.png`}
            >
              Generative is fully open and permissionless. Anyone, from an
              anonymous to a well-known artist, has equal access to create and
              monetize their artwork.
              <br />
              <br />
              More than a marketplace for artists and collectors, Generative
              incorporates community, governance, and a DAO treasury.
            </ImageContent>
            <ImageContent
              right={true}
              heading={`Co-own and co-operate.`}
              imageUrl={`${CDN_URL}/pages/landingpage/benefit-section-2.png`}
            >
              Artists are no longer just users, they become co-owners—helping to
              build and shape the platform.
              <br />
              <br />A portion of the platform fees are trustlessly sent to the
              Generative DAO treasury that’s controlled exclusively by the
              community via governance— meaning a proposal can be created by
              anyone. The community will vote to fund a new artist, hire a
              curation board, organize an IRL exhibition, or do anything else to
              promote the generative art movement.
            </ImageContent>
            <ImageContent
              heading={`Everlasting artwork.`}
              imageUrl={`${CDN_URL}/pages/landingpage/benefit-section-3.png`}
            >
              All generative scripts are stored permanently on Ethereum.
            </ImageContent>
          </div>
        </div>
      </Container>
    </div>
  );
};

const BenefitWrapper = (): JSX.Element => {
  return (
    <LoadingProvider simple={{ theme: 'dark', isCssLoading: false }}>
      <BenefitPage />
    </LoadingProvider>
  );
};

export default BenefitWrapper;
