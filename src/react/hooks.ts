import { useContext } from 'react'
import { RouterContext } from './Router'
import { matchRoute } from '../core/matcher'

export function useLocation() {
    const { location } = useContext(RouterContext)
    return location
}

export function useNavigate() {
    const { navigate } = useContext(RouterContext)
    return navigate
}

export function useParams() {
    const { params } = useContext(RouterContext)
    return params
}

export function useRouteMatch(path: string) {
    const location = useLocation()
    return matchRoute(path, location) !== null
}
