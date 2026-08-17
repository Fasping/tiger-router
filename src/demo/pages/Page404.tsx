import { Link, useLocation } from '../../index'

export default function Page404() {
    const location = useLocation()

    return (
        <section>
            <h2>404</h2>
            <p>
                Nothing lives at <code>{location.pathname}</code>.
            </p>
            <Link to="/">Take me home</Link>
        </section>
    )
}
