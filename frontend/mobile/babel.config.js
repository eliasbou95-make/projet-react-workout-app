module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Reanimated v4 : doit être le DERNIER plugin de la liste
    plugins: ['react-native-worklets/plugin'],
  };
};
