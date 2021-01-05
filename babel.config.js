module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['import', { libraryName: '@ant-design/react-native' }],
    [
      'babel-plugin-root-import',
      {
        rootPathSuffix: './src',
        rootPathPrefix: '@/',
      },
    ],
  ],
};
