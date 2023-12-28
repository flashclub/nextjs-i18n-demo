中文｜[English](https://github.com/flashclub/nextjs-i18n-demo/blob/main/README_en.md)

# 借助 [next-i18next](https://github.com/i18next/next-i18next) 和 [next-language-detector](https://github.com/i18next/next-language-detector) 静态国际化（i18n）next.js 网站


## 这是什么库？
这是一个简单的示例，说明如何将 [next-i18next](https://github.com/i18next/next-i18next) 与 [Next.js](https://github.com/zeit/next.js) 结合使用来构建完整的静态网站

## 欲了解更多信息...

- **next-i18next**, 请访问 [main README](https://github.com/i18next/next-i18next)
- **Next.js**, 请访问 [website](https://nextjs.org/)

**详细使用指南请看这里 [使用文档](https://github.com/flashclub/nextjs-i18n-demo/blob/main/Nextjs%E5%9B%BD%E9%99%85%E5%8C%96.md).**


## 可选的locize用法（非强制）
在“部署”应用程序之前，您可以运行 [downloadLocales script](https://github.com/i18next/next-language-detector/blob/main/examples/basic/package.json#L15)（或类似脚本），该脚本将使用 [cli](https://github.com/locize/locize-cli) 将翻译从 locize 下载到 next-i18next 正在查找的相应文件夹中（即 ./public/locales）。locize平台[详细用法](https://github.com/locize/react-tutorial#step-1---keep-existing-code-setup-but-synchronize-with-locize)

## 启动项目

fork或者clone后，按照下述步骤启动项目

```sh
npm i
npm run build
npm run start
```

在浏览器中打开 http://localhost:3000

代码参考: [next-i18next](https://github.com/i18next/next-i18next/tree/master/examples/ssg)
