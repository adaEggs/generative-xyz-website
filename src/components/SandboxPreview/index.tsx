import s from './styles.module.scss';
import React, {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import useAsyncEffect from 'use-async-effect';
import { ISandboxRef, SandboxFiles } from '@interfaces/sandbox';
import { SandboxSWEventType } from '@enums/service-worker';
import { generateID } from '@utils/generate-data';
import cs from 'classnames';

interface IProps {
  sandboxFiles: SandboxFiles | null;
  rawHtml: string | null;
  hash: string | null;
  onLoaded?: () => void;
  showIframe?: boolean;
  className?: string;
}

const SandboxPreview = React.forwardRef<ISandboxRef, IProps>(
  (props: IProps, ref: ForwardedRef<ISandboxRef>) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const workerReg = useRef<ServiceWorker | null>(null);
    const {
      sandboxFiles,
      rawHtml,
      hash,
      onLoaded,
      showIframe = true,
      className,
    } = props;
    const [id, setId] = useState<string>('0');
    const [workerIns, setWorkerIns] = useState<ServiceWorker | null>(null);

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

    useEffect(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function (registration) {
          if (registration.active) {
            const serviceWorker = registration.active;
            workerReg.current = serviceWorker;
            setWorkerIns(serviceWorker);
          }
        });
      }
    }, []);

    useAsyncEffect(async () => {
      if (sandboxFiles && workerReg.current) {
        const worker = workerReg.current;

        if (!worker || worker.state !== 'activated') {
          return;
        }

        const id = generateID(6);

        worker.postMessage({
          type: SandboxSWEventType.REGISTER_REFERRER,
          data: {
            id: id,
            referrer: {
              base: `${location.origin}/sandbox/preview.html`,
              root: `${location.origin}/sandbox/`,
            },
          },
        });

        worker.postMessage({
          type: SandboxSWEventType.REGISTER_URLS,
          data: {
            id,
            record: sandboxFiles,
          },
        });

        setId(id);
      }
    }, [sandboxFiles, workerIns]);

    useAsyncEffect(async () => {
      if (rawHtml && workerReg.current) {
        const worker = workerReg.current;

        if (!worker || worker.state !== 'activated') {
          return;
        }

        const id = generateID(16);

        worker.postMessage({
          type: SandboxSWEventType.REGISTER_REFERRER,
          data: {
            id: id,
            referrer: {
              base: `${location.origin}/sandbox/preview.html`,
              root: `${location.origin}/sandbox/`,
            },
          },
        });

        worker.postMessage({
          type: SandboxSWEventType.REGISTER_HTML,
          data: {
            id: id,
            html: rawHtml,
          },
        });

        setId(id);
      }
    }, [rawHtml, workerIns]);

    useEffect(() => {
      if (iframeRef.current && id !== '0' && showIframe === true) {
        let previewUrl = `${location.origin}/sandbox/preview.html?id=${id}&seed=${hash}`;
        const isOrdinals = hash && hash.includes('i0');
        if (isOrdinals) {
          previewUrl = `${location.origin}/sandbox/preview.html/${id}/${hash}`;
        }
        iframeRef.current.src = previewUrl;
      }
    }, [id, hash, showIframe]);

    return (
      <div className={cs(s.sandboxPreview, className)}>
        {showIframe && (
          <iframe
            ref={iframeRef}
            sandbox="allow-scripts allow-pointer-lock"
            className={s.iframeContainer}
            onLoad={onLoaded}
            style={{ overflow: 'hidden' }}
          />
        )}
      </div>
    );
  }
);

export default SandboxPreview;
SandboxPreview.displayName = 'SandboxPreview';
