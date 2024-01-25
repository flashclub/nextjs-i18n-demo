import {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document'
import i18nextConfig from '@/next-i18next.config'
import { useTranslation } from 'next-i18next'

export default function Document(props) {
  const { t } = useTranslation(['common'])

  const currentLocale =
    props.__NEXT_DATA__.query.locale ||
    i18nextConfig.i18n.defaultLocale
  const meta = {
    url: "https://petmindreader.com",
    image: "https://petmindreader.com/cat.png",
    socialImageURL: "https://petmindreader.com/cat.png",
    title: t('title'),
    description: t('description'),
  };
  return (
    <Html lang={currentLocale}>
      <Head>
        <meta property="og:title" content={meta.title} key="title" />
        <meta property="og:description" content={meta.description} key="description" />

        <meta name="title" content={meta.title} />
        <meta name="description" content={meta.description} />
        <meta name="author" content="https://petmindreader.com" />
        <meta name="keywords" content="Cat, mind reader" />
        <meta name="generator" content="https://petmindreader.com" />

        <meta property="og:type" content='website' />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.url} />
        <meta property="og:image" content={meta.socialImageURL} />

        <meta property="twitter:card" content='summary_large_image' />
        <meta property="twitter:title" content={meta.title} />
        <meta property="twitter:description" content={meta.description} />
        <meta property="twitter:url" content={meta.url} />
        <meta property="twitter:image" content={meta.socialImageURL} />

        <meta name="apple-mobile-web-app-capable" content="yes" />

        <link href="/reset.css" rel="stylesheet" />
        <link href="/app.css" rel="stylesheet" />

        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/typicons/2.0.9/typicons.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,400|Oswald:600"
          rel="stylesheet"
        />
        <link
          data-react-helmet="true"
          rel="icon"
          href="https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%2F-L9iS6Wm2hynS5H9Gj7j%2Favatar.png?generation=1523462254548780&amp;alt=media"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )

}

