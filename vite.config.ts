import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Config for the local demo app in `src/demo` (npm run dev).
// `dist/` belongs to the library build, so the demo builds elsewhere.
export default defineConfig({
    plugins: [react()],
    build: { outDir: 'demo-dist' },
})
