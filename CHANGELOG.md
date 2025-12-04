# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-12-04

### Added
- **Complete TypeScript migration** - Full type safety with generated `.d.ts` files
- **Framework-agnostic core** - New `src/core/` with history management and route matching
- **Modern React hooks** - `useLocation`, `useNavigate`, `useParams`, `useRouteMatch`
- **ESM and CJS support** - Built with `tsup` for maximum compatibility
- **Comprehensive tests** - Test coverage for core and React bindings

### Changed
- **API modernization** - Updated `Route` component to use `element` prop instead of `Component`
- **Build system** - Migrated from SWC to `tsup` for better TypeScript support
- **Package exports** - Updated to use `dist/` directory with proper type definitions

### Migration Guide
- Update `<Route Component={...} />` to `<Route element={<.../>} />`
- Import hooks from `tiger-router`: `import { useLocation, useNavigate, useParams } from 'tiger-router'`
- TypeScript users now get full type safety out of the box

## [1.0.5] - Previous
- Initial JavaScript version
