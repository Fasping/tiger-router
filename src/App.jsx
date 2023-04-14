import { Suspense, lazy } from 'react'

import './App.css'

import SearchPage from './pages/Search'
import Page404 from './pages/Page404'

import { Router } from './Router'
import { Route } from './Route'

const LazyHomePage = lazy(() => import('./pages/Home.jsx'))
const LazyAboutPage = lazy(() => import('./pages/About.jsx'))

const appRoutes = [
	{
		path: '/search/:query',
		Component: SearchPage,
	},
]

function App() {
	return (
		<main>
			<Suspense fallback={<div>Loading ...</div>}>
				<Router routes={appRoutes} defaulComponent={Page404}>
					<Route path='/' Component={LazyHomePage} />
					<Route path='/about' Component={LazyAboutPage} />
				</Router>
			</Suspense>
		</main>
	)
}

export default App
