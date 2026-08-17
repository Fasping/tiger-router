import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// `globals: false` means Testing Library cannot register its own auto-cleanup.
afterEach(cleanup)
