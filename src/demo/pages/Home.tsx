import { Link, useLocation } from '../../index'

export default function Home() {
    const location = useLocation()

    return (
        <section>
            <h2>Home</h2>
            <p>
                You are at <code>{location.pathname}</code>.
            </p>
            <p>
                <Link to="/es/about">Route with a param</Link> ·{' '}
                <Link to="/nope">Unknown route</Link>
            </p>
        </section>
    )
}
