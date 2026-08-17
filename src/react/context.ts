import { createContext } from 'react'
import type { RouterHistory } from '../core/history'
import type { RouterLocation } from '../core/location'
import type { RouteParams } from '../core/matcher'

export interface RouterContextValue {
    location: RouterLocation
    history: RouterHistory
    base: string
}

export const RouterContext = createContext<RouterContextValue | null>(null)
RouterContext.displayName = 'TigerRouter'

export interface RouteContextValue {
    /** Params captured by this route plus every ancestor route. */
    params: RouteParams
    /** Absolute pathname consumed so far. Relative `<Link to>` resolves against it. */
    base: string
    /** Pathname left for nested `<Routes>` to match. */
    rest: string
    /** Pattern of the matched route, or `null` at the top level. */
    pattern: string | null
}

export const EMPTY_ROUTE: RouteContextValue = {
    params: {},
    base: '/',
    rest: '/',
    pattern: null,
}

export const RouteContext = createContext<RouteContextValue | null>(null)
RouteContext.displayName = 'TigerRoute'
