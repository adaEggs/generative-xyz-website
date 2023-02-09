import { useContext, useEffect } from 'react';
import s from './Benefit.module.scss';
import { CreatePageSection } from '@containers/Benefit/CreatePage';
import { ImageContent } from '@containers/Benefit/ImageContent';
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
              heading={`Everlasting artwork.`}
              imageUrl={`${CDN_URL}/images/BENEFIT-FOR-ARTIST1%201.png`}
            >
              Storing your generative art on the Bitcoin blockchain means it
              will last forever! Since the dawn of crypto, Bitcoin has always
              reigned king.
            </ImageContent>
            <ImageContent
              right={true}
              heading={`20x more on-chain storage.`}
              imageUrl={`${CDN_URL}/images/BENEFIT-FOR-ARTIST2%201.png`}
            >
              {`Bitcoin’s 4Mb of on-chain storage is huge! No more worries about
              reducing your file size, which means you can make your art as
              unique and sophisticated as you want.`}
            </ImageContent>
            <ImageContent
              heading={`Most popular libraries are supported.`}
              imageUrl={`${CDN_URL}/images/bitcoin.png`}
            >
              Effortlessly create art with any of the following libraries p5js,
              threejs, c2.min.js, chromajs, p5.grain.js and tonejs.
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
