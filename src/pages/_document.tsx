import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import { getCssText, globalStyles } from '@styled';

const Document = () => {
  globalStyles()
  return (
    <Html lang="en">
      <Head>
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