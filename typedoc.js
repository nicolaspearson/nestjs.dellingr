module.exports = {
  cleanOutputDir: true,
  entryPoints: ['src'],
  entryPointStrategy: 'Expand',
  exclude: ['src/common/**/*.ts', 'src/db/**/*.ts', 'src/**/*.module.ts'],
  excludeExternals: true,
  excludePrivate: true,
  excludeProtected: true,
  name: 'Dellingr',
  out: 'docs',
  tsconfig: 'tsconfig.json',
};
