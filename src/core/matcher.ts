import { stripTrailingSlash } from './location'

/** Route params captured from the URL. A splat (`*`) is stored under `'*'`. */
export type RouteParams = Record<string, string | undefined>

export interface RouteMatch {
    /** Values captured by `:params` and `*`, already URL-decoded. */
    params: RouteParams
    /** The pattern that produced this match. */
    pattern: string
    /** Portion of the pathname consumed by the pattern. */
    pathname: string
    /** Remaining pathname, used to render nested routes. `/` when fully consumed. */
    rest: string
    /** Higher means more specific. Used to rank competing routes. */
    score: number
}

interface CompiledPattern {
    regex: RegExp
    keys: string[]
    score: number
}

const SEGMENT_SCORE = { static: 10, dynamic: 4, optional: 3, splat: 1 } as const

const cache = new Map<string, CompiledPattern>()

function escapeSegment(segment: string): string {
    return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function safeDecode(value: string): string {
    try {
        return decodeURIComponent(value)
    } catch {
        return value
    }
}

/**
 * Turns a route pattern into a regex once and caches it.
 *
 * Supported syntax:
 * - `/users/:id`   -> required param
 * - `/posts/:id?`  -> optional param
 * - `/files/*`     -> splat, matches the rest of the path
 */
function compilePattern(pattern: string): CompiledPattern {
    const cached = cache.get(pattern)
    if (cached) return cached

    const segments = pattern.split('/').filter(Boolean)
    const keys: string[] = []
    let source = ''
    let score = 0
    let isSplat = false

    for (const segment of segments) {
        if (segment === '*' || segment === '**') {
            keys.push('*')
            source += '(?:/(.*))?'
            score += SEGMENT_SCORE.splat
            isSplat = true
            continue
        }

        if (segment.startsWith(':')) {
            const optional = segment.endsWith('?')
            keys.push(segment.slice(1, optional ? -1 : undefined))
            source += optional ? '(?:/([^/]+))?' : '/([^/]+)'
            score += optional ? SEGMENT_SCORE.optional : SEGMENT_SCORE.dynamic
            continue
        }

        source += `/${escapeSegment(segment)}`
        score += SEGMENT_SCORE.static
    }

    // A splat pattern is open-ended; anything else must consume the whole path.
    const regex = new RegExp(`^${source || '/'}${isSplat ? '' : '/?'}$`, 'i')
    const compiled: CompiledPattern = { regex, keys, score }

    cache.set(pattern, compiled)
    return compiled
}

/**
 * Matches a pathname against a route pattern.
 * Returns `null` when the route does not match.
 *
 * ```ts
 * matchRoute('/users/:id', '/users/42')
 * // { params: { id: '42' }, pattern: '/users/:id', pathname: '/users/42', rest: '/', score: 14 }
 * ```
 */
export function matchRoute(pattern: string, pathname: string): RouteMatch | null {
    const { regex, keys, score } = compilePattern(pattern)
    const target = stripTrailingSlash(pathname) || '/'
    const result = regex.exec(target)

    if (!result) return null

    const params: RouteParams = {}
    let rest = '/'

    keys.forEach((key, index) => {
        const value = result[index + 1]
        params[key] = value === undefined ? undefined : safeDecode(value)

        if (key === '*') {
            rest = value ? `/${value}` : '/'
        }
    })

    const matchedLength = result[0].length - (rest === '/' ? 0 : rest.length)

    return {
        params,
        pattern,
        pathname: target.slice(0, matchedLength) || '/',
        rest,
        score,
    }
}

/**
 * Picks the single best pattern for a pathname.
 * More specific routes win, so `/users/new` beats `/users/:id`
 * and both beat `*`, no matter the declaration order.
 */
export function rankMatches(
    patterns: string[],
    pathname: string
): { index: number; match: RouteMatch } | null {
    let best: { index: number; match: RouteMatch } | null = null

    patterns.forEach((pattern, index) => {
        const match = matchRoute(pattern, pathname)
        if (!match) return
        if (!best || match.score > best.match.score) best = { index, match }
    })

    return best
}
