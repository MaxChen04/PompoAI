/// <reference types="vite/client" />
/// <reference types="@vitejs/plugin-react" />

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { defineConfig, Manifest } from 'vite'
import react from '@vitejs/plugin-react'
import { crx, ManifestV3Export } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    }),
    crx({ manifest: manifest as ManifestV3Export})
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/extension/background/index.ts'),
        content: resolve(__dirname, 'src/extension/content/index.ts')
      },
      output: {
        entryFileNames: (chunk) => {
          return chunk.name === 'background' || chunk.name === 'content'
            ? `${chunk.name}.js`
            : 'assets/[name].[hash].js';
        }
      }
    }
  }
}); 