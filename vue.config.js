const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    port: 8086,
    proxy:{
      '/pat':{
        target:"http://localhost:8089/pat",
        changeOrigin:true,
        pathRewrite:{
          '^/pat':''
        }
      }
    }
  }
})
