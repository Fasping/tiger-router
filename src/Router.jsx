import { useState, useEffect, Children } from 'react'
import { EVENTS } from './consts'
import { match } from 'path-to-regexp'
import { getCurrentPath } from './utils.js'

export function Router({
	children,
	routes = [],
	defaultComponent: DefaultComponent = () => <h1>404</h1>,
}) {
	const [currentPath, setCurrentPath] = useState(getCurrentPath())

	useEffect(() => {
		const onLocationChange = () => {
			setCurrentPath(getCurrentPath())
		}

		window.addEventListener(EVENTS.PUSHSTATE, onLocationChange)
		window.addEventListener(EVENTS.POPSTATE, onLocationChange)

		return () => {
			window.removeEventListener(EVENTS.PUSHSTATE, onLocationChange)
			window.removeEventListener(EVENTS.POPSTATE, onLocationChange)
		}
	}, [])

	const routesFromChildren = Children.toArray(children)
		.filter(child => child.type.name === 'Route')
		.map(child => child.props)

	const routesToUse = [...routes, ...routesFromChildren]

	let routeParams = {}

	const Page = routesToUse.find(({ path }) => {
		if (path === currentPath) return true

		const matcher = match(path, { decode: decodeURIComponent })
		const matched = matcher(currentPath)
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
