import { useParams } from '../../index'

export default function About() {
    const { lang } = useParams<{ lang?: string }>()

    return (
        <section>
            <h2>About</h2>
            <p>A minimalist router: three components, six hooks, zero dependencies.</p>
            {lang && (
                <p>
                    Language from the URL: <strong>{lang}</strong>
                </p>
            )}
        </section>
    )
}
