import { useState } from 'react'
import type { DevApp } from '../../data/devData'

function BulletList({ items, dark, compact }: { items: string[]; dark?: boolean; compact?: boolean }) {
  const textClass = dark || compact ? 'text-[11px] leading-snug' : 'text-xs'
  return (
    <ul className={`mt-2 space-y-1 ${textClass} ${dark ? 'text-slate-700' : 'text-slate-400'}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${dark ? 'bg-emerald-600/70' : 'bg-emerald-400/60'}`} />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function AppCard({ app, fillHeight }: { app: DevApp; fillHeight?: boolean }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`w-full [perspective:1000px] ${fillHeight ? 'h-full' : ''}`}
      onClick={() => app.back && setFlipped((f) => !f)}
    >
      <div
        className={`relative w-full transition-transform duration-500 [transform-style:preserve-3d] ${fillHeight ? 'h-full' : ''}`}
        style={{ transform: flipped ? 'rotateY(180deg)' : 'none' }}
      >
        <div
          className={`relative flex w-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-3 pb-9 sm:p-4 sm:pb-10 [backface-visibility:hidden] ${fillHeight ? 'h-full' : ''} ${
            app.back ? 'cursor-pointer' : ''
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-white">{app.name}</p>
            {app.items && <BulletList items={app.items} />}
            {app.groups &&
              app.groups.map((group) => (
                <div key={group.heading} className="mt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {group.heading}
                  </p>
                  <BulletList items={group.items} compact />
                </div>
              ))}
          </div>

          {app.back && (
            <p className="absolute bottom-3 right-3 text-right text-[10px] italic text-slate-500 sm:bottom-4 sm:right-4">
              clique para detalhes
            </p>
          )}
        </div>

        {app.back && (
          <div
            className="absolute inset-0 h-full cursor-pointer overflow-y-auto rounded-xl border border-slate-300 bg-slate-100 p-3 sm:p-4 [backface-visibility:hidden]"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <p className="text-xs font-semibold text-slate-900">{app.name}</p>

            <div className="mt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Problema</p>
              <p className="mt-1 text-[11px] leading-snug text-slate-700 text-justify">{app.back.problema}</p>
            </div>

            <div className="mt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Benefícios da Solução</p>
              <BulletList items={app.back.beneficios} dark />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
