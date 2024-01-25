![Nextjs国际化最佳实践.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/660a1a379619435f994e19b31b3c026e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1836&h=1224&s=2556790&e=png&b=dcbde9)
Next.js 作为非常好的前端+服务端框架深受独立开发者们的喜欢，如果搭配上国际化对 SEO 有事半功倍的效果。在这篇文章中我将结合自己的亲身实践，与你分享如何丝滑的接入国际化，让你的网站轻松收割多语言流量。文章内容环环相扣，最后我会给出项目用到的所有代码。

话不多说马上开始

# 页面结构布局

首先给出项目的整体布局，是标准的 Next.js 项目布局，可以看到 pages 下面`[locale]`用到了动态路由。
有个初步印象就可以，后面我会详细讲解如何一步一步实现国际化

```
next-i18n-demo
├── README.md
├── components
│   ├── Footer.js
│   ├── Header.js
│   ├── LanguageSwitchLink.js
│   └── Link.js
├── lib
│   ├── getStatic.js
│   ├── languageDetector.js
│   └── redirect.js
├── next-i18next.config.js
├── next.config.js
├── package.json
├── pages
│   ├── 404.js
│   ├── [locale]
│   │   ├── 404.js
│   │   ├── index.js
│   │   └── second-page.js
│   ├── _app.js
│   ├── _document.js
│   ├── index.js
│   └── second-page.js
├── pnpm-lock.yaml
├── public
│   ├── app.css
│   └── locales
│       ├── cn
│       │   ├── 404.json
│       │   ├── common.json
│       │   ├── footer.json
│       │   └── second-page.json
│       ├── en
│       │   ├── 404.json
│       │   ├── common.json
│       │   ├── footer.json
│       │   └── second-page.json
│       └── it
│           ├── 404.json
│           ├── common.json
│           ├── footer.json
│           └── second-page.json
└── tree.md

```

# 依赖准备

```bash
  "dependencies": {
    "next": "14.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "i18next": "23.7.8",
    "next-i18next": "^15.1.1",
    "next-language-detector": "^1.1.0",
    "react-i18next": "^13.5.0"
  }
```

```
npm install i18next next-i18next next-language-detector react-i18next
```

或者

```
pnpm install i18next next-i18next next-language-detector react-i18next
```

# 实现方式详解

从安装包可以看到除了 next 和 react 需要的依赖我们还用到了`i18next` `next-i18next` `next-language-detector` `react-i18next`四个包，他们都是为了更好的实现国际化这个功能来服务的。
接下来我们看下如何使用它们

## 1. 文件配置 next-i18next.config.js

首先在项目根目录新建`next-i18next.config.js`，他是我们做国际化的基础配置

```
module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'cn'],
  },
}
```

这里是开发模式开启 debug，一共三种语言，默认英文，没什么太多注意事项

## 2. 文件改造

下面详细介绍具体的文件改造，内容较多大家按照操作一步一步进行，一次搞定

### pages/\_app.js

从`next-i18next`引入 appWithTranslation 并且用它包裹 App:

```js
import { appWithTranslation } from "next-i18next";

const MyApp = ({ Component, pageProps }) => <Component {...pageProps} />;

export default appWithTranslation(MyApp);
```

### pages/\_document.js

引入刚刚新建的`next-i18next.config.js`，并且使用它的默认配置`i18nextConfig.i18n.defaultLocale`
像这样：

```js
import i18nextConfig from "@/next-i18next.config";
// 其他代码

class MyDocument extends Document {
  render() {
    const currentLocale =
      this.props.__NEXT_DATA__.query.locale || i18nextConfig.i18n.defaultLocale;
    return <Html lang={currentLocale}>//其他代码</Html>;
  }
}
```

### pages/index.js

项目的首页直接引用[locale]里面的 index：

```js
import Homepage, { getStaticProps } from "./[locale]/index";
export default Homepage;
export { getStaticProps };
```

注意，这里需要用到 `getStaticProps`，它是 Nextjs 自带方法，在服务端执行，这里也是直接从文件里取出并使用。

其他页面同理，引入`[locale]`的对应页面即可
从这一步我们可以看到我们项目的核心页面是写在`[locale]`里面的，pages 下面的页面做一层转发

### lib/getStatic.js

完整代码:

```js
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18nextConfig from "@/next-i18next.config";

export const getI18nPaths = () =>
  i18nextConfig.i18n.locales.map((lng) => ({
    params: {
      locale: lng,
    },
  }));

export const getStaticPaths = () => ({
  fallback: false,
  paths: getI18nPaths(),
});

export const getI18nProps = async (ctx, ns = ["common"]) => {
  const locale = ctx?.params?.locale || i18nextConfig.i18n.defaultLocale;
  let props = {
    ...(await serverSideTranslations(locale, ns)),
  };
  return props;
};

export const makeStaticProps =
  (ns = []) =>
  async (ctx) => ({
    props: await getI18nProps(ctx, ns),
  });
```

这里具体是四个函数：
`getStaticPaths` - `getI18nPaths` 和 `makeStaticProps` - `getI18nProps`,
这四个函数是两两对应的
`getStaticPaths`是 Nextjs 动态路由非常重要的函数，它返回 `fallback` 和 `paths` 两个参数，分别控制是否加载除 `paths` 以外的其他路由和默认路由，这里 `paths` 使用`getI18nPaths`的返回值，也就是 `i18nextConfig` 的配置文件中的 `locales` ，所以后面我们新增任何语言时首先要加在 `locales`中 ，否则会 404

