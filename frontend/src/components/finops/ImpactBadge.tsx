import { impactIcons, type ImpactType } from '../../data/finopsData'

interface ImpactBadgeProps {
  impact: ImpactType
}

export default function ImpactBadge({ impact }: ImpactBadgeProps) {
  const Icon = impactIcons[impact]

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
      <Icon size={14} strokeWidth={2} />
      {impact}
    </span>
  )
}
