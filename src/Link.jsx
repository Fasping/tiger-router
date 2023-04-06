import { EVENTS } from './consts'

export function navigate(href) {
	window.history.pushState({}, '', href)
	// create custom event
	const navigationEvent = new Event(EVENTS.PUSHSTATE)
	window.dispatchEvent(navigationEvent)
}

export function Link({ target, to, ...props }) {
	const handelClick = event => {
		const isMainEvent = event.button === 0 // primary click
		const isModifiedEvent =
			event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
		const isManageableEvent = target === undefined || target === '_self'

		if (isMainEvent && isManageableEvent && !isModifiedEvent) {
			event.preventDefault()
			navigate(to) // navigation w SPA
		}
	}

	return <a onClick={handelClick} href={to} target={target} {...props} />
}
