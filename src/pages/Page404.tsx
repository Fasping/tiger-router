import { Link } from '../Link'

export default function Page404() {
	return (
		<>
			<div>
				<h1>This is NOT fine</h1>
				<img
					src='https://media.tenor.com/HYBKG4ZNb5AAAAAC/everything-is-fine-itsfine.gif'
					alt='Gif of the dog on fire of this is fine'
				/>
			</div>
			<Link to='/'>Go to home</Link>
		</>
	)
}