`makeStaticProps`同样是个工具函数，它通过调用`getI18nProps`返回 `props` ，而`getI18nProps`通过`serverSideTranslations`动态加载服务端配置好的翻译文件，是配合 Nextjs 服务端生成/服务端渲染的函数

### pages/[locale]/index.js

```js
import { useTranslation } from "next-i18next";
import { getStaticPaths, makeStaticProps } from "@/lib/getStatic";
import Link from "@/components/Link";
//其他代码
const getStaticProps = makeStaticProps(["common", "footer"]);
export { getStaticPaths, getStaticProps };
```

这里用到上面讲到的两个工具函数 `getStaticPaths`和 `makeStaticProp`,
`getStaticPaths` 好说，直接导出即可，这是 Nextjs 的标准用法，而`makeStaticProps` 需要加载翻译文件，这里`common`和 `footer`对应我们预先设置好的翻译文件，在页面中需要用到的翻译文件都需要先在这里引用。

然后在组件中通过 `useTranslation` 引入翻译文件并使用它：

```js
export default function Homepage() {
  const { t } = useTranslation(["common", "footer"]);
  return (
    <div>
      <h1>{t("demo")}</h1>
      <Link href="/about">{t("about")}</Link>
    </div>
  );
}
```

翻译文字的配置文件是个 json，这里`demo`和`about`对应键名，是给开发者用的，键值需要在对应语言的配置文件里配置好。

### components/Link

在配置翻译文件之前着重讲下 Link，这里是将原有的`next/link`封装一层，目的是在使用`next/link`跳转时能直接带上语言，做到点击跳转`/about`时自动转换为跳到`/en/about`

```js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const LinkComponent = ({ children, skipLocaleHandling, ...rest }) => {
  const router = useRouter();
  const locale = rest.locale || router.query.locale || "";

  let href = rest.href || router.asPath;
  if (href.indexOf("http") === 0) skipLocaleHandling = true;
  if (locale && !skipLocaleHandling) {
    href = href
      ? `/${locale}${href}`
      : router.pathname.replace("[locale]", locale);
  }

  return (
    <>
      <Link href={href} legacyBehavior>
        <a {...rest}>{children}</a>
      </Link>
    </>
  );
};

export default LinkComponent;
```

### public/locales

重点来了，这里放置对应语言的配置文件，上面提到的`common`和`footer`在这里配置

在`public/locales`建立 en 文件夹，这是我们的默认语言（和`next-i18next.config.js`的`defaultLocale`对应）

在 en 下建立`commno.json`和`footer.json`，里面分别放置通用翻译和底部组件翻译。当然这是为了方便模块区分，实际使用中大家可以按照模块区分，也可以按照自己习惯的方式管理。和团队约定好就行了。

如果只讲到这里你一定有疑问，我的网站想支持十几种语言那我还要一种一种语言翻译这也太麻烦了吧？我的项目已经跑起来了还要再一个一个改吗？别着急，接下来介绍一个利器帮你快速搞定多语言配置+自动翻译页面中原有文字

# 效率工具 i18n Ally

这是一个编辑器插件，可以直接在 VS Code 插件市场里安装使用。它可以自动检测未翻译的文字并且自动翻译和生成翻译文件，并且可以检测不同语种待翻译内容并且自动补充。

安装好之后打开任意一个页面，再点开ally插件----当前文件----hard-coded strings，在项目的文字处悬停有`Possible Hard string`提示，按照指示一步一步添加，就会将翻译后的文字添加到对应的翻译文件里。

之后点开插件，在翻译进度里就会看到 en 比其他文件多了，并且有各个语言的翻译进度。这里点开非 100%进度的语言，再点击地球图标。系统就自动帮你将翻译后的文字添加到对应语言里。

是不是用起来很方便？别急，如果你直接这样操作那么大概率会崩溃，因为使用 ally 一步一步帮你生成翻译文件并且展示成`{t('demo')}`时，大概率会碰到生成键名为`common.demo`而不是`demo`的情况，而一旦生成`common.demo`我们正常使用`{t('common.demo')}`，它又进一步提示找不到 `common.demo` 需要新增`common.common.demo`，也就是说它会自动加一个我们的配置文件名。这里我卡住了很久，各种 Google 和问 GPT 未果的情况下最终在 i18n ally 仓库的 issue 区看到解决办法，需要配置一下 ally，最终的配置文件如下：

```json
{
  //其他配置
  "i18n-ally.localesPaths": ["public/locales"],
  "i18n-ally.enabledFrameworks": ["react-i18next"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.namespace": true,
  "i18n-ally.extract.autoDetect": true
}
```

配置文件的打开方式为：command + shift + p，搜索 json--打开工作区设置。
## 添加其他语言
如果我们想新增其他语言，例如意大利语，仅需这三步：
1. 在`next-i18next.config.js`的`locales`中添加`it`
2. 新建文件夹`public--locales--it`并新建文件`common.json`
3. 点击插件，找到it，点击地球图标，稍等片刻就会自动帮我们把文件生成好


这样你就可以无缝使用翻译插件了，用它来管理翻译不论是新增翻译语言还是翻译原有项目都特别方便

现在你已经搞定 Nextjs 语言国际化了，搜索引擎收录链接时可以非常方便的收录各种语言的内容，进而为网站带来更多流量，祝各位成功。

参考内容：
https://juejin.cn/post/7238619890993758263
https://github.com/lokalise/i18n-ally/pull/941
https://github.com/i18next/next-i18next/tree/master/examples/ssg
