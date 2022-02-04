const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const { WebpackPnpExternals } = require('webpack-pnp-externals');

const webpackConfig = require('./webpack.util.cjs');

module.exports = (options, webpack) => {
  const bundleFilename = 'dev-server.cjs';
  return webpackConfig({
    ...options,
    bundleFilename,
    cwd: __dirname,
    entry: ['webpack/hot/poll?100', './src/main.ts'],
    externals: [
      WebpackPnpExternals({
        exclude: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.cjs$/, /\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({ name: bundleFilename }),
    ],
    production: false,
  });
};
