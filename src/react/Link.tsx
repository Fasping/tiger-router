import { useContext, ReactNode, MouseEvent, AnchorHTMLAttributes } from 'react'
import { RouterContext } from './Router'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string
    children: ReactNode
}

export function Link({ to, children, ...props }: LinkProps) {
    const { navigate } = useContext(RouterContext)

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        const isMainEvent = event.button === 0
        const isModifiedEvent =
            event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
        const isManageableEvent = props.target === undefined || props.target === '_self'

        if (isMainEvent && isManageableEvent && !isModifiedEvent) {
            event.preventDefault()
            navigate(to)
        }

        if (props.onClick) {
            props.onClick(event)
        }
    }

    return (
        <a href={to} onClick={handleClick} {...props}>
            {children}
        </a>
    )
}
