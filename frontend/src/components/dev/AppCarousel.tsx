import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { DevApp } from '../../data/devData'
import AppCard from './AppCard'
import CarouselDots from '../shared/CarouselDots'
import { useScrollEdges } from '../../hooks/useScrollEdges'

const GAP = 16

export default function AppCarousel({ apps, height = 460 }: { apps: DevApp[]; height?: number }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { canScrollLeft, canScrollRight, update } = useScrollEdges(scrollerRef, [apps.length])

  const scrollByCard = (direction: 1 | -1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    scroller.scrollBy({ left: direction * scroller.clientWidth, behavior: 'smooth' })
  }

  const itemWidth = () => {
    const scroller = scrollerRef.current
    const first = scroller?.children[0] as HTMLElement | undefined
    return (first?.offsetWidth ?? 0) + GAP
  }

  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    scroller.scrollTo({ left: index * itemWidth(), behavior: 'smooth' })
  }

  const handleScroll = () => {
    const width = itemWidth()
    if (!scrollerRef.current || width === 0) return
    setActive(Math.round(scrollerRef.current.scrollLeft / width))
    update()
  }

  return (
    <div className="relative mt-3">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Anterior"
          className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-[#0a0c10]/75 p-2 text-slate-300/80 transition-colors hover:border-emerald-400/40 hover:bg-[#0a0c10] hover:text-emerald-300 sm:-left-5"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {apps.map((app) => (
          <div key={app.name} className="w-full shrink-0 snap-center lg:w-[32%]" style={{ height }}>
            <AppCard app={app} fillHeight />
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Próximo"
          className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-[#0a0c10]/75 p-2 text-slate-300/80 transition-colors hover:border-emerald-400/40 hover:bg-[#0a0c10] hover:text-emerald-300 sm:-right-5"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {(canScrollLeft || canScrollRight) && (
        <CarouselDots count={apps.length} active={active} onSelect={scrollToIndex} />
      )}
    </div>
  )
}
