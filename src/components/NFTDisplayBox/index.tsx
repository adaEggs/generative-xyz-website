import React from 'react';
import cs from 'classnames';
import { IMAGE_TYPE, WHITE_LIST } from '@components/NFTDisplayBox/constant';
import s from './styles.module.scss';
import { convertIpfsToHttp } from '@utils/image';

import { LOGO_MARKETPLACE_URL } from '@constants/common';
import Skeleton from '@components/Skeleton';
import { ROUTE_PATH } from '@constants/route-path';
// import { GENERATIVE_PROJECT_CONTRACT } from '@constants/contract-address';
// import { getTokenUri } from '@services/token-uri';

const EXPLORER = 'https://ordinals-explorer-v5-dev.generative.xyz';
// CDN_URL;
type ContentVariantsType = 'full' | 'absolute';

interface IProps {
  className?: string;
  contentClassName?: string;
  type?: IMAGE_TYPE;
  inscriptionID?: string;
  variants?: ContentVariantsType;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
}

const NFTDisplayBox = ({
  className,
  contentClassName,
  type,
  inscriptionID,
  variants,
  autoPlay = false,
  loop = false,
  controls = false,
}: IProps) => {
  const [isError, setIsError] = React.useState(false);
  const [isLoaded, serIsLoaded] = React.useState(false);
  // const [HTMLContentRender, setHTMLContentRender] = useState<JSX.Element>();

  const onError = () => {
    setIsError(true);
    serIsLoaded(true);
  };

  const onLoaded = () => {
    serIsLoaded(true);
  };

  const getURLContent = () => `${EXPLORER}/content/${inscriptionID}`;

  const getURLPreview = () => `${EXPLORER}/preview/${inscriptionID}`;

  const contentClass = cs(s.wrapper_content, contentClassName);

  const renderIframe = () => {
    return (
      <iframe
        className={contentClass}
        src={getURLPreview()}
        sandbox="allow-scripts"
        scrolling="no"
        loading="lazy"
        onError={onError}
        onLoad={onLoaded}
      />
    );
  };

  const renderGLBIframe = () => {
    return (
      <iframe
        className={contentClass}
        src={`${ROUTE_PATH.OBJECT_PREVIEW}/${inscriptionID}`}
        scrolling="no"
        loading="lazy"
        onError={onError}
        onLoad={onLoaded}
      />
    );
  };

  const renderAudio = () => {
    return (
      <audio
        controls={controls}
        className={contentClass}
        autoPlay={autoPlay}
        loop={loop}
        src={getURLContent()}
        onError={onError}
        onLoad={onLoaded}
      />
    );
  };

  const renderVideo = () => {
    return (
      <video
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        className={contentClass}
        src={getURLContent()}
        onError={onError}
        onLoad={onLoaded}
      />
    );
  };

  const renderImage = () => {
    return (
      <img
        className={contentClass}
        src={getURLContent()}
        alt={inscriptionID}
        loading="lazy"
        onError={onError}
        onLoad={onLoaded}
        style={{ objectFit: 'contain' }}
      />
    );
  };

  const renderWhiteListImage = (link: string) => {
    return (
      <img
        className={contentClass}
        src={link}
        alt={inscriptionID}
        loading="lazy"
        onError={onError}
        onLoad={onLoaded}
        style={{ objectFit: 'contain' }}
      />
    );
  };

  const renderEmpty = () => (
    <img
      src={convertIpfsToHttp(LOGO_MARKETPLACE_URL)}
      alt={inscriptionID}
      loading={'lazy'}
    />
  );

  const renderLoading = () => (
    <Skeleton className={s.absolute} fill isLoaded={isLoaded} />
  );

  if (!inscriptionID || !type) {
    return (
      <div className={cs(s.wrapper, s[`${variants}`], className)}>
        {renderLoading()}
      </div>
    );
  }

  // const handleRenderHTML = () => {
  //   getTokenUri({
  //     contractAddress: GENERATIVE_PROJECT_CONTRACT,
  //     tokenID: inscriptionID,
  //   })
  //     .then(data => {
  //       const { image } = data;
  //       const fileExt = image?.split('.').pop();
  //       if (fileExt && fileExt === 'glb') {
  //         setHTMLContentRender(renderGLBIframe());
  //       } else {
  //         setHTMLContentRender(renderIframe());
  //       }
  //     })
  //     .catch(() => {
  //       setHTMLContentRender(renderIframe());
  //     });
  // };

  const renderContent = () => {
    const whiteList = WHITE_LIST.find(
      ({ id }) => !!id && id.toLowerCase() === inscriptionID.toLowerCase()
    );
    if (whiteList) {
      return renderWhiteListImage(whiteList.link);
    }

    switch (type) {
      case 'audio/mpeg':
      case 'audio/wav':
        return renderAudio();
      case 'video/mp4':
      case 'video/webm':
        return renderVideo();
      case 'image/apng':
      case 'image/avif':
      case 'image/gif':
      case 'image/jpeg':
      case 'image/png':
      case 'image/svg+xml':
      case 'image/webp':
        return renderImage();
      case 'application/json':
      case 'application/pdf':
      case 'application/pgp-signature':
      case 'application/yaml':
      case 'audio/flac':
      case 'model/gltf-binary':
        return renderGLBIframe();
      // case 'model/stl':
      // case 'text/html;charset=utf-8':
      //   handleRenderHTML();
      //   return <></>;
      case 'text/plain;charset=utf-8':
        return renderIframe();
      default:
        return renderIframe();
    }
  };

  return (
    <div className={cs(s.wrapper, s[`${variants}`], className)}>
      {isError ? renderEmpty() : renderContent()}
      {/* {HTMLContentRender && HTMLContentRender} */}
      {!isLoaded && renderLoading()}
    </div>
  );
};

export default NFTDisplayBox;
