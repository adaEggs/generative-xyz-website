import ButtonIcon from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { IApikey } from '@interfaces/api/profile';
import copy from 'copy-to-clipboard';
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
            <div>
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
            </div>
          ) : (
            <div>
              <ButtonIcon
                onClick={onClickGenerate}
                className={s.submit_btn}
                disabled={!token}
              >
                Generate api key
              </ButtonIcon>
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
