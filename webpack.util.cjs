const path = require('path');

module.exports = (options) => {
  const { bundleFilename, cwd, entry, externals, plugins, production } = options;
  return {
    externals,
    entry: entry ? entry : ['./src/main.ts'],
    mode: production ? 'production' : 'development', // Sets the NODE_ENV var too!
    module: {
      rules: [
        {
          test: /.ts$/,
          loader: require.resolve('ts-loader'),
          options: {
            configFile: 'tsconfig.json',
          },
        },
      ],
    },
    optimization: {
      minimize: false,
    },
    output: {
      path: path.join(cwd, 'dist'),
      filename: bundleFilename,
    },
    plugins,
    resolve: {
      extensions: ['.cjs', '.js', '.ts'],
    },
    target: 'node',
  };
};
