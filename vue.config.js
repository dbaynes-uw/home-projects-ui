//const { defineConfig } = require("@vue/cli-service");
module.exports = {
  devServer: {
    allowedHosts: "all",
    proxy: "http://davids-macbook-pro.local:3000/",
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
};
