import { afterEach, describe, expect, it, vi } from 'vitest'
import { createHistory } from './history'

afterEach(() => {
    window.history.replaceState(null, '', '/')
})

describe('createHistory (memory)', () => {
    it('starts at the given path', () => {
        const history = createHistory({ mode: 'memory', initialPath: '/users/42?tab=a' })
        expect(history.get().pathname).toBe('/users/42')
        expect(history.get().search).toBe('?tab=a')
    })

    it('notifies subscribers on push', () => {
        const history = createHistory({ mode: 'memory' })
        const listener = vi.fn()
        history.subscribe(listener)

        history.push('/about')

        expect(listener).toHaveBeenCalledTimes(1)
        expect(history.get().pathname).toBe('/about')
    })

    it('returns a stable snapshot between navigations', () => {
        const history = createHistory({ mode: 'memory' })
        expect(history.get()).toBe(history.get())

        const before = history.get()
        history.push('/about')
        expect(history.get()).not.toBe(before)
    })

    it('carries state', () => {
        const history = createHistory({ mode: 'memory' })
        history.push('/checkout', { state: { from: '/cart' } })
        expect(history.get().state).toEqual({ from: '/cart' })
    })

    it('ignores a push to the identical location', () => {
        const history = createHistory({ mode: 'memory', initialPath: '/about' })
        const listener = vi.fn()
        history.subscribe(listener)

        history.push('/about')

        expect(listener).not.toHaveBeenCalled()
    })

    it('stops notifying after unsubscribe', () => {
        const history = createHistory({ mode: 'memory' })
        const listener = vi.fn()
        const unsubscribe = history.subscribe(listener)

        unsubscribe()
        history.push('/about')

        expect(listener).not.toHaveBeenCalled()
    })
})

describe('createHistory (browser)', () => {
    it('reads the current URL', () => {
        window.history.replaceState(null, '', '/users/7?tab=posts#bio')
        const history = createHistory({ mode: 'browser' })

        expect(history.get().pathname).toBe('/users/7')
        expect(history.get().search).toBe('?tab=posts')
        expect(history.get().hash).toBe('#bio')

        history.destroy()
    })

    it('updates the address bar on push', () => {
        const history = createHistory({ mode: 'browser' })
        history.subscribe(() => {})

        history.push('/about')

        expect(window.location.pathname).toBe('/about')
        history.destroy()
    })

    it('keeps two instances in sync', () => {
        const a = createHistory({ mode: 'browser' })
        const b = createHistory({ mode: 'browser' })
        a.subscribe(() => {})
        b.subscribe(() => {})

        a.push('/synced')

        expect(b.get().pathname).toBe('/synced')
        a.destroy()
        b.destroy()
    })

    it('only listens while it has subscribers', () => {
        const spy = vi.spyOn(window, 'addEventListener')
        const history = createHistory({ mode: 'browser' })

        expect(spy).not.toHaveBeenCalledWith('popstate', expect.anything())

        const unsubscribe = history.subscribe(() => {})
        expect(spy).toHaveBeenCalledWith('popstate', expect.anything())

        unsubscribe()
        history.destroy()
        spy.mockRestore()
    })

    it('strips the base from the pathname', () => {
        window.history.replaceState(null, '', '/docs/guide')
        const history = createHistory({ mode: 'browser', base: '/docs' })

        expect(history.get().pathname).toBe('/guide')
        history.destroy()
    })

    it('prefixes the base when navigating', () => {
        const history = createHistory({ mode: 'browser', base: '/docs' })
        history.subscribe(() => {})

        history.push('/api')

        expect(window.location.pathname).toBe('/docs/api')
        expect(history.get().pathname).toBe('/api')
        history.destroy()
    })
})

describe('createHistory (hash)', () => {
    it('reads and writes the hash', () => {
        const history = createHistory({ mode: 'hash' })
        history.subscribe(() => {})

        history.replace('/about')

        expect(window.location.hash).toBe('#/about')
        expect(history.get().pathname).toBe('/about')
        history.destroy()
    })
})
