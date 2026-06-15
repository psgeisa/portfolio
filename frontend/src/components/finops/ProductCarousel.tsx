import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '../../data/finopsData'
import ProductCard from './ProductCard'
import CarouselDots from '../shared/CarouselDots'
import { useScrollEdges } from '../../hooks/useScrollEdges'

interface ProductCarouselProps {
  products: Product[]
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { canScrollLeft, canScrollRight, update } = useScrollEdges(scrollerRef, [products.length])

  const scrollByCard = (direction: 1 | -1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    scroller.scrollBy({ left: direction * scroller.clientWidth, behavior: 'smooth' })
  }

  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    scroller.scrollTo({ left: index * scroller.clientWidth, behavior: 'smooth' })
  }

  const handleScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller || scroller.clientWidth === 0) return
    setActive(Math.round(scroller.scrollLeft / scroller.clientWidth))
    update()
  }

  return (
    <div className="relative mx-auto max-w-3xl">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Anterior"
          className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-[#0a0c10] p-2 text-slate-300 transition-colors hover:border-emerald-400/40 hover:text-emerald-300 sm:-left-14"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Próximo"
          className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-[#0a0c10] p-2 text-slate-300 transition-colors hover:border-emerald-400/40 hover:text-emerald-300 sm:-right-14"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <CarouselDots count={products.length} active={active} onSelect={scrollToIndex} />
    </div>
  )
}
