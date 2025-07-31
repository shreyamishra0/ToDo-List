/// <reference types="vite/client" />
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vitest from 'vitest'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        css: true,
        setupFiles: './src/test/vitest.setup.ts',
    }
})