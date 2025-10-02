const { defineConfig } = require("@vue/cli-service");
const webpack = require('webpack')

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
    ],
    // ✅ WEBPACK OPTIMIZATION (Vue CLI way)
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          vuetify: {
            test: /[\\/]node_modules[\\/]vuetify[\\/]/,
            name: 'vuetify',
            chunks: 'all',
            priority: 20
          },
          charts: {
            test: /[\\/]node_modules[\\/]chart\.js[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 15
          }
        }
      }
    },
    // ✅ PERFORMANCE HINTS
    performance: {
      maxAssetSize: 1000000,  // 1MB
      maxEntrypointSize: 1000000,
      hints: 'warning'
    }
  },
  
  devServer: {
    allowedHosts: "all",
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