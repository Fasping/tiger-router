/**
 * A small app that touches the whole public API, imported the way a real
 * consumer imports it: from the package name, resolved through `exports`.
 *
 * If a type signature regresses or an export disappears, `npm run typecheck`
 * in this folder fails — before anyone installs the broken version.
 */
import {
    Link,
    NavLink,
    Navigate,
    Route,
    Router,
    Routes,
    createHistory,
    matchRoute,
    useLocation,
    useMatch,
    useNavigate,
    useParams,
    useRouter,
    useSearchParams,
    type HistoryMode,
    type NavigateFunction,
    type RouteMatch,
    type RouterLocation,
} from 'tiger-router'

function User() {
    // Typed params: `id` must be a string here, not `string | undefined`.
    const { id } = useParams<{ id: string }>()
    const navigate: NavigateFunction = useNavigate()
    const location: RouterLocation = useLocation()

    return (
        <article>
            <h2>user {id}</h2>
            <p>at {location.pathname}</p>
            <button type="button" onClick={() => navigate('/', { replace: true })}>
                home
            </button>
            <button type="button" onClick={() => navigate(-1)}>
                back
            </button>
        </article>
    )
}

function Search() {
    const [params, setParams] = useSearchParams()

    return (
        <label>
            query
            <input
                value={params.get('q') ?? ''}
                onChange={event => setParams({ q: event.target.value })}
            />
        </label>
    )
}

function Settings() {
    const { basename, routeBase } = useRouter()

    return (
        <section>
            <p>
                basename {basename} routeBase {routeBase}
            </p>
            <Routes fallback={<p>settings overview</p>}>
                <Route path="/profile" element={<p>profile</p>} />
            </Routes>
            <Link to="profile">relative link</Link>
        </section>
    )
}

function Banner() {
    const match: RouteMatch | null = useMatch('/users/:id')
    return match ? <p>viewing {match.params.id}</p> : null
}

export const MODE: HistoryMode = 'memory'

export function App({ initialPath = '/' }: { initialPath?: string }) {
    return (
        <Router mode={MODE} initialPath={initialPath}>
            <nav>
                <Link to="/users/42">user 42</Link>
                <NavLink
                    to="/search"
                    className={({ isActive }) => (isActive ? 'active' : undefined)}
                >
                    search
                </NavLink>
            </nav>
            <Banner />
            <Routes fallback={<p>not found</p>}>
                <Route path="/" element={<p>home</p>} />
                <Route path="/users/:id" element={<User />} />
                <Route path="/search" element={<Search />} />
                <Route path="/settings/*" element={<Settings />} />
                <Route path="/old" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    )
}

// The core is usable without React at all — worth proving from outside too.
export function matchOutsideReact(path: string) {
    return matchRoute('/users/:id', path)
}

export function storeOutsideReact() {
    return createHistory({ mode: 'memory', initialPath: '/seed' })
}
