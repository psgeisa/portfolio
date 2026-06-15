import { useLayoutEffect, useRef, useState } from 'react'
import type { DevApp } from '../../data/devData'
import AppCard from './AppCard'

export default function AppGrid({ apps, equalHeight }: { apps: DevApp[]; equalHeight?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [minHeight, setMinHeight] = useState<number>()

  useLayoutEffect(() => {
    if (!equalHeight) {
      setMinHeight(undefined)
      return
    }

    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const wrappers = Array.from(container.children) as HTMLElement[]
      let tallest = 0
      for (const wrapper of wrappers) {
        // clear the fixed height so it reflects the card's natural content height
        wrapper.style.height = ''
        tallest = Math.max(tallest, wrapper.offsetHeight)
      }
      setMinHeight(tallest)
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(container)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [apps, equalHeight])

  return (
    <div ref={containerRef} className="mt-3 grid gap-4 sm:grid-cols-2">
      {apps.map((app) => (
        <div key={app.name} style={minHeight ? { height: minHeight } : undefined} className="flex">
          <AppCard app={app} fillHeight={minHeight !== undefined} />
        </div>
      ))}
    </div>
  )
}
