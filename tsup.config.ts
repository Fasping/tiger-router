import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    // Rollup's treeshake pass strips module-level directives, which would drop
    // the "use client" banner below. Consumers still tree-shake this package
    // thanks to `sideEffects: false` in package.json.
    treeshake: false,
    target: 'es2022',
    external: ['react'],
    // Required so the router works inside React Server Component setups
    // (Next.js App Router, etc.) without the consumer adding the directive.
    banner: { js: "'use client';" },
})
