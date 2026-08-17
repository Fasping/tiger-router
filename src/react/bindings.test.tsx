import { fireEvent, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useLocation, useNavigate, useParams, useRouter, useSearchParams } from './hooks'
import { Link } from './Link'
import { Navigate } from './Navigate'
import { NavLink } from './NavLink'
import { Route } from './Route'
import { Router } from './Router'
import { Routes } from './Routes'

afterEach(() => {
    window.history.replaceState(null, '', '/')
})

function renderAt(path: string, ui: React.ReactNode) {
    return render(
        <StrictMode>
            <Router mode="memory" initialPath={path}>
                {ui}
            </Router>
        </StrictMode>
    )
}

describe('<Routes>', () => {
    it('renders only the matching route', () => {
        renderAt(
            '/about',
            <Routes>
                <Route path="/" element={<p>home</p>} />
                <Route path="/about" element={<p>about</p>} />
            </Routes>
        )

        expect(screen.getByText('about')).toBeTruthy()
        expect(screen.queryByText('home')).toBeNull()
    })

    it('renders the fallback when nothing matches', () => {
        renderAt(
            '/missing',
            <Routes fallback={<p>404</p>}>
                <Route path="/" element={<p>home</p>} />
            </Routes>
        )

        expect(screen.getByText('404')).toBeTruthy()
    })

    it('prefers the most specific route regardless of order', () => {
        const ui = (
            <Routes>
                <Route path="*" element={<p>catch-all</p>} />
                <Route path="/users/:id" element={<p>user</p>} />
                <Route path="/users/new" element={<p>new user</p>} />
            </Routes>
        )

        renderAt('/users/new', ui)
        expect(screen.getByText('new user')).toBeTruthy()
    })

    it('accepts children instead of element', () => {
        renderAt(
            '/',
            <Routes>
                <Route path="/">
                    <p>from children</p>
                </Route>
            </Routes>
        )

        expect(screen.getByText('from children')).toBeTruthy()
    })

    it('warns about non-Route children in development', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

        renderAt(
            '/',
            <Routes>
                <Route path="/" element={<p>home</p>} />
                <p>stray</p>
            </Routes>
        )

        expect(warn).toHaveBeenCalled()
        warn.mockRestore()
    })
})

describe('params', () => {
    function ShowId() {
        const { id } = useParams<{ id: string }>()
        return <p>id: {id}</p>
    }

    it('exposes params to the matched element', () => {
        renderAt(
            '/users/42',
            <Routes>
                <Route path="/users/:id" element={<ShowId />} />
            </Routes>
        )

        expect(screen.getByText('id: 42')).toBeTruthy()
    })

    it('keeps params working when the URL has a query string', () => {
        renderAt(
            '/users/42?tab=posts',
            <Routes>
                <Route path="/users/:id" element={<ShowId />} />
            </Routes>
        )

        expect(screen.getByText('id: 42')).toBeTruthy()
    })
})

describe('nested routes', () => {
    function Settings() {
        return (
            <section>
                <h2>settings</h2>
                <Routes fallback={<p>settings home</p>}>
                    <Route path="/profile" element={<p>profile</p>} />
                    <Route path="/billing/:plan" element={<Plan />} />
                </Routes>
            </section>
        )
    }

    function Plan() {
        const { plan, section } = useParams()
        return (
            <p>
                plan: {plan} / section: {section}
            </p>
        )
    }

    it('matches the remaining path below a splat', () => {
        renderAt(
            '/settings/profile',
            <Routes>
                <Route path="/settings/*" element={<Settings />} />
            </Routes>
        )

        expect(screen.getByText('settings')).toBeTruthy()
        expect(screen.getByText('profile')).toBeTruthy()
    })

    it('inherits params from ancestor routes', () => {
        renderAt(
            '/dashboard/settings/billing/pro',
            <Routes>
                <Route path="/dashboard/:section/*" element={<Settings />} />
            </Routes>
        )

        expect(screen.getByText('plan: pro / section: settings')).toBeTruthy()
    })

    it('falls back inside the nested scope', () => {
        renderAt(
            '/settings',
            <Routes>
                <Route path="/settings/*" element={<Settings />} />
            </Routes>
        )

        expect(screen.getByText('settings home')).toBeTruthy()
    })
})

describe('<Route> standalone', () => {
    it('renders every match when used without <Routes>', () => {
        renderAt(
            '/about',
            <>
                <Route path="*" element={<p>sidebar</p>} />
                <Route path="/about" element={<p>about</p>} />
            </>
        )

        expect(screen.getByText('sidebar')).toBeTruthy()
        expect(screen.getByText('about')).toBeTruthy()
    })
})

