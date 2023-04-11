import './App.css'

import { Router } from './Router'

import HomePage from './pages/Home'
import AboutPage from './pages/About'
import SearchPage from './pages/Search'

import { Page404 } from './pages/Page404'

const appRoutes = [
	{
		path: '/',
		Component: HomePage,
	},
	{
		path: '/about',
		Component: AboutPage,
	},
	{
		path: '/search/:query',
		Component: SearchPage,
	},
]

function App() {
	return (
		<main>
			<Router routes={appRoutes} defaulComponent={Page404} />
		</main>
	)
}

export default App
