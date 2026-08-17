# Changelog

All notable changes to this project are documented here.
This project follows [Semantic Versioning](https://semver.org/).

## [3.0.0] - 2026-08-17

A full rewrite of the internals. The API surface stays small, but the router is
now correct under concurrent rendering, does not leak listeners, and covers the
handful of features every real app needs.

### Added

- **`<Routes>`** — renders a single route. The most specific pattern wins, so
  declaration order no longer matters, and `fallback` gives you a 404 in one prop.
- **Nested routes** — a path ending in `*` hands the rest of the URL to the child
  component, which can declare its own `<Routes>`. Parent params are inherited.
- **`<NavLink>`** — active-aware link with `aria-current="page"`, an `end` prop for
  exact matching and function forms of `className` / `style` / `children`.
- **`<Navigate>`** — declarative redirect, ideal for auth guards.
- **`useSearchParams()`** — read and write the query string as state.
- **`useRouter()`** — escape hatch exposing `{ location, history, basename, routeBase }`.
  `basename` is where the app is mounted (`<Router base>`); `routeBase` is the pathname
  the enclosing route consumed, which is what relative links resolve against.
- **Pattern syntax** — optional params (`:page?`) and splats (`*`) alongside `:param`.
- **`memory` mode** plus `initialPath`, so tests and SSR never touch `window`.
- **`base` option** for apps served from a subfolder (`<Router base="/docs">`).
- **`replace` and `state`** on every navigation API, and `navigate(-1)` for history.
- **`'use client'` directive** in the published bundles, so the router can be
  imported from client components in RSC setups such as the Next.js App Router.
- **React 19 support** — the peer range is now `^18.2.0 || ^19.0.0`, and CI runs the
  suite against both.
- **Real test suite** — 70 tests covering the core and actual React renders,
  including StrictMode, up from 3 tests that only exercised the matcher.
- **Integration test** — `npm run test:integration` packs the library with `npm pack`,
  installs that tarball into `integration-test/` like a real consumer, then typechecks
  and renders against it. It is the only check that exercises the `exports` map, the
  generated `.d.ts` files and the `'use client'` banner through a real resolution path.
- **CI** — lint, typecheck, tests on React 18 and 19, build, `publint`, `attw`, a
  bundle-size budget and the integration test on every push.

### Changed

- **`useLocation()`** now returns `{ pathname, search, hash, state, key }` instead of
  a bare pathname string. `useLocation().pathname` is the direct replacement.
- **`useRouteMatch(path)` → `useMatch(path)`**, returning the match object (with its
  `params`) or `null` instead of a boolean. `if (useMatch('/x'))` still reads the same.
- **`mode="history"` → `mode="browser"`.**
- **Navigation store** rewritten around `useSyncExternalStore`, which removes the
  tearing risk that `useState` + `useEffect` had under concurrent rendering.
- **Context values are memoized**, so navigating no longer re-renders every consumer
  of the router context on unrelated updates.
- **Route matching is compiled to a cached regex** instead of splitting strings on
  every render of every route.
- **Tooling** — Biome replaces ESLint + `standard` + Prettier (three configs became
  one), Vitest 4 with `happy-dom`, Vite 8 for the demo, and `tsup` keeps producing
  ESM + CJS with separate `.d.ts` / `.d.cts`.

### Fixed

- **Params broke on any URL with a query string.** The location included `?query`,
  which the matcher counted as part of the last path segment, so `/users/42?tab=a`
  never matched `/users/:id`.
- **A user-supplied `onClick` on `<Link>` silently disabled navigation**, because the
  prop spread was applied after the internal handler and overwrote it. Both now run,
  and calling `preventDefault()` in your handler cancels the navigation.
- **`createHistory` attached a `popstate` listener that was never removed**, leaking
  one listener per Router instance. Listeners now attach on first subscription and
  detach on unmount, which also makes StrictMode's double render harmless.
- **`createHistory` touched `window` at creation time**, throwing during SSR.
- **Navigation dispatched a synthetic `PopStateEvent`** on the window, which could
  confuse other libraries listening for real history events.
- **`params` was hard-coded to `{}`** in the Router context, so params only ever
  reached a component through a directly nested `<Route>`.
- **Repeated navigation to the current URL** stacked duplicate history entries,
  leaving the back button doing nothing.
- **`<Link>` hijacked clicks it should not have** — modified clicks, `target="_blank"`,
  `download` links and external URLs are now left to the browser.
- **Trailing slashes and percent-encoded params** are handled instead of failing to
  match.
- **The demo was broken**: `index.html` pointed at a `main.jsx` that no longer existed.
- **The package declared `LICENSE` in `files` but shipped no license file**, and pinned
  its React peer dependency to the exact version `18.2.0`, which made installing
  alongside React 19 fail.

### Removed

- The stale `lib/` build output committed to the repository.
- A duplicate `yarn.lock` sitting next to `package-lock.json`.
- The `path-to-regexp` dependency of the v1 build — matching is now ~40 lines.

### Migration guide

```diff
  <Router>
+     <Routes fallback={<NotFound />}>
        <Route path="/" element={<Home />} />
        <Route path="/users/:id" element={<User />} />
+     </Routes>
  </Router>
```

```diff
- <Router mode="history">
+ <Router mode="browser">

- const path = useLocation()
+ const { pathname: path } = useLocation()

- const isActive = useRouteMatch('/about')
+ const isActive = useMatch('/about') !== null
```

`<Route>` used directly inside `<Router>` still works exactly as it did in v2, so you
can migrate one screen at a time.

## [2.0.0] - 2025-12-04

- TypeScript migration, framework-agnostic core, hooks, ESM + CJS output
- `<Route Component={...} />` became `<Route element={<... />} />`

## [1.0.5] - 2023-04-19

- Initial JavaScript version
