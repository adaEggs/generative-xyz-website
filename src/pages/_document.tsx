import { APP_ENV } from '@constants/config';
import { ApplicationEnvironment } from '@enums/config';
import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import React from 'react';

export default function Document() {
  return (
    <Html>
      <Head>
        {(APP_ENV === ApplicationEnvironment.STAGING ||
          APP_ENV === ApplicationEnvironment.PRODUCTION) && (
          <Script
            type="text/javascript"
            src="//script.crazyegg.com/pages/scripts/0100/2427.js"
            strategy="beforeInteractive"
          />
        )}
      </Head>
      <body>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
        history.scrollRestoration = "manual"
        `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
