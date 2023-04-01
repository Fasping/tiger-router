/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-tabs */

import './App.css'
import { useEffect, useState } from 'react'
import { EVENTS } from './consts'

function navigate(href) {
	window.history.pushState({}, '', href)
	// create custom event
	const navigationEvent = new Event(EVENTS.PUSHSTATE)
	window.dispatchEvent(navigationEvent)
}

function HomePage() {
	return (
		<>
			<h1>Home</h1>
			<p>Example page for create a React Router Clone.</p>
			<button onClick={() => navigate('/about')}>Go to About us</button>
		</>
	)
}

function AboutPage() {
	return (
		<>
			<h1>About</h1>
			<p>Hey im Nando, and im creating a React Router Clone.</p>
			<button onClick={() => navigate('/')}>Go Home</button>
		</>
	)
}

function App() {
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

	return (
		<main>
			{currentPath === '/' && <HomePage />}
			{currentPath === '/about' && <AboutPage />}
		</main>
	)
}

export default App
