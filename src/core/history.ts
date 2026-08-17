import { parsePath, type RouterLocation, stripTrailingSlash } from './location'

export type HistoryMode = 'browser' | 'hash' | 'memory'

export interface NavigateOptions {
    /** Replace the current entry instead of pushing a new one. */
    replace?: boolean
    /** Arbitrary value readable later through `useLocation().state`. */
    state?: unknown
}

export interface RouterHistory {
    readonly mode: HistoryMode
    /** Current immutable location snapshot. Identity is stable between navigations. */
    get: () => RouterLocation
    push: (to: string, options?: NavigateOptions) => void
    replace: (to: string, options?: NavigateOptions) => void
    go: (delta: number) => void
    back: () => void
    forward: () => void
    /** Registers a listener and returns its unsubscribe function. */
    subscribe: (listener: () => void) => () => void
    /** Detaches every browser listener. Called automatically by `<Router>`. */
    destroy: () => void
}

export interface CreateHistoryOptions {
    /** Defaults to `browser` in the DOM and `memory` on the server. */
    mode?: HistoryMode
    /** Path prefix the app is served from, e.g. `/docs`. */
    base?: string
    /** Starting path for `memory` mode (tests, React Native, SSR). */
    initialPath?: string
}

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

/** Instances sharing the real browser URL, kept in sync with each other. */
const liveInstances = new Set<() => void>()

let keySeed = 0
const nextKey = () => `${Date.now().toString(36)}${(keySeed++).toString(36)}`

function createLocation(path: string, state: unknown): RouterLocation {
    return Object.freeze({ ...parsePath(path), state, key: nextKey() })
}

function withoutBase(pathname: string, base: string): string {
    if (base === '/' || !pathname.toLowerCase().startsWith(base.toLowerCase())) {
        return pathname
    }
    return pathname.slice(base.length) || '/'
}

/**
 * Creates the navigation store that powers `<Router>`.
 *
 * It is framework-agnostic on purpose: `get`/`subscribe` are exactly the shape
 * React's `useSyncExternalStore` expects, which is what keeps the router safe
 * under concurrent rendering.
 */
export function createHistory(options: CreateHistoryOptions = {}): RouterHistory {
    const base = stripTrailingSlash(options.base ?? '/')
    const mode: HistoryMode = options.mode ?? (isBrowser ? 'browser' : 'memory')
    const live = isBrowser && mode !== 'memory'

    const readFromUrl = (): string => {
        if (!live) return options.initialPath ?? '/'
        if (mode === 'hash') return window.location.hash.slice(1) || '/'
        return (
            withoutBase(window.location.pathname, base) +
            window.location.search +
            window.location.hash
        )
    }

    let current = createLocation(
        readFromUrl(),
        live ? window.history.state?.usr : undefined
    )
    const listeners = new Set<() => void>()

    const emit = () => {
        for (const listener of listeners) listener()
    }

    const sync = (state?: unknown) => {
        current = createLocation(readFromUrl(), state)
        emit()
    }

    const notifyEveryone = () => {
        for (const notify of liveInstances) notify()
    }

    const navigate = (to: string, replace: boolean, state: unknown) => {
        const next = parsePath(to)
        const nextHref = next.pathname + next.search + next.hash
        const currentHref = current.pathname + current.search + current.hash

        // Avoid stacking identical entries: the back button should stay useful.
        if (!replace && nextHref === currentHref && state === undefined) return

        if (!live) {
            current = createLocation(nextHref, state)
            emit()
            return
        }

        if (mode === 'hash') {
            current = createLocation(nextHref, state)
            const hashHref = `#${nextHref}`
            if (replace) {
                window.history.replaceState({ usr: state }, '', hashHref)
                notifyEveryone()
            } else {
                // Assigning the hash triggers `hashchange`, which syncs everyone.
                window.location.hash = nextHref
            }
            return
        }

        const url = (base === '/' ? '' : base) + nextHref
        window.history[replace ? 'replaceState' : 'pushState']({ usr: state }, '', url)
        current = createLocation(nextHref, state)
        notifyEveryone()
    }

    const onUrlChange = () => sync(live ? window.history.state?.usr : undefined)
    const urlEvent = mode === 'hash' ? 'hashchange' : 'popstate'

    // Listeners are attached on the first subscriber instead of at creation
    // time. Nothing observable happens until React subscribes, so a store
    // discarded by StrictMode's double render can never leak a listener.
    const attach = () => {
        if (!live) return
        window.addEventListener(urlEvent, onUrlChange)
        liveInstances.add(onUrlChange)
        // Catch up with any navigation that happened before we were listening.
        const href = readFromUrl()
        if (href !== current.pathname + current.search + current.hash) {
            current = createLocation(href, window.history.state?.usr)
        }
    }

    const detach = () => {
        if (!live) return
        window.removeEventListener(urlEvent, onUrlChange)
        liveInstances.delete(onUrlChange)
    }

    return {
        mode,
        get: () => current,
        push: (to, opts) => navigate(to, opts?.replace ?? false, opts?.state),
        replace: (to, opts) => navigate(to, true, opts?.state),
        go: delta => {
            if (live) window.history.go(delta)
        },
        back: () => {
            if (live) window.history.back()
        },
        forward: () => {
            if (live) window.history.forward()
        },
        subscribe: listener => {
            if (listeners.size === 0) attach()
            listeners.add(listener)
            return () => {
                listeners.delete(listener)
                if (listeners.size === 0) detach()
            }
        },
        destroy: () => {
            listeners.clear()
            detach()
        },
    }
}
