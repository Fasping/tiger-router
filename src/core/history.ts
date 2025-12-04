export type HistoryMode = 'history' | 'hash'

export interface History {
    currentPath: string
    navigate: (path: string) => void
    subscribe: (listener: (path: string) => void) => () => void
}

export function createHistory(mode: HistoryMode = 'history'): History {
    const getPath = () => {
        if (mode === 'hash') {
            return window.location.hash.slice(1) || '/'
        }
        return window.location.pathname + window.location.search
    }

    let currentPath = getPath()
    const listeners = new Set<(path: string) => void>()

    const notify = () => {
        currentPath = getPath()
        listeners.forEach(listener => listener(currentPath))
    }

    const navigate = (path: string) => {
        if (mode === 'history') {
            window.history.pushState({}, '', path)
            window.dispatchEvent(new PopStateEvent('popstate'))
        } else {
            window.location.hash = path
        }
    }

    const subscribe = (listener: (path: string) => void) => {
        listeners.add(listener)
        return () => {
            listeners.delete(listener)
        }
    }

    const onPopState = () => {
        notify()
    }

    if (mode === 'history') {
        window.addEventListener('popstate', onPopState)
    } else {
        window.addEventListener('hashchange', onPopState)
    }

    // Cleanup logic isn't strictly necessary for a singleton router,
    // but good practice if we were to destroy it.
    // For now, we just attach listeners once.

    return {
        get currentPath() {
            return currentPath
        },
        navigate,
        subscribe,
    }
}
