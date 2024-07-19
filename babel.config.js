module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      test: {
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
          "babel-preset-expo",
        ],
        plugins: [
          "@babel/plugin-transform-runtime"
        ]
      },
    },
  };
};
