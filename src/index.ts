/**
 * tiger-router — minimalist routing for React.
 *
 * Components: Router, Routes, Route, Link, NavLink, Navigate
 * Hooks:      useLocation, useNavigate, useParams, useSearchParams, useMatch, useRouter
 * Core:       createHistory, matchRoute, rankMatches (framework-agnostic)
 */
export {
    type CreateHistoryOptions,
    createHistory,
    type HistoryMode,
    type NavigateOptions,
    type RouterHistory,
} from './core/history'
export {
    joinPaths,
    parsePath,
    type RouterLocation,
    resolvePath,
    toHref,
} from './core/location'
export {
    matchRoute,
    type RouteMatch,
    type RouteParams,
    rankMatches,
} from './core/matcher'
export {
    type NavigateFunction,
    useLocation,
    useMatch,
    useNavigate,
    useParams,
    useRouter,
    useSearchParams,
} from './react/hooks'
export { Link, type LinkProps } from './react/Link'
export { Navigate, type NavigateProps } from './react/Navigate'
export { NavLink, type NavLinkProps, type NavLinkRenderProps } from './react/NavLink'
export { Route, type RouteProps } from './react/Route'
export { Router, type RouterProps } from './react/Router'
export { Routes, type RoutesProps } from './react/Routes'
