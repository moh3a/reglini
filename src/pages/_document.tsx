import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_SLOGAN,
  APP_URL,
  LOGO_URL,
} from "~/config/constants";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html
        dir={this.props.locale === "ar" ? "rtl" : "ltr"}
        lang={this.props.locale}
        style={{ scrollBehavior: "smooth" }}
      >
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="alternate" hrefLang="en" href={APP_URL + "/en"} />
          <link rel="alternate" hrefLang="fr" href={APP_URL} />
          <link rel="alternate" hrefLang="ar" href={APP_URL + "/ar"} />
          <meta name="title" content={APP_NAME + " | " + APP_SLOGAN} />
          <meta name="description" content={APP_DESCRIPTION} />

          {/* Open Graph / Facebook  */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={APP_NAME + " | " + APP_SLOGAN} />
          <meta property="og:description" content={APP_DESCRIPTION} />
          <meta property="og:url" content={APP_URL} />
          <meta property="og:image" content={LOGO_URL} />

          {/* Twitter */}
          <meta
            property="twitter:title"
            content={APP_NAME + " | " + APP_SLOGAN}
          />
          <meta property="twitter:description" content={APP_DESCRIPTION} />
          <meta property="twitter:url" content={APP_URL} />
          <meta property="twitter:image" content={LOGO_URL} />
          <meta property="twitter:card" content={LOGO_URL} />

          <meta name="application-name" content="reglini-dz" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="reglini-dz" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#1b1f23" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#1b1f23" />

          <link rel="apple-touch-icon" href="/icon-192x192.png" />
          <link
            rel="apple-touch-icon"
            sizes="192x192"
            href="/icon-192x192.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="256x256"
            href="/icon-256x256.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="512x512"
            href="/icon-512x512.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="256x256"
            href="/icon-256x256.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body className="bg-white dark:bg-grim text-grim dark:text-white">
          <Main />
          <NextScript />
          <script
            id={"fontawesome"}
            dangerouslySetInnerHTML={{
              __html: `</script><link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
                integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              /><script>`,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
