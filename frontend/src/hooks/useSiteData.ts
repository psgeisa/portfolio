import { useEffect, useState } from 'react'
import { useSiteDataOverride } from './siteDataContext'
import { apiFetch } from '../lib/api'

let cache: any | null = null
let inflight: Promise<any> | null = null

function load(): Promise<any> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = apiFetch('/api/content/site')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        cache = data
        return data
      })
      .catch(() => null)
  }
  return inflight
}

export function useSiteData<T = any>(): T | null {
  const override = useSiteDataOverride()
  const [data, setData] = useState<any | null>(cache)

  useEffect(() => {
    if (override || cache) return
    load().then(setData)
  }, [override])

  if (override) return override

  return data
}
