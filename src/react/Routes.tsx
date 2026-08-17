import {
    Children,
    Fragment,
    isValidElement,
    type ReactElement,
    type ReactNode,
    useMemo,
} from 'react'
import { rankMatches } from '../core/matcher'
import { RouteContext } from './context'
import { useRouteContext, useRouterContext } from './hooks'
import { buildRouteContext, Route, type RouteProps } from './Route'

export interface RoutesProps {
    /** `<Route>` elements. Fragments and arrays are flattened. */
    children: ReactNode
    /** Rendered when nothing matches. Equivalent to `<Route path="*">`. */
    fallback?: ReactNode
}

function flatten(children: ReactNode, out: RouteProps[] = []): RouteProps[] {
    Children.forEach(children, child => {
        if (!isValidElement(child)) return

        if (child.type === Fragment) {
            flatten((child.props as { children?: ReactNode }).children, out)
            return
        }

        if (child.type === Route) {
            out.push((child as ReactElement<RouteProps>).props)
            return
        }

        if (process.env.NODE_ENV !== 'production') {
            console.warn(
                '[tiger-router] <Routes> only accepts <Route> children. Ignoring:',
                child.type
            )
        }
    })

    return out
}

/**
 * Renders exactly one route: the most specific match wins, so declaration
 * order does not matter. `/users/new` beats `/users/:id`, and both beat `*`.
 *
 * ```tsx
 * <Routes fallback={<NotFound />}>
 *   <Route path="/" element={<Home />} />
 *   <Route path="/users/:id" element={<User />} />
 * </Routes>
 * ```
 */
export function Routes({ children, fallback = null }: RoutesProps) {
    const { location } = useRouterContext()
    const parent = useRouteContext()
    const target = parent.pattern === null ? location.pathname : parent.rest

    const routes = useMemo(() => flatten(children), [children])

    const winner = useMemo(
        () =>
            rankMatches(
                routes.map(route => route.path),
                target
            ),
        [routes, target]
    )

    const value = useMemo(
        () => (winner ? buildRouteContext(parent, winner.match) : null),
        [winner, parent]
    )

    const route = winner ? routes[winner.index] : undefined

    if (!route || !value) return <>{fallback}</>

    return (
        <RouteContext.Provider value={value}>
            {route.element ?? route.children}
        </RouteContext.Provider>
    )
}
