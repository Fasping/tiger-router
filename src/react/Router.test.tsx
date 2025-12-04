import { describe, it, expect } from 'vitest'
import { matchRoute } from '../core/matcher'

describe('Router integration', () => {
    it('should match routes correctly', () => {
        const match = matchRoute('/users/:id', '/users/123')
        expect(match).toEqual({ params: { id: '123' } })
    })
})
