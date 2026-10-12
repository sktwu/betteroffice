import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const repoRoot = path.resolve(__dirname, '../..')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5174,
    open: true,
    fs: {
      allow: [repoRoot],
    },
  },
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: [
      '@betteroffice/docx',
      '@betteroffice/docx-react',
      '@betteroffice/pptx',
      '@betteroffice/pptx-react',
      '@betteroffice/xlsx',
      '@betteroffice/xlsx-react',
    ],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
  },
})
