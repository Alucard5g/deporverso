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
      hmr: false,
      ws: false,
      watch: null,
    },
    build: {
      target: 'es2022',
      sourcemap: false,
      minify: 'esbuild',
      cssMinify: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          compact: true,
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) return 'v-r';
              if (id.includes('lucide-react')) return 'v-ic';
              if (id.includes('firebase')) return 'v-fb';
              if (id.includes('@google/genai')) return 'v-ai';
              return 'v-vnd';
            }
          }
        }
      }
    },
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none',
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    }
  };
});
