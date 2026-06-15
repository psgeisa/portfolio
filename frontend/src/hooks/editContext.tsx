import { createContext, useContext } from 'react'
import type { PathKey } from '../lib/pathUtils'

export type EditCtx = {
  get: (path: PathKey[]) => any
  set: (path: PathKey[], value: any) => void
  remove: (path: PathKey[]) => void
  insert: (path: PathKey[], item: any) => void
}

export const EditContext = createContext<EditCtx | null>(null)

export function useEdit() {
  return useContext(EditContext)
}
