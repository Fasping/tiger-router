import { Suspense, lazy } from 'react'

import './App.css'

import SearchPage from './pages/Search'
import Page404 from './pages/Page404'

import { Router, Route } from './index'

const LazyHomePage = lazy(() => import('./pages/Home'))
const LazyAboutPage = lazy(() => import('./pages/About'))

function App() {
	return (
		<main>
			<Suspense fallback={<div>Loading ...</div>}>
				<Router>
					<Route path='/' element={<LazyHomePage />} />
					<Route path='/about' element={<LazyAboutPage />} />
					<Route path='/:lang/about' element={<LazyAboutPage />} />
					<Route path='/search/:query' element={<SearchPage />} />
				</Router>
			</Suspense>
		</main>
	)
}

export default App
