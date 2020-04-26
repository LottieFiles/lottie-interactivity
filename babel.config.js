module.exports = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'entry',
        bugfixes: true,
        corejs: 3,
      },
    ],
  ],

  plugins: ['@babel/plugin-proposal-private-methods', '@babel/plugin-proposal-class-properties'],
};
