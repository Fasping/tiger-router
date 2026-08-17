import { type ReactNode, useMemo } from 'react'
import { joinPaths } from '../core/location'
import { matchRoute, type RouteMatch } from '../core/matcher'
import { RouteContext, type RouteContextValue } from './context'
import { useRouteContext, useRouterContext } from './hooks'

export interface RouteProps {
    /**
     * Pattern to match. Supports `:param`, optional `:param?` and a trailing
     * `*` splat, which also enables nested routes below this one.
     */
    path: string
    /** Element to render on match. */
    element?: ReactNode
    /** Alternative to `element`. */
    children?: ReactNode
}

/** @internal Builds the context a matched route exposes to its subtree. */
export function buildRouteContext(
    parent: RouteContextValue,
    match: RouteMatch
): RouteContextValue {
    return {
        params: { ...parent.params, ...match.params },
        base: joinPaths(parent.base, match.pathname),
        rest: match.rest,
        pattern: match.pattern,
    }
}

/**
 * Renders its `element` when the path matches.
 *
 * Inside `<Routes>` only the best match renders. Used on its own, every
 * matching `<Route>` renders — handy for persistent UI like a sidebar.
 */
export function Route({ path, element, children }: RouteProps) {
    const { location } = useRouterContext()
    const parent = useRouteContext()

    // At the top level we match the full pathname; nested routes only see
    // whatever their parent's splat left unconsumed.
    const target = parent.pattern === null ? location.pathname : parent.rest

    const match = useMemo(() => matchRoute(path, target), [path, target])

    const value = useMemo(
        () => (match ? buildRouteContext(parent, match) : null),
        [match, parent]
    )

    if (!value) return null

    return (
        <RouteContext.Provider value={value}>{element ?? children}</RouteContext.Provider>
    )
}
