// babel.config.cjs

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
  ],
  plugins: [
    'transform-import-meta', // transforms import.meta.env to process.env
  ],
};
