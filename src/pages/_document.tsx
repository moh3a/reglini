import { APP_DESCRIPTION, APP_NAME, APP_URL, LOGO_URL } from "@config/general";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
            integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <meta name="title" content={APP_NAME} />
          <meta name="description" content={APP_DESCRIPTION} />

          {/* Open Graph / Facebook  */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={APP_NAME} />
          <meta property="og:description" content={APP_DESCRIPTION} />
          <meta property="og:url" content={APP_URL} />
          <meta property="og:image" content={LOGO_URL} />

          {/* Twitter */}
          <meta property="twitter:title" content={APP_NAME} />
          <meta property="twitter:description" content={APP_DESCRIPTION} />
          <meta property="twitter:url" content={APP_URL} />
          <meta property="twitter:image" content={LOGO_URL} />
          <meta property="twitter:card" content={LOGO_URL} />
        </Head>
        <body className="bg-white dark:bg-grim text-grim dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
