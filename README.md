# 🐯 Tiger Router 🐯

[![Licencia ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)
![Versión](https://img.shields.io/npm/v/tiger-router)

[Web](https://www.npmjs.com/package/tiger-router)

## 2025 Update - v2.0.0

Tiger Router is a **minimalist routing library for React**, now fully rewritten in **TypeScript** with complete type definitions. It provides a lightweight, framework-agnostic core with modern React bindings.

Unlike heavyweight alternatives, Tiger Router focuses on simplicity and essential routing features without the bloat.

## Features

- ✅ **TypeScript First** - Full type safety with generated `.d.ts` files
- ✅ **Minimalist Core** - Framework-agnostic history and route matching
- ✅ **Modern React Hooks** - `useLocation`, `useNavigate`, `useParams`, `useRouteMatch`
- ✅ **Tiny Bundle** - Keep your app lightweight
- ✅ **ESM & CJS** - Works with modern and legacy build systems

## Installation

```bash
npm install tiger-router
# or
yarn add tiger-router
# or
pnpm install tiger-router
```

## Quick Start

```typescript
import { Router, Route, Link, useParams } from "tiger-router";

function User() {
  const params = useParams();
  return <div>User ID: {params.id}</div>;
}

export function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users/123">User 123</Link>
      </nav>

      <Route path="/" element={<div>Home</div>} />
      <Route path="/users/:id" element={<User />} />
    </Router>
  );
}
```

## API Reference

### `<Router>`

The main router component that manages navigation state.

**Props:**
- `mode?: 'history' | 'hash'` - Routing mode (default: `'history'`)
- `children: ReactNode` - Child routes and components

### `<Route>`

Renders a component when the path matches.

**Props:**
- `path: string` - URL pattern (supports `:param` syntax)
- `element?: ReactNode` - Component to render on match
- `children?: ReactNode` - Alternative to `element`

### `<Link>`

Navigation component that prevents full page reloads.

**Props:**
- `to: string` - Target path
- `children: ReactNode` - Link content
- All standard `<a>` attributes

### Hooks

#### `useLocation()`
Returns the current location path.

#### `useNavigate()`
Returns a function to programmatically navigate.

#### `useParams()`
Returns route parameters as an object.

#### `useRouteMatch(path: string)`
Returns `true` if the given path matches the current location.

## Philosophy

Tiger Router is intentionally minimal. It doesn't include:
- Data loaders
- Complex nested routing
- Route guards
- Lazy loading utilities

If you need these features, consider React Router. If you want simplicity, Tiger Router is for you. 🐯

## Contributing

Please read [CONTRIBUTING.md](https://github.com/Fasping/tiger-router/blob/main/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Cheers 🍻 !!!
