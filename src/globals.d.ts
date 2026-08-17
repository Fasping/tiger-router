/**
 * Minimal shim so dev-only warnings can be guarded with `process.env.NODE_ENV`
 * (the expression every bundler statically replaces) without pulling in
 * `@types/node` as a dependency of this library.
 */
declare const process: { env: { NODE_ENV?: string } }
