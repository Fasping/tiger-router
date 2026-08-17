import { describe, expect, it } from 'vitest'
import { matchRoute, rankMatches } from './matcher'

describe('matchRoute', () => {
    it('matches static paths', () => {
        expect(matchRoute('/about', '/about')?.params).toEqual({})
        expect(matchRoute('/about', '/contact')).toBeNull()
    })

    it('matches the root path', () => {
        expect(matchRoute('/', '/')).not.toBeNull()
        expect(matchRoute('/', '/about')).toBeNull()
    })

    it('captures params', () => {
        expect(matchRoute('/users/:id', '/users/42')?.params).toEqual({ id: '42' })
    })

    it('captures several params', () => {
        expect(matchRoute('/:lang/users/:id', '/es/users/42')?.params).toEqual({
            lang: 'es',
            id: '42',
        })
    })

    it('rejects a different segment count', () => {
        expect(matchRoute('/users/:id', '/users')).toBeNull()
        expect(matchRoute('/users/:id', '/users/42/edit')).toBeNull()
    })

    it('supports optional params', () => {
        expect(matchRoute('/posts/:page?', '/posts')?.params).toEqual({ page: undefined })
        expect(matchRoute('/posts/:page?', '/posts/2')?.params).toEqual({ page: '2' })
    })

    it('decodes params', () => {
        expect(matchRoute('/search/:q', '/search/hola%20mundo')?.params.q).toBe(
            'hola mundo'
        )
    })

    it('survives malformed escape sequences', () => {
        expect(matchRoute('/search/:q', '/search/100%')?.params.q).toBe('100%')
    })

    it('tolerates a trailing slash', () => {
        expect(matchRoute('/about', '/about/')).not.toBeNull()
    })

    it('is case insensitive on static segments', () => {
        expect(matchRoute('/About', '/about')).not.toBeNull()
    })

    it('matches a splat and reports the rest', () => {
        const match = matchRoute('/files/*', '/files/docs/2026/report.pdf')
        expect(match?.params['*']).toBe('docs/2026/report.pdf')
        expect(match?.pathname).toBe('/files')
        expect(match?.rest).toBe('/docs/2026/report.pdf')
    })

    it('matches a splat with nothing left', () => {
        const match = matchRoute('/files/*', '/files')
        expect(match).not.toBeNull()
        expect(match?.rest).toBe('/')
    })

    it('matches everything with a bare splat', () => {
        expect(matchRoute('*', '/anything/at/all')).not.toBeNull()
    })

    it('treats regex characters as literals', () => {
        expect(matchRoute('/a.b', '/axb')).toBeNull()
        expect(matchRoute('/a.b', '/a.b')).not.toBeNull()
    })
})

describe('rankMatches', () => {
    it('prefers the most specific route regardless of order', () => {
        const patterns = ['*', '/users/:id', '/users/new']

        expect(rankMatches(patterns, '/users/new')?.index).toBe(2)
        expect(rankMatches(patterns, '/users/42')?.index).toBe(1)
        expect(rankMatches(patterns, '/nope')?.index).toBe(0)
    })

    it('returns null when nothing matches', () => {
        expect(rankMatches(['/a', '/b'], '/c')).toBeNull()
    })

    it('keeps declaration order on ties', () => {
        expect(rankMatches(['/:a', '/:b'], '/x')?.index).toBe(0)
    })
})
