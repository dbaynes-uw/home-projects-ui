import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue']

  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    //open: true
    open: process.env.NODE_ENV !== 'production'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  define: {
    // Make process.env available in browser
    'process.env': {}
  },
  optimizeDeps: {
    include: ['uuid']
  }
})