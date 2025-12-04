import { useContext, ReactNode } from 'react'
import { RouterContext } from './Router'
import { matchRoute } from '../core/matcher'

interface RouteProps {
    path: string
    element?: ReactNode
    children?: ReactNode
}

export function Route({ path, element, children }: RouteProps) {
    const { location, navigate, params: parentParams } = useContext(RouterContext)
    const match = matchRoute(path, location)

    if (!match) return null

    const params = { ...parentParams, ...match.params }
    const value = { location, navigate, params }

    return (
        <RouterContext.Provider value={value}>
            {element || children}
        </RouterContext.Provider>
    )
}
