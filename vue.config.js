const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  devServer: {
    allowedHosts: "all",
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: false,
      },
    },
  },
  
  pluginOptions: {
    vuetify: {},
  },
  
  // ✅ ADD NODE.JS POLYFILLS
  configureWebpack: {
    resolve: {
      fallback: {
        "url": require.resolve("url/"),
        "util": require.resolve("util/"),
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer/"),
        "process": require.resolve("process/browser"),
      }
    },
    plugins: [
      new (require("webpack")).ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  }
});