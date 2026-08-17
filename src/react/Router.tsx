import { type ReactNode, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import {
    type CreateHistoryOptions,
    createHistory,
    type HistoryMode,
    type RouterHistory,
} from '../core/history'
import { stripTrailingSlash } from '../core/location'
import { RouterContext } from './context'

export interface RouterProps {
    /**
     * `browser` uses clean URLs (needs a server rewrite), `hash` works on any
     * static host, `memory` keeps the URL in memory — ideal for tests.
     * Defaults to `browser` in the browser and `memory` on the server.
     */
    mode?: HistoryMode
    /** Path prefix the app is served from, e.g. `/docs`. */
    base?: string
    /** Starting path for `memory` mode. */
    initialPath?: string
    /** Bring your own store, e.g. one shared across a monorepo. */
    history?: RouterHistory
    children: ReactNode
}

/**
 * Provides navigation state to everything below it.
 *
 * ```tsx
 * <Router>
 *   <Routes>
 *     <Route path="/" element={<Home />} />
 *   </Routes>
 * </Router>
 * ```
 */
export function Router({
    mode,
    base = '/',
    initialPath,
    history: externalHistory,
    children,
}: RouterProps) {
    const options: CreateHistoryOptions = { mode, base, initialPath }
    const storeRef = useRef<RouterHistory | null>(null)

    if (!storeRef.current) {
        storeRef.current = externalHistory ?? createHistory(options)
    }

    const history = externalHistory ?? storeRef.current

    // Only tear down stores we created ourselves.
    useEffect(() => {
        const owned = !externalHistory ? storeRef.current : null
        return () => owned?.destroy()
    }, [externalHistory])

    const location = useSyncExternalStore(history.subscribe, history.get, history.get)

    const value = useMemo(
        () => ({ location, history, base: stripTrailingSlash(base) }),
        [location, history, base]
    )

    return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}
