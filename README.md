# 🐯 Tiger Router

**Minimalist routing for React. Tiny, typed, zero dependencies.**

[![npm](https://img.shields.io/npm/v/tiger-router)](https://www.npmjs.com/package/tiger-router)
[![bundle size](https://img.shields.io/bundlephobia/minzip/tiger-router)](https://bundlephobia.com/package/tiger-router)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

```bash
npm install tiger-router
```

```tsx
import { Router, Routes, Route, Link } from 'tiger-router'

export default function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </nav>

            <Routes fallback={<h1>404</h1>}>
                <Route path="/" element={<h1>Home</h1>} />
                <Route path="/about" element={<h1>About</h1>} />
            </Routes>
        </Router>
    )
}
```

That's the whole mental model: **`Router`** holds the state, **`Routes`** picks one, **`Route`** describes a page, **`Link`** moves between them.

---

## Why this router

- **~2.6 kB** brotli for a typical app, **zero runtime dependencies**
- **React 18 and 19**, built on `useSyncExternalStore` — safe under concurrent rendering
- **TypeScript first**, with typed params: `useParams<{ id: string }>()`
- **Works in RSC setups** (Next.js App Router) — ships the `'use client'` directive
- **6 components, 6 hooks.** You can read the entire source in ten minutes
- **No config, no route objects, no build step**

Not included on purpose: data loaders, route guards, code-splitting helpers. Those belong to your app (or to [React Router](https://reactrouter.com) / [TanStack Router](https://tanstack.com/router)).

---

## Learn it in five minutes

### 1. URL params

Write `:name` in the path, read it with `useParams`:

```tsx
import { Route, Routes, useParams } from 'tiger-router'

function User() {
    const { id } = useParams<{ id: string }>()
    return <h1>User {id}</h1>
}

<Routes>
    <Route path="/users/:id" element={<User />} />
</Routes>
```

| Pattern           | Matches                        | Params                          |
| ----------------- | ------------------------------ | ------------------------------- |
| `/about`          | `/about`, `/about/`            | `{}`                            |
| `/users/:id`      | `/users/42`                    | `{ id: '42' }`                  |
| `/posts/:page?`   | `/posts`, `/posts/2`           | `{ page: undefined }` or `'2'`  |
| `/files/*`        | `/files/a/b.pdf`               | `{ '*': 'a/b.pdf' }`            |
| `*`               | anything                       | `{ '*': '...' }`                |

Params are URL-decoded for you, and static segments match case-insensitively.

### 2. Order does not matter

`<Routes>` renders the **most specific** match, so you can declare routes in any order:

```tsx
<Routes>
    <Route path="*" element={<NotFound />} />          {/* least specific */}
    <Route path="/users/:id" element={<User />} />
    <Route path="/users/new" element={<NewUser />} />  {/* wins for /users/new */}
</Routes>
```

### 3. Navigating in code

```tsx
import { useNavigate } from 'tiger-router'

function LoginForm() {
    const navigate = useNavigate()

    async function onSubmit() {
        await login()
        navigate('/dashboard', { replace: true }) // no back-button trap
    }
}
```

`navigate(-1)` goes back, `navigate(1)` goes forward.

### 4. The query string as state

```tsx
import { useSearchParams } from 'tiger-router'

function Search() {
    const [params, setParams] = useSearchParams()
    const q = params.get('q') ?? ''

    return (
        <input
            value={q}
            onChange={e => setParams({ q: e.target.value }, { replace: true })}
        />
    )
}
```

Reload the page and the search box is still filled in — the URL was the state all along.

### 5. Active navigation links

```tsx
import { NavLink } from 'tiger-router'

<NavLink to="/about" className={({ isActive }) => (isActive ? 'current' : '')}>
    About
</NavLink>
```

`NavLink` also sets `aria-current="page"`, so screen readers announce the current page. Add `end` to only light up on an exact match.

### 6. Nested routes

End a path with `*` and the child component gets the rest of the URL:

```tsx
function App() {
    return (
        <Routes>
            <Route path="/settings/*" element={<Settings />} />
        </Routes>
    )
}

function Settings() {
    return (
        <>
            <h1>Settings</h1>
            {/* These paths are relative to /settings */}
            <Routes fallback={<Overview />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/billing/:plan" element={<Billing />} />
            </Routes>
        </>
    )
}
```

Inside a nested scope, relative links just work: `<Link to="profile">` from `/settings` goes to `/settings/profile`. Params from parent routes are inherited by children.

---

## Recipes

<details>
<summary><b>404 page</b></summary>

```tsx
<Routes fallback={<NotFound />}>{/* ... */}</Routes>
```

Or, if you prefer it as a route: `<Route path="*" element={<NotFound />} />`.

</details>

<details>
<summary><b>Redirect</b></summary>

```tsx
import { Navigate } from 'tiger-router'

<Route path="/old-pricing" element={<Navigate to="/pricing" />} />
```

</details>

<details>
<summary><b>Protected route</b></summary>

```tsx
function RequireAuth({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const location = useLocation()

    if (!user) return <Navigate to="/login" state={{ from: location.pathname }} />
    return <>{children}</>
}

<Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
```

Read the origin back on the login page with `useLocation().state`.

</details>

<details>
<summary><b>Code splitting with lazy + Suspense</b></summary>

```tsx
const Dashboard = lazy(() => import('./Dashboard'))

<Suspense fallback={<Spinner />}>
    <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
</Suspense>
```

</details>

<details>
<summary><b>Static hosting (GitHub Pages, S3) — hash mode</b></summary>

```tsx
<Router mode="hash">…</Router>
```

URLs become `/#/about`, which needs no server rewrites.

</details>

<details>
<summary><b>App served from a subfolder</b></summary>

```tsx
<Router base="/docs">…</Router>
```

Now `<Link to="/api">` points the browser at `/docs/api`, while `useLocation().pathname` stays `/api`.

</details>

<details>
<summary><b>Testing</b></summary>

`memory` mode keeps the URL out of the browser, so tests never leak state:

```tsx
render(
    <Router mode="memory" initialPath="/users/42">
        <App />
    </Router>
)
```

</details>

<details>
<summary><b>Next.js App Router / React Server Components</b></summary>

The published files carry the `'use client'` directive, so importing Tiger Router from a client component works without extra setup. On the server the router falls back to `memory` mode instead of touching `window`.

</details>

---

## API

### Components

| Component  | Props                                                          |
| ---------- | -------------------------------------------------------------- |
| `Router`   | `mode?: 'browser' \| 'hash' \| 'memory'`, `base?`, `initialPath?`, `history?`, `children` |
| `Routes`   | `children` (`<Route>` elements), `fallback?`                    |
| `Route`    | `path`, `element?`, `children?`                                 |
| `Link`     | `to`, `replace?`, `state?` + every `<a>` attribute              |
| `NavLink`  | `Link` props, plus `end?` and function forms of `className` / `style` / `children` |
| `Navigate` | `to`, `replace?` (defaults to `true`), `state?`                  |

`<Route>` also works on its own, outside `<Routes>` — then every matching route renders, which is handy for persistent UI like a sidebar.

### Hooks

| Hook                   | Returns                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `useLocation()`        | `{ pathname, search, hash, state, key }`                      |
| `useNavigate()`        | `(to, { replace, state }) => void`, or `(delta: number)`       |
| `useParams<T>()`       | Params of this route and its ancestors                        |
| `useSearchParams()`    | `[URLSearchParams, setSearchParams]`                          |
| `useMatch(pattern)`    | The match (with `params`) or `null`                           |
| `useRouter()`          | `{ location, history, basename, routeBase }` — escape hatch    |

### Core (no React)

`createHistory`, `matchRoute`, `rankMatches`, `parsePath`, `joinPaths`, `resolvePath`, `toHref` are exported too, in case you want route matching outside React.

---

## Migrating from v2

```diff
- <Router>
-     <Route path="/" element={<Home />} />
-     <Route path="/users/:id" element={<User />} />
- </Router>
+ <Router>
+     <Routes fallback={<NotFound />}>
+         <Route path="/" element={<Home />} />
+         <Route path="/users/:id" element={<User />} />
+     </Routes>
+ </Router>
```

- Wrap your routes in `<Routes>` to get single-match rendering and a 404
- `mode="history"` is now `mode="browser"`
- `useRouteMatch(path)` is now `useMatch(path)` and returns the match object (or `null`) instead of a boolean
- Everything else keeps working. See [CHANGELOG.md](./CHANGELOG.md) for the full list.

## Local development

```bash
npm install
npm run dev       # demo app on http://localhost:5173
npm test          # unit + render tests
npm run verify    # lint, types, tests, build, package checks, size budget
```

Contributions welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

### Cheers 🍻
