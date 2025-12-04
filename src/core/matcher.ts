export function matchRoute(
    pattern: string,
    path: string
): { params: Record<string, string> } | null {
    const patternParts = pattern.split('/').filter(Boolean)
    const pathParts = path.split('/').filter(Boolean)

    if (patternParts.length !== pathParts.length) {
        return null
    }

    const params: Record<string, string> = {}

    for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i]
        const pathPart = pathParts[i]

        if (patternPart.startsWith(':')) {
            const paramName = patternPart.slice(1)
            params[paramName] = pathPart
        } else if (patternPart !== pathPart) {
            return null
        }
    }

    return { params }
}
