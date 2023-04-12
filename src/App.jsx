import './App.css'

import HomePage from './pages/Home'
import AboutPage from './pages/About'
import SearchPage from './pages/Search'
import Page404 from './pages/Page404'

import { Router } from './Router'
import { Route } from './Route'

const appRoutes = [
	{
		path: '/search/:query',
		Component: SearchPage,
	},
]

function App() {
	return (
		<main>
			<Router routes={appRoutes} defaulComponent={Page404}>
				<Route path='/' Component={HomePage} />
				<Route path='/about' Component={AboutPage} />
			</Router>
		</main>
	)
}

export default App
