import { useEffect } from 'react'
import { resolvePath } from '../core/location'
import { useRouteContext, useRouterContext } from './hooks'

export interface NavigateProps {
    /** Where to go. Relative values resolve against the current route. */
    to: string
    /** Replace the current entry — usually what you want for a redirect. */
    replace?: boolean
    state?: unknown
}

/**
 * Redirects as soon as it renders. Handy as a route element:
 *
 * ```tsx
 * <Route path="/old" element={<Navigate to="/new" replace />} />
 * ```
 */
export function Navigate({ to, replace = true, state }: NavigateProps) {
    const { history } = useRouterContext()
    const { base } = useRouteContext()

    useEffect(() => {
        const target = resolvePath(to, base)
        if (replace) history.replace(target, { state })
        else history.push(target, { state })
    }, [to, base, replace, state, history])

    return null
}
