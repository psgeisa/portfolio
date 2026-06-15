import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { TechGroup } from '../../data/devData'
import CarouselDots from '../shared/CarouselDots'
import { useScrollEdges } from '../../hooks/useScrollEdges'

const GAP = 16

export default function TechStackCarousel({ groups }: { groups: TechGroup[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { canScrollLeft, canScrollRight, update } = useScrollEdges(scrollerRef, [groups.length])

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
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Anterior"
          className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-[#0a0c10] p-2 text-slate-300 transition-colors hover:border-emerald-400/40 hover:text-emerald-300 sm:-left-5"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {groups.map((group) => {
          const Icon = group.icon
          return (
            <div key={group.title} className="w-full shrink-0 snap-center lg:w-[32%]">
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-3 inline-flex rounded-xl border border-white/10 bg-white/5 p-2.5 text-emerald-300">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-semibold text-white">{group.title}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Próximo"
          className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-[#0a0c10] p-2 text-slate-300 transition-colors hover:border-emerald-400/40 hover:text-emerald-300 sm:-right-5"
        >
          <ChevronRight size={18} />
        </button>
      )}

      <CarouselDots count={groups.length} active={active} onSelect={scrollToIndex} />
    </div>
  )
}
