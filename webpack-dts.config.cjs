const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const { WebpackPnpExternals } = require('webpack-pnp-externals');

const webpackConfig = require('./webpack.util.cjs');

module.exports = function (options, webpack) {
  const bundleFilename = 'dts-server.cjs';
  return webpackConfig({
    ...options,
    bundleFilename,
    cwd: __dirname,
    entry: ['./src/common/swagger/dts-generator.swagger.ts'],
    externals: [WebpackPnpExternals()],
    plugins: [...options.plugins, new RunScriptWebpackPlugin({ name: bundleFilename })],
    production: false,
  });
};
