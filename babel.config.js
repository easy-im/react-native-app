module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['import', { libraryName: '@ant-design/react-native' }],
    ['@babel/plugin-transform-flow-strip-types'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      'babel-plugin-root-import',
      {
        rootPathSuffix: './src',
        rootPathPrefix: '@/',
      },
    ],
  ],
};
