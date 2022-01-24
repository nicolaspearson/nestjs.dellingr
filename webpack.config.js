const { WebpackPnpExternals } = require('webpack-pnp-externals');

const webpackConfig = require('./webpack.util');

module.exports = () => {
  return webpackConfig({
    bundleFilename: 'server.js',
    cwd: __dirname,
    entry: ['./src/main.ts'],
    externals: [WebpackPnpExternals()],
    plugins: [],
    production: true,
  });
};
