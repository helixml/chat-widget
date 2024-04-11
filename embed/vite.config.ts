import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'index.tsx',
      formats: ['iife'],
      name: 'ChatWidget',
      fileName: 'chat-widget'
    },
    target: 'es2015'
  },
})