import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio
      hmr: false as const,
      ws: false as const,
      watch: null,
    },
    build: {
      target: 'es2022',
      sourcemap: false,
      minify: 'esbuild' as const,
      cssMinify: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 3000,
    },
    esbuild: {
      legalComments: 'none' as const,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    }
  };
});
