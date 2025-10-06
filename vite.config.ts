import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import * as path from 'node:path'
import { dependencies } from './package.json'
import { imagetools } from 'vite-imagetools'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import obfuscator from 'vite-plugin-bundle-obfuscator'

function renderChunks(deps: Record<string, string>) {
  const chunks: Record<string, string[]> = {}
  Object.keys(deps).forEach(key => {
    if (['react', 'react-dom'].includes(key)) return
    chunks[key] = [key]
  })
  return chunks
}

// https://vite.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  plugins: [
    react(),
    imagetools(),
    ViteImageOptimizer(),
    obfuscator({
      options: {
        sourceMap: process.env.NODE_ENV !== 'production',
        stringArray: false,
        optionsPreset: 'low-obfuscation',
      },
    }),
    visualizer({ open: true, sourcemap: true, filename: 'bundle_report.html' }),
  ],
  build: {
    minify: 'esbuild',
    cssMinify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ...renderChunks(dependencies),
        },
      },
    },
  },
  resolve: {
    alias: [{ find: '@src', replacement: path.resolve(__dirname, 'src') }],
  },
})
