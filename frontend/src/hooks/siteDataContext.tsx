import { createContext, useContext } from 'react'

export const SiteDataOverrideContext = createContext<any | null>(null)

export function useSiteDataOverride() {
  return useContext(SiteDataOverrideContext)
}
