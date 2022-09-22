import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import { getCssText, getGlobalCss } from '@styled';

const Document = () => {
  return (
    <Html lang="en">
      <Head>
        <link rel="preload" as="font" href="/assets/fonts/Roboto/Roboto.woff2" type="font/woff2" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{ __html: getGlobalCss() }} />
        <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;