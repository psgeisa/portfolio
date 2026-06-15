import { useState } from 'react'
import { X } from 'lucide-react'
import type { Pillar } from '../../data/finopsData'

interface PillarCardProps extends Pillar {
  index: number
}

export default function PillarCard({ title, icon: Icon, items, details, index }: PillarCardProps) {
  const [open, setOpen] = useState(false)
  const flippable = Boolean(details)
  const idxClass = `idx-${index} idx-${index % 2 === 0 ? 'even' : 'odd'}`

  return (
    <div className="relative h-[300px]">
      <div className={`pillar-card ${idxClass} ${open ? 'open' : ''}`}>
        <div
          className={`absolute inset-0 flex h-full w-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-opacity duration-200 hover:border-emerald-400/30 hover:bg-white/[0.05] ${
            flippable ? 'cursor-pointer' : ''
          } ${open ? 'invisible opacity-0' : 'visible opacity-100'}`}
          onClick={() => flippable && setOpen(true)}
        >
          <div className="mb-4 inline-flex self-start rounded-xl border border-white/10 bg-white/5 p-2.5 text-emerald-300">
            <Icon size={22} strokeWidth={1.75} />
          </div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/60" />
                {item}
              </li>
            ))}
          </ul>
          {flippable && (
            <span className="mt-auto pt-3 text-right text-xs text-slate-500">clique para detalhes</span>
          )}
        </div>

        {details && (
          <div
            className={`absolute inset-0 h-full w-full overflow-y-auto rounded-2xl border border-emerald-400/30 bg-slate-200 p-3 text-left text-slate-800 transition-all duration-300 sm:p-6 ${
              open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
            }`}
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              className="absolute right-2 top-2 text-slate-500 transition-colors hover:text-slate-800 sm:right-4 sm:top-4"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
            >
              <X size={16} className="sm:hidden" />
              <X size={18} className="hidden sm:block" />
            </button>
            <h3 className="pr-6 text-sm font-semibold text-slate-900 sm:text-base">{title}</h3>
            <div className="mt-2 space-y-2 text-xs leading-snug text-slate-700 sm:mt-3 sm:space-y-3 sm:text-sm sm:leading-relaxed">
              {details.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1 sm:mt-4 sm:gap-1.5">
              {details.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600 sm:px-2 sm:py-1 sm:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
