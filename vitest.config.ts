import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'happy-dom',
        globals: false,
        setupFiles: ['src/test-setup.ts'],
        include: ['src/**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            include: ['src/core/**', 'src/react/**'],
            thresholds: { lines: 85, functions: 85, branches: 80 },
        },
    },
})
