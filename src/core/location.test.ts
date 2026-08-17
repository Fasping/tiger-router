import { describe, expect, it } from 'vitest'
import { joinPaths, parsePath, resolvePath, stripTrailingSlash, toHref } from './location'

describe('parsePath', () => {
    it('splits pathname, search and hash', () => {
        expect(parsePath('/users/42?tab=posts#bio')).toEqual({
            pathname: '/users/42',
            search: '?tab=posts',
            hash: '#bio',
        })
    })

    it('defaults to the root path', () => {
        expect(parsePath('')).toEqual({ pathname: '/', search: '', hash: '' })
    })

    it('adds the leading slash', () => {
        expect(parsePath('about').pathname).toBe('/about')
    })

    it('ignores empty search and hash markers', () => {
        expect(parsePath('/a?#')).toEqual({ pathname: '/a', search: '', hash: '' })
    })
})

describe('joinPaths', () => {
    it('collapses duplicated slashes', () => {
        expect(joinPaths('/users/', '/42')).toBe('/users/42')
    })

    it('skips empty parts', () => {
        expect(joinPaths('/', undefined, 'about')).toBe('/about')
    })

    it('returns the root for no input', () => {
        expect(joinPaths()).toBe('/')
    })
})

describe('resolvePath', () => {
    it('keeps absolute targets untouched', () => {
        expect(resolvePath('/about', '/users/42')).toBe('/about')
    })

    it('resolves relative targets against the base', () => {
        expect(resolvePath('edit', '/users/42')).toBe('/users/42/edit')
        expect(resolvePath('./edit', '/users/42')).toBe('/users/42/edit')
    })

    it('preserves search and hash on relative targets', () => {
        expect(resolvePath('edit?draft=1#top', '/users/42')).toBe(
            '/users/42/edit?draft=1#top'
        )
    })
})

describe('stripTrailingSlash', () => {
    it('removes a trailing slash but keeps the root', () => {
        expect(stripTrailingSlash('/about/')).toBe('/about')
        expect(stripTrailingSlash('/')).toBe('/')
    })
})

describe('toHref', () => {
    it('rebuilds the full href', () => {
        expect(
            toHref({ pathname: '/a', search: '?b=1', hash: '#c', state: null, key: 'k' })
        ).toBe('/a?b=1#c')
    })
})
