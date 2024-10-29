const { defineConfig } = require("@vue/cli-service");
const webpack = require('webpack')
module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
    ],
  },
  devServer: {
    // clientLogLevel: 'info',
    //clientLogLevel: [ 'info', 'warn', 'error', 'debug', 'trace', 'silent' ],
    allowedHosts: "all",
    //proxy: "http://localhost:3000/",
    //proxy: "http://davids-macbook-pro.local:3000/",
    client: {
      overlay: {
          errors: true,         // Show critical errors
          warnings: false,      // Suppress warnings
          runtimeErrors: false, // Suppress runtime errors like ResizeObserver errors
      },
  },
  },
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
