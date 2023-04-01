/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-tabs */

import './App.css'
import { useEffect, useState } from 'react'

const NAVIGATION_EVENT = 'pushstate'

function navigate(href) {
	window.history.pushState({}, '', href)
	// create custom event
	const navigationEvent = new Event(NAVIGATION_EVENT)
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

		window.addEventListener(NAVIGATION_EVENT, onLocationChange)
		window.addEventListener('popstate', onLocationChange)

		return () => {
			window.removeEventListener(NAVIGATION_EVENT, onLocationChange)
			window.removeEventListener('popstate', onLocationChange)
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