describe('<Link>', () => {
    it('navigates without reloading', () => {
        renderAt(
            '/',
            <>
                <Link to="/about">go</Link>
                <Routes>
                    <Route path="/" element={<p>home</p>} />
                    <Route path="/about" element={<p>about</p>} />
                </Routes>
            </>
        )

        fireEvent.click(screen.getByText('go'))

        expect(screen.getByText('about')).toBeTruthy()
    })

    it('renders a real href', () => {
        renderAt('/', <Link to="/about">go</Link>)
        expect(screen.getByText('go').getAttribute('href')).toBe('/about')
    })

    it('still calls a user-provided onClick', () => {
        const onClick = vi.fn()
        renderAt(
            '/',
            <>
                <Link to="/about" onClick={onClick}>
                    go
                </Link>
                <Routes>
                    <Route path="/about" element={<p>about</p>} />
                </Routes>
            </>
        )

        fireEvent.click(screen.getByText('go'))

        expect(onClick).toHaveBeenCalledTimes(1)
        expect(screen.getByText('about')).toBeTruthy()
    })

    it('lets onClick cancel navigation', () => {
        renderAt(
            '/',
            <>
                <Link to="/about" onClick={event => event.preventDefault()}>
                    go
                </Link>
                <Routes>
                    <Route path="/" element={<p>home</p>} />
                    <Route path="/about" element={<p>about</p>} />
                </Routes>
            </>
        )

        fireEvent.click(screen.getByText('go'))

        expect(screen.getByText('home')).toBeTruthy()
    })

    it('ignores modified clicks', () => {
        renderAt(
            '/',
            <>
                <Link to="/about">go</Link>
                <Routes>
                    <Route path="/" element={<p>home</p>} />
                    <Route path="/about" element={<p>about</p>} />
                </Routes>
            </>
        )

        fireEvent.click(screen.getByText('go'), { metaKey: true })

        expect(screen.getByText('home')).toBeTruthy()
    })

    it('leaves external links to the browser', () => {
        renderAt('/', <Link to="https://example.com">out</Link>)
        expect(screen.getByText('out').getAttribute('href')).toBe('https://example.com')
    })

    it('resolves relative targets against the current route', () => {
        renderAt(
            '/users/42',
            <Routes>
                <Route path="/users/:id" element={<Link to="edit">edit</Link>} />
            </Routes>
        )

        expect(screen.getByText('edit').getAttribute('href')).toBe('/users/42/edit')
    })

    it('forwards a ref', () => {
        const ref = { current: null as HTMLAnchorElement | null }
        renderAt(
            '/',
            <Link ref={ref} to="/about">
                go
            </Link>
        )
        expect(ref.current?.tagName).toBe('A')
    })
})

describe('<NavLink>', () => {
    it('marks the active link', () => {
        renderAt(
            '/about',
            <>
                <NavLink
                    to="/about"
                    className={({ isActive }) => (isActive ? 'on' : 'off')}
                >
                    about
                </NavLink>
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => (isActive ? 'on' : 'off')}
                >
                    home
                </NavLink>
            </>
        )

        const about = screen.getByText('about')
        expect(about.className).toBe('on')
        expect(about.getAttribute('aria-current')).toBe('page')
        expect(screen.getByText('home').className).toBe('off')
    })

    it('stays active for child paths unless end is set', () => {
        renderAt(
            '/settings/profile',
            <>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => (isActive ? 'on' : 'off')}
                >
                    loose
                </NavLink>
                <NavLink
                    to="/settings"
                    end
                    className={({ isActive }) => (isActive ? 'on' : 'off')}
                >
                    exact
                </NavLink>
            </>
        )

        expect(screen.getByText('loose').className).toBe('on')
        expect(screen.getByText('exact').className).toBe('off')
    })
})

describe('hooks', () => {
    it('useNavigate navigates and goes back', () => {
        function Controls() {
            const navigate = useNavigate()
            return (
                <>
                    <button type="button" onClick={() => navigate('/about')}>
                        go
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/login', { replace: true })}
                    >
                        replace
                    </button>
                </>
            )
        }

        renderAt(
            '/',
            <>
                <Controls />
                <Routes fallback={<p>none</p>}>
                    <Route path="/" element={<p>home</p>} />
                    <Route path="/about" element={<p>about</p>} />
                    <Route path="/login" element={<p>login</p>} />
                </Routes>
            </>
        )

        fireEvent.click(screen.getByText('go'))
        expect(screen.getByText('about')).toBeTruthy()

        fireEvent.click(screen.getByText('replace'))
        expect(screen.getByText('login')).toBeTruthy()
    })

    it('useLocation exposes search and state', () => {
        function Show() {
            const location = useLocation()
            return <p>{`${location.pathname}${location.search}`}</p>
        }

        renderAt('/users/1?tab=a', <Show />)
        expect(screen.getByText('/users/1?tab=a')).toBeTruthy()
    })

    it('useSearchParams reads and writes the query string', () => {
        function Search() {
            const [params, setParams] = useSearchParams()
            return (
                <>
                    <p>q: {params.get('q') ?? 'none'}</p>
                    <button type="button" onClick={() => setParams({ q: 'tiger' })}>
                        search
                    </button>
                </>
            )
        }

        renderAt('/search', <Search />)
        expect(screen.getByText('q: none')).toBeTruthy()

        fireEvent.click(screen.getByText('search'))
        expect(screen.getByText('q: tiger')).toBeTruthy()
    })

    it('useRouter separates the app basename from the route base', () => {
        function Show() {
            const { basename, routeBase } = useRouter()
            return <p>{`${basename} | ${routeBase}`}</p>
        }

        render(
            <Router mode="memory" initialPath="/settings/profile" base="/docs">
                <Routes>
                    <Route path="/settings/*" element={<Show />} />
                </Routes>
            </Router>
        )

        expect(screen.getByText('/docs | /settings')).toBeTruthy()
    })

    it('throws a helpful error outside <Router>', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(() => render(<Link to="/">x</Link>)).toThrow(/inside a <Router>/)

        error.mockRestore()
    })
})

describe('<Navigate>', () => {
    it('redirects on render', () => {
        renderAt(
            '/old',
            <Routes>
                <Route path="/old" element={<Navigate to="/new" />} />
                <Route path="/new" element={<p>new page</p>} />
            </Routes>
        )

        expect(screen.getByText('new page')).toBeTruthy()
    })
})

describe('cleanup', () => {
    it('detaches window listeners on unmount', () => {
        const remove = vi.spyOn(window, 'removeEventListener')

        const view = render(
            <Router mode="browser">
                <Route path="*" element={<p>x</p>} />
            </Router>
        )
        view.unmount()

        expect(remove).toHaveBeenCalledWith('popstate', expect.anything())
        remove.mockRestore()
    })
})
