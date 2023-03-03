import ButtonIcon from '@components/ButtonIcon';
import { Loading } from '@components/Loading';
import SvgInset from '@components/SvgInset';
import { CDN_URL } from '@constants/config';
import { IApikey } from '@interfaces/api/profile';
import copy from 'copy-to-clipboard';
import React, { useCallback, useState } from 'react';
import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3';
import toast from 'react-hot-toast';
import s from './styles.module.scss';

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

  return (
    <div className={s.container}>
      <GoogleReCaptchaProvider reCaptchaKey="6LfM-cckAAAAALcEcvQGz1klpPruM-gvrBJRir1l">
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
                <div>
                  <GoogleReCaptcha onVerify={onVerify} />
                </div>
                <ButtonIcon
                  onClick={onClickGenerate}
                  className={s.submit_btn}
                  disabled={!token}
                >
                  Generate Api key
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
      </GoogleReCaptchaProvider>
    </div>
  );
};

export default React.memo(DeveloperTab);
