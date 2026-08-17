import { lazy, Suspense } from 'react'
import { NavLink, Route, Router, Routes } from '../index'
import './App.css'
import Page404 from './pages/Page404'
import Search from './pages/Search'
import Users from './pages/Users'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

const activeClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')

export default function App() {
    return (
        <Router>
            <header>
                <h1>🐯 Tiger Router</h1>
                <nav>
                    <NavLink to="/" end className={activeClass}>
                        Home
                    </NavLink>
                    <NavLink to="/about" className={activeClass}>
                        About
                    </NavLink>
                    <NavLink to="/users" className={activeClass}>
                        Users
                    </NavLink>
                    <NavLink to="/search?q=tiger" className={activeClass}>
                        Search
                    </NavLink>
                </nav>
            </header>

            <main>
                <Suspense fallback={<p>Loading…</p>}>
                    <Routes fallback={<Page404 />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/:lang/about" element={<About />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/users/*" element={<Users />} />
                    </Routes>
                </Suspense>
            </main>
        </Router>
    )
}
