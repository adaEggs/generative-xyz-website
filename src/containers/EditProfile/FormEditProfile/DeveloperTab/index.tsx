import ButtonIcon from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
// import { ROUTE_PATH } from '@constants/route-path';
import { IApikey } from '@interfaces/api/profile';
import copy from 'copy-to-clipboard';
// import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import s from './styles.module.scss';

const siteKey = '6LfM-cckAAAAALcEcvQGz1klpPruM-gvrBJRir1l';

const DeveloperTab = ({
  loading,
  apiKey,
  handleSubmitGenerateApiKey,
}: {
  loading: boolean;
  apiKey?: IApikey;
  handleSubmitGenerateApiKey: (token: string) => void;
}) => {
  // const router = useRouter();

  const [token, setToken] = useState('');

  const onVerify = useCallback((token: string) => {
    setToken(token);
  }, []);

  const onClickCopy = (text: string) => {
    copy(text);
    toast.remove();
    toast.success('Copied');
  };

  const onClickGenerate = () => {
    if (token) {
      handleSubmitGenerateApiKey(token);
    }
  };

  // const onClickDocs = () => {
  //   router.push(
  //     'https://github.com/generative-xyz/generative-xyz-website/actions'
  //   );
  // };

  const handleLoaded = () => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(siteKey, { action: 'homepage' })
        .then((token: string) => {
          onVerify(token);
        });
    });
  };

  useEffect(() => {
    // Add reCaptcha
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.addEventListener('load', handleLoaded);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className={s.container}>
      {!loading && (
        <div>
          {apiKey ? (
            <div className={s.apiKeyContainer}>
              <div className={s.note}>
                <p>
                  Generative Inscription As A Service (IAAS) is an API set for
                  inscribing, tracking inscribing status, and browsing Bitcoin
                  inscriptions.
                </p>
                <p style={{ marginTop: 8 }}>
                  At Generative, we have built an infrastructure for 3rd
                  developers to save engineering time and maintenance effort
                  when working with Bitcoin Ordinals.
                </p>
              </div>
              <p className={s.titleKey}>YOUR API KEY</p>
              <div className={s.apiKey}>
                <p>{apiKey.apiKey}</p>
                <SvgInset
                  className={s.icCopy}
                  size={18}
                  svgUrl={`${CDN_URL}/icons/ic-copy.svg`}
                  onClick={() => onClickCopy(apiKey.apiKey)}
                />
              </div>
              {/* <div className={s.btnContainer}>
                <ButtonIcon
                  variants="outline-small"
                  onClick={onClickDocs}
                  className={s.readDocBtn}
                  startIcon={
                    <SvgInset
                      svgUrl={`${CDN_URL}/icons/ic-document-list.svg`}
                    />
                  }
                >
                  Read the docs
                </ButtonIcon>
              </div> */}
            </div>
          ) : (
            <div className={s.generateContainer}>
              <div className={s.note}>
                <p>
                  Generative Inscription As A Service (IAAS) is an API set for
                  inscribing, tracking inscribing status, and browsing Bitcoin
                  inscriptions.
                </p>
                <p style={{ marginTop: 8 }}>
                  At Generative, we have built an infrastructure for 3rd
                  developers to save engineering time and maintenance effort
                  when working with Bitcoin Ordinals.
                </p>
                <p style={{ marginTop: 8 }}>
                  Start building by generating your API Key.
                </p>
              </div>
              <div className={s.btnContainer}>
                <div />
                {/* <ButtonIcon
                  variants="outline-small"
                  startIcon={
                    <SvgInset
                      svgUrl={`${CDN_URL}/icons/ic-document-list.svg`}
                    />
                  }
                  onClick={onClickDocs}
                >
                  Read the docs
                </ButtonIcon> */}
                <ButtonIcon
                  variants="primary"
                  onClick={onClickGenerate}
                  className={s.generateBtn}
                  disabled={!token}
                >
                  Generate API Key
                </ButtonIcon>
              </div>
            </div>
          )}
        </div>
      )}
      {loading && (
        <div className={s.loadingWrapper}>
          <Loading isLoaded={false} />
        </div>
      )}
    </div>
  );
};

export default React.memo(DeveloperTab);
