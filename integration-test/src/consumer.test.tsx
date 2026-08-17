import { fireEvent, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { App, matchOutsideReact, storeOutsideReact } from './consumer'

const require = createRequire(import.meta.url)

describe('the published package', () => {
    it('resolves through the exports map', () => {
        expect(require.resolve('tiger-router')).toContain('tiger-router')
    })

    it('ships the "use client" directive in both formats', () => {
        // Without it, importing from a Next.js App Router client component breaks.
        const pkgPath = require.resolve('tiger-router/package.json')
        const dir = pkgPath.replace(/package\.json$/, '')

        for (const file of ['dist/index.js', 'dist/index.cjs']) {
            const source = readFileSync(`${dir}${file}`, 'utf8')
            expect(source.slice(0, 40)).toContain('use client')
        }
    })

    it('ships types for both ESM and CJS consumers', () => {
        expect(() => require.resolve('tiger-router')).not.toThrow()
        const pkg = require('tiger-router/package.json')
        expect(pkg.exports['.'].import.types).toBe('./dist/index.d.ts')
        expect(pkg.exports['.'].require.types).toBe('./dist/index.d.cts')
    })

    it('declares a React peer range that accepts 18 and 19', () => {
        const pkg = require('tiger-router/package.json')
        expect(pkg.peerDependencies.react).toBe('^18.2.0 || ^19.0.0')
    })
})

describe('routing, as a consumer sees it', () => {
    it('renders the matching route', () => {
        render(<App />)
        expect(screen.getByText('home')).toBeTruthy()
    })

    it('navigates on click and exposes params', () => {
        render(<App />)

        fireEvent.click(screen.getByText('user 42'))

        expect(screen.getByText('user 42', { selector: 'h2' })).toBeTruthy()
        expect(screen.getByText('viewing 42')).toBeTruthy()
    })

    it('navigates programmatically', () => {
        render(<App initialPath="/users/7" />)

        fireEvent.click(screen.getByText('home'))

        expect(screen.getByText('home', { selector: 'p' })).toBeTruthy()
    })

    it('falls back for unknown paths', () => {
        render(<App initialPath="/nope" />)
        expect(screen.getByText('not found')).toBeTruthy()
    })

    it('redirects with <Navigate>', () => {
        render(<App initialPath="/old" />)
        expect(screen.getByText('home')).toBeTruthy()
    })

    it('writes the query string', () => {
        render(<App initialPath="/search" />)

        fireEvent.change(screen.getByLabelText('query'), { target: { value: 'tiger' } })

        expect((screen.getByLabelText('query') as HTMLInputElement).value).toBe('tiger')
    })

    it('marks the active NavLink', () => {
        render(<App initialPath="/search" />)
        expect(screen.getByText('search').getAttribute('aria-current')).toBe('page')
    })

    it('renders nested routes and relative links', () => {
        render(<App initialPath="/settings/profile" />)

        expect(screen.getByText('basename / routeBase /settings')).toBeTruthy()
        expect(screen.getByText('profile', { selector: 'p' })).toBeTruthy()
        expect(screen.getByText('relative link').getAttribute('href')).toBe(
            '/settings/profile'
        )
    })
})

describe('the core, without React', () => {
    it('matches routes', () => {
        expect(matchOutsideReact('/users/9')?.params.id).toBe('9')
        expect(matchOutsideReact('/posts/9')).toBeNull()
    })

    it('creates a standalone store', () => {
        const history = storeOutsideReact()
        expect(history.get().pathname).toBe('/seed')

        history.push('/next')
        expect(history.get().pathname).toBe('/next')
    })
})
