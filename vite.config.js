import { defineConfig } from 'vite';
export default defineConfig({ base: './', build: { chunkSizeWarningLimit: 800, rollupOptions: { output: { manualChunks(id) { if (id.includes('node_modules/three')) return 'three'; if (id.endsWith('/engine.js') || id.endsWith('/content.js')) return 'simulation'; } } } }, server: { host: '127.0.0.1' } });
