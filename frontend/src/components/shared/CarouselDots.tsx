type Props = {
  count: number
  active: number
  onSelect: (index: number) => void
}

export default function CarouselDots({ count, active, onSelect }: Props) {
  if (count <= 1) return null
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Item ${index + 1}`}
          onClick={() => onSelect(index)}
          className={`h-2 rounded-full transition-all ${
            index === active ? 'w-6 bg-emerald-400' : 'w-2 bg-emerald-400/30 hover:bg-emerald-400/50'
          }`}
        />
      ))}
    </div>
  )
}
