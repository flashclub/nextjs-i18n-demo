import Head from 'next/head'

export const Header = ({ heading, title }) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <h2>
      next-language-detector example
      <hr />
    </h2>
    <h1>{heading}</h1>
    <a
      className="github"
      href="//github.com/flashclub/nextjs-i18n-demo"
    >
      <i className="typcn typcn-social-github-circular" />
    </a>
  </>
)
