import { useCallback, useContext, useMemo } from 'react'
import type { NavigateOptions } from '../core/history'
import { type RouterLocation, resolvePath } from '../core/location'
import { matchRoute, type RouteMatch, type RouteParams } from '../core/matcher'
import {
    EMPTY_ROUTE,
    RouteContext,
    RouterContext,
    type RouterContextValue,
} from './context'

const NO_PROVIDER =
    '[tiger-router] Hooks and components must be rendered inside a <Router>. ' +
    'Wrap your app: <Router><App /></Router>'

/** @internal */
export function useRouterContext(): RouterContextValue {
    const context = useContext(RouterContext)
    if (!context) throw new Error(NO_PROVIDER)
    return context
}

/** @internal */
export function useRouteContext() {
    return useContext(RouteContext) ?? EMPTY_ROUTE
}

/**
 * The current location: `{ pathname, search, hash, state, key }`.
 * The object identity only changes when navigation happens.
 */
export function useLocation(): RouterLocation {
    return useRouterContext().location
}

export interface NavigateFunction {
    (to: string, options?: NavigateOptions): void
    /** Move through history: `-1` goes back, `1` goes forward. */
    (delta: number): void
}

/**
 * Returns a stable function for navigating in code.
 *
 * ```tsx
 * const navigate = useNavigate()
 * navigate('/users/42')
 * navigate('/login', { replace: true })
 * navigate(-1) // back
 * ```
 */
export function useNavigate(): NavigateFunction {
    const { history } = useRouterContext()
    const { base } = useRouteContext()

    return useCallback(
        (to: string | number, options?: NavigateOptions) => {
            if (typeof to === 'number') {
                history.go(to)
                return
            }
            const target = resolvePath(to, base)
            if (options?.replace) history.replace(target, options)
            else history.push(target, options)
        },
        [history, base]
    ) as NavigateFunction
}

/**
 * Params captured by the closest route and its ancestors.
 * Pass a type argument for autocomplete: `useParams<{ id: string }>()`.
 */
export function useParams<T extends RouteParams = RouteParams>(): T {
    return useRouteContext().params as T
}

/**
 * Read and write the query string.
 *
 * ```tsx
 * const [params, setParams] = useSearchParams()
 * params.get('q')
 * setParams({ q: 'tiger' })
 * ```
 */
export function useSearchParams(): [
    URLSearchParams,
    (
        next:
            | URLSearchParams
            | Record<string, string | number | boolean | null | undefined>,
        options?: NavigateOptions
    ) => void,
] {
    const { location, history } = useRouterContext()

    const searchParams = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    )

    const setSearchParams = useCallback(
        (
            next:
                | URLSearchParams
                | Record<string, string | number | boolean | null | undefined>,
            options?: NavigateOptions
        ) => {
            const params =
                next instanceof URLSearchParams
                    ? new URLSearchParams(next)
                    : new URLSearchParams()

            if (!(next instanceof URLSearchParams)) {
                for (const [key, value] of Object.entries(next)) {
                    if (value !== null && value !== undefined)
                        params.set(key, String(value))
                }
            }

            const query = params.toString()
            const target = history.get().pathname + (query ? `?${query}` : '')

            if (options?.replace) history.replace(target, options)
            else history.push(target, options)
        },
        [history]
    )

    return [searchParams, setSearchParams]
}

/**
 * Matches a pattern against the current pathname.
 * Returns the match (with its params) or `null`, so it reads well in a condition.
 *
 * ```tsx
 * const match = useMatch('/users/:id')
 * if (match) console.log(match.params.id)
 * ```
 */
export function useMatch(pattern: string): RouteMatch | null {
    const { location } = useRouterContext()
    const { base } = useRouteContext()
    const target = resolvePath(pattern, base)
    return useMemo(
        () => matchRoute(target, location.pathname),
        [target, location.pathname]
    )
}

/**
 * Escape hatch exposing the raw store, for advanced integrations.
 *
 * The two bases are different things, so they get different names:
 * `basename` is where the whole app is mounted (`<Router base="/docs">`),
 * `routeBase` is the pathname the enclosing route already consumed, which is
 * what relative `<Link to>` resolves against.
 */
export function useRouter() {
    const { location, history, base } = useRouterContext()
    const route = useRouteContext()
    return { location, history, basename: base, routeBase: route.base }
}
