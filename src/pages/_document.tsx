import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { stitchesReset } from 'styles/stitches';

class _Document extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <title>NK Gigs Notification</title>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap"
            rel="stylesheet"
          />
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: stitchesReset() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default _Document;
