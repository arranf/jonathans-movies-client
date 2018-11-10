const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // eslint-disable-line no-unused-vars
const Critters = require('critters-webpack-plugin')

module.exports = {
  pwa: {
    name: 'Jonathans Movies'
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new Critters()
          // ,new BundleAnalyzerPlugin()
        ]
      }
    }
  }
}
