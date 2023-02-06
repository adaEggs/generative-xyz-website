import s from './styles.module.scss';
import ClientOnly from '@components/Utils/ClientOnly';
import { LOGO_JPG } from '@constants/common';
import Image from 'next/image';

const GenerativeLogo = ({
  theme,
}: {
  theme: 'dark' | 'light';
}): JSX.Element => {
  return (
    <div className={s.generativeLogoWrap}>
      <ClientOnly>
        <Image
          className={s.header_logo}
          src={LOGO_JPG[theme]}
          alt="LOGO_GENERATIVE"
          width={64}
          height={64}
        />
        <div className={s.generativeLogoWrap_iframe}>
          <iframe className={s.generativeLogo} src={'/logo/index.html'} />
        </div>
      </ClientOnly>
    </div>
  );
};

export default GenerativeLogo;
