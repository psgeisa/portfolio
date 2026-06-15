import { ArrowUp } from 'lucide-react'

export default function BackToTopButton() {
  return (
    <div className="border-t border-white/5 px-6 py-8 text-center sm:px-10 lg:px-16">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-emerald-400/40 hover:text-emerald-300"
      >
        <ArrowUp size={16} strokeWidth={1.75} />
        Voltar ao topo
      </button>
    </div>
  )
}
