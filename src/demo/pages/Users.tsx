import { Link, Route, Routes, useParams } from '../../index'

const USERS = [
    { id: '1', name: 'Ada Lovelace' },
    { id: '2', name: 'Grace Hopper' },
    { id: '3', name: 'Alan Turing' },
]

function UserList() {
    return (
        <ul>
            {USERS.map(user => (
                <li key={user.id}>
                    {/* Relative link: resolves against /users */}
                    <Link to={user.id}>{user.name}</Link>
                </li>
            ))}
        </ul>
    )
}

function UserDetail() {
    const { id } = useParams<{ id: string }>()
    const user = USERS.find(candidate => candidate.id === id)

    return (
        <article>
            <h3>{user ? user.name : `Unknown user #${id}`}</h3>
            <Link to="/users">← Back to the list</Link>
        </article>
    )
}

/** Nested routing: the parent matched `/users/*`, so these paths are relative to it. */
export default function Users() {
    return (
        <section>
            <h2>Users</h2>
            <Routes fallback={<UserList />}>
                <Route path="/:id" element={<UserDetail />} />
            </Routes>
        </section>
    )
}
