import './App.css'

import { Router } from './Router'

import HomePage from './pages/Home'
import AboutPage from './pages/About'
import { Page404 } from './pages/Page404'
import { Link } from './Link'

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
			<Router routes={appRoutes} defaulComponent={Page404} />
		</main>
	)
}

export default App
