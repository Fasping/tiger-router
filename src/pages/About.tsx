import { Link } from '../Link'

const i18n: Record<string, { title: string; button: string; description: string }> = {
	es: {
		title: 'Sobre Nosotros',
		button: 'Ir a la Home',
		description: 'Hola, soy Nando y estoy creando un React Router Clone.',
	},
	en: {
		title: 'About us',
		button: 'Go to Home page',
		description: 'Hey im Nando, and im creating a React Router Clone.',
	},
}

const useI18n = (lang: string) => {
	return i18n[lang] || i18n.en
}

export default function AboutPage({ routeParams }: { routeParams: any }) {
	const i18n = useI18n(routeParams.lang ?? 'es')

	return (
		<>
			<h1>{i18n.title}</h1>
			<p>{i18n.description}</p>
			<Link to='/'>{i18n.button}</Link>
		</>
	)
}
