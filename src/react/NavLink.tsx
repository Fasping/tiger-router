import { type CSSProperties, forwardRef } from 'react'
import { resolvePath, stripTrailingSlash } from '../core/location'
import { useRouteContext, useRouterContext } from './hooks'
import { Link, type LinkProps } from './Link'

export interface NavLinkRenderProps {
    isActive: boolean
}

export interface NavLinkProps
    extends Omit<LinkProps, 'className' | 'style' | 'children'> {
    /** Only active on an exact match. Off by default, so parents stay active. */
    end?: boolean
    className?: string | ((props: NavLinkRenderProps) => string | undefined)
    style?: CSSProperties | ((props: NavLinkRenderProps) => CSSProperties | undefined)
    children?: React.ReactNode | ((props: NavLinkRenderProps) => React.ReactNode)
}

/**
 * A `<Link>` that knows whether it points at the current page. Sets
 * `aria-current="page"` when active, which screen readers announce.
 *
 * ```tsx
 * <NavLink to="/about" className={({ isActive }) => (isActive ? 'on' : '')}>
 *   About
 * </NavLink>
 * ```
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
    { to, end = false, className, style, children, ...rest },
    ref
) {
    const { location } = useRouterContext()
    const { base } = useRouteContext()

    const target = stripTrailingSlash(
        resolvePath(to, base).split(/[?#]/, 1).join('')
    ).toLowerCase()
    const current = stripTrailingSlash(location.pathname).toLowerCase()

    const isActive =
        current === target || (!end && target !== '/' && current.startsWith(`${target}/`))

    const renderProps: NavLinkRenderProps = { isActive }

    return (
        <Link
            {...rest}
            ref={ref}
            to={to}
            aria-current={isActive ? 'page' : undefined}
            className={
                typeof className === 'function' ? className(renderProps) : className
            }
            style={typeof style === 'function' ? style(renderProps) : style}
        >
            {typeof children === 'function' ? children(renderProps) : children}
        </Link>
    )
})
