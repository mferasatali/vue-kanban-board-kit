import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueKanbanBoardKit',
      formats: ['es', 'cjs'],
      fileName: (format) =>
        format === 'es' ? 'vue-kanban-board-kit.js' : 'vue-kanban-board-kit.cjs',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: 'vue-kanban-board-kit.[ext]',
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
