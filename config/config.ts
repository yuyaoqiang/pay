import { IConfig } from 'umi-types';
import pageRoutes from './router.config';
import px2viewport from 'postcss-px2viewport';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  routes: pageRoutes,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
          webpackChunkName: true,
          level: 3,
        },
        title: '支付系统',
        dll: true,
        hd: true,
        locale: {
          enable: true,
          default: 'en-US',
        },
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  extraBabelPlugins: [
    ["import", { libraryName: "antd-mobile", style: true }] //按需加载antd-mobile样式文件
  ],
  // extraPostCSSPlugins: [px2viewport({viewportWidth: 750})],
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  history: 'hash', // 默认是 browser
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  outputPath: './dist',
  hash: true,
  manifest: {
    basePath: '/',
  },

  alias: {},
  proxy: {
    '/test': {
      target: 'https://hfbf886688.hfzfbsm57886.diytx.com/',
      changeOrigin: true,
      pathRewrite: { '^/test': '' },
    },
  },
};

export default config;
