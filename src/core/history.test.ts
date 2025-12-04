import { describe, it, expect, vi } from 'vitest'
import { createHistory } from './history'

describe('createHistory', () => {
    it('should notify listeners on navigation', () => {
        const history = createHistory('history')
        const spy = vi.fn()
        history.subscribe(spy)

        history.navigate('/new-path')
        // Check that listener was called
        expect(spy).toHaveBeenCalled()
    })
})
