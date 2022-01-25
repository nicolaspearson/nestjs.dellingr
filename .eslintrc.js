module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:ordered-imports/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  ],
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'import',
    'jest',
    'ordered-imports',
    'promise',
    'unicorn',
  ],
  rules: {
    /**
     * Global rules
     */
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    'object-curly-spacing': [2, 'always'],
    'ordered-imports/ordered-imports': [
      'error',
      {
        'group-ordering': [
          {
            name: 'framework libraries',
            match: '^(@nestjs/|nest-|nestjs-).*',
            order: 20,
          },
          {
            name: 'server source code',
            match: '^[$]\\/.*$',
            order: 30,
          },
          {
            name: 'test source code',
            match: '^#\\/.*$',
            order: 40,
          },
          {
            name: 'relative imports',
            match: '^\\.*/.*$',
            order: 50,
          },
          { name: 'third party', match: '.*', order: 10 },
        ],
      },
    ],
    'max-len': [
      'error',
      {
        code: 100,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        tabWidth: 2,
      },
    ],
    'no-self-assign': 'warn',
    semi: ['error', 'always'],
    'unicorn/filename-case': 'warn',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/no-null': 'warn',
    'unicorn/numeric-separators-style': 'warn',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-array-callback-reference': 'warn',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: {
          args: true,
          req: true,
          Req: true,
          res: true,
          Res: true,
        },
      },
    ],
  },
  overrides: [
    {
      /**
       * JavaScript rules
       */
      files: ['**/*.js'],
      extends: ['eslint:recommended', 'plugin:node/recommended'],
    },
    {
      /**
       * TypeScript rules
       */
      files: ['**/*.ts'],
      extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          modules: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      plugins: ['@typescript-eslint', 'ordered-imports'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
          },
          {
            selector: 'enumMember',
            format: ['PascalCase'],
          },
          {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
          },
        ],
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_+$' }],
        '@typescript-eslint/restrict-template-expressions': ['error', { allowAny: true }],
        'import/no-unresolved': 'off',
      },
    },
    {
      /**
       * Jest rules
       */
      files: ['**/test/**/*.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        'jest/expect-expect': [
          'error',
          {
            assertFunctionNames: ['expect', 'request.*.expect'],
          },
        ],
      },
    },
    {
      /**
       * JavaScript configuration file rules
       */
      files: ['**/*.config.js', '**/.eslintrc.js'],
      rules: {
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'node/no-extraneous-require': 'off',
        'node/no-unpublished-require': 'off',
        'prefer-const': 'off',
        'unicorn/prefer-module': 'off',
      },
    },
  ],
  settings: {
    jest: {
      version: 'latest',
    },
  },
};
