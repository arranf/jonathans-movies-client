const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // eslint-disable-line no-unused-vars
const Critters = require('critters-webpack-plugin')

module.exports = {
  pwa: {
    name: 'Jonathans Movies'
  },
  configureWebpack: config => {
    let plugins = []

    if (process.env.NODE_ENV === 'production') {
      plugins.push(new Critters())
    }

    if (process.env.ANALYZE) {
      plugins.push(new BundleAnalyzerPlugin())
    }

    return {
      plugins: plugins
    }
  }
}
