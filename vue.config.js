const { defineConfig } = require("@vue/cli-service");
const webpack = require('webpack')

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
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      }),
      new (require("webpack")).ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  }
});