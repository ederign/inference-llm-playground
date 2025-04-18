import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: Infinity,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  server: {
    proxy: {
      // Proxy all requests to the Llama Stack API
      '/api/llama-stack': {
        target: 'http://localhost:8321',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/llama-stack/, ''),
      },
    },
  },
})
