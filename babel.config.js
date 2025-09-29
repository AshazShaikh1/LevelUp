module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ❌ REMOVE OR COMMENT OUT THIS BLOCK ❌
      // [
      //   "module:react-native-dotenv",
      //   {
      //     "moduleName": "@env",
      //     "path": ".env",
      //     "blocklist": null,
      //     "allowlist": null,
      //     "safe": false,
      //     "allowUndefined": true,
      //     "verbose": false
      //   }
      // ], 
      require.resolve("expo-router/babel") // 👈 This is the required plugin
    ]
  };
};