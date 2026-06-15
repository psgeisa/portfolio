import type { Project } from '../../data/dadosData'
import ImpactBadge from './ImpactBadge'

export default function ProjectCard({ name, challenge, solution, benefits, useCases, technologies, impact, extraTag }: Project) {
  return (
    <article className="flex min-h-[560px] w-full shrink-0 snap-center flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-emerald-400/30 hover:bg-white/[0.05]">
      <h3 className="text-lg font-semibold text-white">{name}</h3>

      <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Desafio</p>
          <p className="mt-1.5 text-justify text-slate-300">{challenge}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Benefícios</p>
          <ul className="mt-1.5 space-y-1 text-slate-300">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/60" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Solução</p>
        <p className="mt-1.5 text-justify text-slate-300">{solution}</p>
      </div>

      {useCases && (
        <div className="mt-5 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Casos de Aplicação</p>
          <ul className="mt-1.5 grid gap-1 text-slate-300 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <li key={useCase} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/60" />
                {useCase}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-medium text-slate-300"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/5 pt-5">
        <ImpactBadge impact={impact} />
        {extraTag && (
          <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {extraTag}
          </span>
        )}
      </div>
    </article>
  )
}
