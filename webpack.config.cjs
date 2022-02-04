const { WebpackPnpExternals } = require('webpack-pnp-externals');

const webpackConfig = require('./webpack.util.cjs');

module.exports = () => {
  return webpackConfig({
    bundleFilename: 'server.cjs',
    cwd: __dirname,
    entry: ['./src/main.ts'],
    externals: [WebpackPnpExternals()],
    plugins: [],
    production: true,
  });
};
