import { useState, useEffect } from 'react'
import { EVENTS } from './consts'

export function Router({
	routes = [],
	defaulComponent: DefaultComponent = null,
}) {
	const [currentPath, setCurrentPath] = useState(window.location.pathname)

	useEffect(() => {
		const onLocationChange = () => {
			setCurrentPath(window.location.pathname)
		}

		window.addEventListener(EVENTS.PUSHSTATE, onLocationChange)
		window.addEventListener(EVENTS.POPSTATE, onLocationChange)

		return () => {
			window.removeEventListener(EVENTS.PUSHSTATE, onLocationChange)
			window.removeEventListener(EVENTS.POPSTATE, onLocationChange)
		}
	}, [])

	const Page = routes.find(({ path }) => path === currentPath)?.Component
	return Page ? <Page /> : <DefaultComponent />
}
