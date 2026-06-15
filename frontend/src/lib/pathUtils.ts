export type PathKey = string | number

export function getAt(obj: any, path: PathKey[]): any {
  return path.reduce((acc, key) => (acc == null ? acc : acc[key as any]), obj)
}

export function setAt(obj: any, path: PathKey[], value: any): any {
  if (path.length === 0) return value
  const [key, ...rest] = path
  if (Array.isArray(obj)) {
    const copy = [...obj]
    copy[key as number] = setAt(obj[key as number], rest, value)
    return copy
  }
  return { ...(obj || {}), [key]: setAt(obj?.[key], rest, value) }
}

export function removeAt(obj: any, path: PathKey[]): any {
  if (path.length === 1) {
    const key = path[0]
    if (Array.isArray(obj)) return obj.filter((_, i) => i !== key)
    const copy = { ...obj }
    delete copy[key]
    return copy
  }
  const [key, ...rest] = path
  return setAt(obj, [key], removeAt(obj?.[key as any], rest))
}

export function insertAt(obj: any, path: PathKey[], item: any): any {
  const arr = getAt(obj, path) || []
  return setAt(obj, path, [...arr, item])
}
