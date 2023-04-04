/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-tabs */

import './App.css'

import { Router } from './Router'

import HomePage from './pages/Home'
import AboutPage from './pages/About'

const appRoutes = [
	{
		path: '/',
		Component: HomePage,
	},
	{
		path: '/about',
		Component: AboutPage,
	},
]

function App() {
	return (
		<main>
			<Router routes={appRoutes} />
		</main>
	)
}

export default App
