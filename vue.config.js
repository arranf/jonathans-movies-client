const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const DefinePlugin = require("webpack").DefinePlugin;

module.exports = {
  transpileDependencies: ["vuetify", "feathers-vuex"],
  pwa: {
    name: "Jonathan's Movies",
    themeColor: "#365ED4",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
  },
  configureWebpack: (_config) => {
    //TODO: Should this all be defined without this logic? Probably!
    let facebookUrl;
    if (process.env.BRANCH && process.env.BRANCH.trim() === "develop") {
      facebookUrl = "https://staging-api.jonathansmovies.com/auth/facebook";
    } else if (process.env.NODE_ENV === "production") {
      facebookUrl = "https://api.jonathansmovies.com/auth/facebook";
    } else {
      facebookUrl = "http://localhost:3030/auth/facebook";
    }

    let apiUrl;
    if (process.env.BRANCH && process.env.BRANCH.trim() === "develop") {
      apiUrl = "https://staging-api.jonathansmovies.com";
    } else if (process.env.NODE_ENV === "production") {
      apiUrl = "https://api.jonathansmovies.com";
    } else {
      apiUrl = "http://localhost:3030";
    }

    let plugins = [
      new DefinePlugin({
        "process.env": {
          FACEBOOK_URL: JSON.stringify(facebookUrl),
          API_URL: JSON.stringify(apiUrl),
        },
      }),
    ];

    if (process.env.ANALYZE) {
      plugins.push(new BundleAnalyzerPlugin());
    }

    return {
      plugins: plugins,
    };
  },
};
