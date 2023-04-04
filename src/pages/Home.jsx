/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-tabs */
import { Link } from '../Link'

export default function HomePage() {
	return (
		<>
			<h1>Home</h1>
			<p>Example page for create a React Router Clone.</p>
			<Link to='/about'>Go to About us</Link>
		</>
	)
}
