/**
 * A snapshot of where the app currently is.
 *
 * The object is immutable and its identity only changes when navigation
 * actually happens, so it is safe to use as a `useSyncExternalStore`
 * snapshot or inside a dependency array.
 */
export interface RouterLocation {
    /** Path without search or hash, always starting with `/`. */
    readonly pathname: string
    /** Query string including the leading `?`, or `''`. */
    readonly search: string
    /** Fragment including the leading `#`, or `''`. */
    readonly hash: string
    /** Value passed as `state` when navigating. */
    readonly state: unknown
    /** Changes on every navigation. Useful as a React `key`. */
    readonly key: string
}

/** `pathname + search + hash` of a location. */
export function toHref(location: RouterLocation): string {
    return location.pathname + location.search + location.hash
}

/**
 * Splits a raw path (`/a/b?c=1#d`) into its parts.
 * Accepts absolute paths and full URLs; anything falsy becomes `/`.
 */
export function parsePath(
    path: string
): Pick<RouterLocation, 'pathname' | 'search' | 'hash'> {
    let rest = path || '/'
    let hash = ''
    let search = ''

    const hashIndex = rest.indexOf('#')
    if (hashIndex >= 0) {
        hash = rest.slice(hashIndex)
        rest = rest.slice(0, hashIndex)
    }

    const searchIndex = rest.indexOf('?')
    if (searchIndex >= 0) {
        search = rest.slice(searchIndex)
        rest = rest.slice(0, searchIndex)
    }

    return {
        pathname: rest.startsWith('/') ? rest : `/${rest}`,
        search: search === '?' ? '' : search,
        hash: hash === '#' ? '' : hash,
    }
}

/** Joins path segments collapsing duplicated slashes. `join('/a/', '/b')` -> `/a/b` */
export function joinPaths(...parts: Array<string | undefined>): string {
    const joined = parts
        .filter(Boolean)
        .join('/')
        .replace(/\/{2,}/g, '/')
    if (joined === '') return '/'
    return joined.startsWith('/') ? joined : `/${joined}`
}

/** Removes a trailing slash, keeping the root `/` intact. */
export function stripTrailingSlash(pathname: string): string {
    return pathname.length > 1 && pathname.endsWith('/')
        ? pathname.slice(0, -1)
        : pathname
}

/**
 * Resolves a possibly relative target (`about`, `./about`) against a base.
 * Absolute targets (`/about`) are returned untouched.
 */
export function resolvePath(to: string, base = '/'): string {
    if (to.startsWith('/')) return to

    const { pathname, search, hash } = parsePath(to)
    const relative = pathname.replace(/^\//, '').replace(/^\.\//, '')

    return joinPaths(base, relative) + search + hash
}
