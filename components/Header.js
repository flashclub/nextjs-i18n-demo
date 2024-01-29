import Head from 'next/head'
import { SwitchBox } from './SwitchBox'
export const Header = ({ heading, title }) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <SwitchBox />
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
      <span style={{ opacity: 0, position: 'absolute' }}>GitHub</span>
    </a>
  </>
)
