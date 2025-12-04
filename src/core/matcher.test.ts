import { describe, it, expect } from 'vitest'
import { matchRoute } from './matcher'

describe('matchRoute', () => {
    it('should match route with params', () => {
        const match = matchRoute('/users/:id', '/users/123')
        expect(match).toEqual({ params: { id: '123' } })
    })

    it('should not match different route', () => {
        const match = matchRoute('/users/:id', '/posts/123')
        expect(match).toBeNull()
    })
})
