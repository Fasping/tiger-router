import { createContext, useEffect, useState, ReactNode } from 'react'
import { createHistory } from '../core/history'

export interface RouterContextType {
    location: string
    navigate: (path: string) => void
    params: Record<string, string>
}

export const RouterContext = createContext<RouterContextType>({
    location: '/',
    navigate: () => { },
    params: {},
})

interface RouterProps {
    mode?: 'history' | 'hash'
    children: ReactNode
}

export function Router({ mode = 'history', children }: RouterProps) {
    const [history] = useState(() => createHistory(mode))
    const [location, setLocation] = useState(history.currentPath)

    useEffect(() => {
        const unsubscribe = history.subscribe(path => {
            setLocation(path)
        })
        return unsubscribe
    }, [history])

    const value = {
        location,
        navigate: history.navigate,
        params: {},
    }

    return (
        <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
    )
}
