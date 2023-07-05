//const { defineConfig } = require("@vue/cli-service");
module.exports = {
  devServer: {
    // clientLogLevel: 'info',
    //clientLogLevel: [ 'info', 'warn', 'error', 'debug', 'trace', 'silent' ],
    allowedHosts: "all",
    //proxy: "http://localhost:3000/",
    proxy: "http://davids-macbook-pro.local:3000/",
  },
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
};
