const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin; // eslint-disable-line no-unused-vars
const DefinePlugin = require("webpack").DefinePlugin;
// const Critters = require('critters-webpack-plugin')

module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    name: "Jonathan's Movies",
    themeColor: "#365ED4",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
  },
  configureWebpack: (config) => {
    let plugins = [
      new DefinePlugin({
        "process.env": {
          BRANCH: JSON.stringify(process.env.BRANCH),
        },
      }),
    ];

    // if (process.env.NODE_ENV === 'production') {
    //   plugins.push(new Critters())
    // }

    if (process.env.ANALYZE) {
      plugins.push(new BundleAnalyzerPlugin());
    }

    return {
      plugins: plugins,
    };
  },
};
