import ClientOnly from '@components/Utils/ClientOnly';
import React, { ForwardedRef, useImperativeHandle, useRef } from 'react';
import s from './styles.module.scss';

interface IRef {
  reloadIframe: () => void;
  getHtmlIframe: () => HTMLIFrameElement | null;
}

interface IProps {
  url: string;
  onLoaded?: () => void;
}

const IFramePreview = React.forwardRef<IRef, IProps>(
  (props: IProps, ref: ForwardedRef<IRef>) => {
    const { url, onLoaded } = props;
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const reloadIframe = () => {
      if (iframeRef.current) {
        // eslint-disable-next-line no-self-assign
        iframeRef.current.src = iframeRef.current.src;
      }
    };

    const getHtmlIframe = (): HTMLIFrameElement | null => {
      return iframeRef.current;
    };

    useImperativeHandle(ref, () => ({
      reloadIframe,
      getHtmlIframe,
    }));

    return (
      <ClientOnly>
        <div className={s.iframePreview}>
          <iframe
            ref={iframeRef}
            className={s.iframeContainer}
            src={url}
            onLoad={onLoaded}
            style={{ overflow: 'hidden' }}
          ></iframe>
        </div>
      </ClientOnly>
    );
  }
);

export default IFramePreview;
IFramePreview.displayName = 'IFramePreview';
