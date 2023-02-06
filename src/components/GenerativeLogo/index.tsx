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
        <iframe
          className={s.generativeLogo}
          src={`/logo/index${theme === 'light' ? '-white' : ''}.html`}
        />
      </ClientOnly>
    </div>
  );
};

export default GenerativeLogo;
