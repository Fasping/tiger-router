import { useState, useEffect, Children } from 'react'
import { EVENTS } from './consts'
import { match } from 'path-to-regexp'

export function Router({
	children,
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

	let routeParams = {}

	//add routes from children <Route />> components
	const routesFromChildren = Children.map(children, ({ props, type }) => {
		const { name } = type
		const isRoute = name === 'Route'

		return isRoute ? props : null
	}).filter(Boolean)

	const routesToUse = routes.concat(routesFromChildren)

	const Page = routesToUse.find(({ path }) => {
		if (path === currentPath) return true

		// Use path-to-regex for detect dinamic routes like /serach/:query <- query is a dinamic route
		const macherUrl = match(path, { decode: decodeURIComponent })
		const matched = macherUrl(currentPath)
		if (!matched) return false

		routeParams = matched.params
		return true
	})?.Component

	return Page ? (
		<Page routeParams={routeParams} />
	) : (
		<DefaultComponent routeParams={routeParams} />
	)
}