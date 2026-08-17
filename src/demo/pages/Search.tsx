import { useSearchParams } from '../../index'

export default function Search() {
    const [params, setParams] = useSearchParams()
    const query = params.get('q') ?? ''

    return (
        <section>
            <h2>Search</h2>
            <input
                type="search"
                value={query}
                placeholder="Type something…"
                onChange={event =>
                    setParams({ q: event.target.value }, { replace: true })
                }
            />
            <p>
                {query ? (
                    <>
                        Results for <strong>{query}</strong>
                    </>
                ) : (
                    'The query string is the state — try reloading the page.'
                )}
            </p>
        </section>
    )
}
