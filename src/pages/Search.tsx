import { useEffect } from 'react'
import { useParams } from '../index'

export default function SearchPage() {
	const params = useParams()
	useEffect(() => {
		document.title = `Has buscado ${params.query}`
	}, [])

	return <h1>you've been search {params.query}</h1>
}
