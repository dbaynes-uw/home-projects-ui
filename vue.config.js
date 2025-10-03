const { defineConfig } = require("@vue/cli-service");
const webpack = require('webpack')

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
    ],
    // ✅ REMOVE PROBLEMATIC ALIAS
    // resolve: {
    //   alias: {
    //     'vuetify/lib': 'vuetify/lib/index.js'  ← This breaks Vuetify 3
    //   }
    // },
    
    // ✅ WEBPACK OPTIMIZATION (Vue CLI way)
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
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
          },
          fontawesome: {
            test: /[\\/]node_modules[\\/]@fortawesome[\\/]/,
            name: 'fontawesome',
            chunks: 'all',
            priority: 25
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