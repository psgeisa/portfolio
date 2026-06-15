import { journeySteps as staticSteps } from '../../data/finopsData'
import { useSiteData } from '../../hooks/useSiteData'
import { resolveIcon } from '../../lib/icons'
import { Editable, AddItemButton } from '../admin/Editable'
import { Eye } from 'lucide-react'

export default function Timeline() {
  const site = useSiteData()
  const steps = site?.finops?.journeySteps ?? staticSteps

  return (
    <>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step: any, index: number) => {
          const Icon = typeof step.icon === 'string' ? resolveIcon(step.icon, Eye) : step.icon
          return (
            <Editable key={step.title} path={['finops', 'journeySteps', index]} removable label="Etapa">
              <li className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-sm font-semibold text-emerald-300">
                    {index + 1}
                  </span>
                  <Icon size={20} strokeWidth={1.75} className="text-emerald-300" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{step.description}</p>
              </li>
            </Editable>
          )
        })}
      </ol>
      <div className="mt-4 flex justify-center">
        <AddItemButton
          path={['finops', 'journeySteps']}
          label="+ Adicionar etapa"
          template={{ title: 'Nova etapa', description: '', icon: 'Eye' }}
        />
      </div>
    </>
  )
}
