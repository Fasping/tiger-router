/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-tabs */

import './App.css'
import { useEffect, useState } from 'react'
import { EVENTS } from './consts'
import HomePage from './pages/Home'
import AboutPage from './pages/About'

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
