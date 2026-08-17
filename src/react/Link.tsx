import {
    type AnchorHTMLAttributes,
    forwardRef,
    type MouseEvent,
    useCallback,
} from 'react'
import { joinPaths, parsePath, resolvePath, stripTrailingSlash } from '../core/location'
import { useRouteContext, useRouterContext } from './hooks'

const EXTERNAL = /^(?:[a-z+]+:)?\/\/|^(?:mailto|tel|sms):/i

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    /** Target path. Relative values (`edit`) resolve against the current route. */
    to: string
    /** Replace the current history entry instead of pushing a new one. */
    replace?: boolean
    /** Value readable later through `useLocation().state`. */
    state?: unknown
}

/** @internal Turns an app path into the `href` a real anchor should expose. */
export function formatHref(target: string, mode: string, routerBase: string): string {
    if (mode === 'hash') return `#${target}`
    const base = stripTrailingSlash(routerBase)
    if (base === '/' || base === '') return target
    const { pathname, search, hash } = parsePath(target)
    return joinPaths(base, pathname) + search + hash
}

/** @internal Shared click handling for `<Link>` and `<NavLink>`. */
export function useLinkClickHandler({
    to,
    replace,
    state,
    target,
    onClick,
    download,
}: Pick<LinkProps, 'to' | 'replace' | 'state' | 'target' | 'onClick' | 'download'>) {
    const { history } = useRouterContext()
    const { base } = useRouteContext()

    return useCallback(
        (event: MouseEvent<HTMLAnchorElement>) => {
            // The consumer's handler runs first and may cancel navigation.
            onClick?.(event)

            const isPlainClick =
                event.button === 0 &&
                !event.metaKey &&
                !event.altKey &&
                !event.ctrlKey &&
                !event.shiftKey

            const opensHere = !target || target === '_self'

            if (
                event.defaultPrevented ||
                !isPlainClick ||
                !opensHere ||
                download !== undefined ||
                EXTERNAL.test(to)
            ) {
                return
            }

            event.preventDefault()
            const path = resolvePath(to, base)
            if (replace) history.replace(path, { state })
            else history.push(path, { state })
        },
        [to, replace, state, target, onClick, download, history, base]
    )
}

/**
 * An accessible `<a>` that navigates without reloading the page.
 * Renders a real `href`, so middle-click and "open in new tab" keep working.
 *
 * ```tsx
 * <Link to="/about">About</Link>
 * ```
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
    { to, replace, state, onClick, ...rest },
    ref
) {
    const { history, base: routerBase } = useRouterContext()
    const { base } = useRouteContext()
    const handleClick = useLinkClickHandler({
        to,
        replace,
        state,
        target: rest.target,
        onClick,
        download: rest.download,
    })

    const href = EXTERNAL.test(to)
        ? to
        : formatHref(resolvePath(to, base), history.mode, routerBase)

    return <a {...rest} ref={ref} href={href} onClick={handleClick} />
})
