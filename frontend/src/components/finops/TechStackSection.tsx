import { techGroups as staticGroups } from '../../data/finopsData'
import { useSiteData } from '../../hooks/useSiteData'
import { resolveIcon } from '../../lib/icons'
import { Editable, AddItemButton } from '../admin/Editable'
import { Database } from 'lucide-react'

export default function TechStackSection() {
  const site = useSiteData()
  const groups = site?.finops?.techGroups ?? staticGroups

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group: any, index: number) => {
        const Icon = typeof group.icon === 'string' ? resolveIcon(group.icon, Database) : group.icon
        return (
          <Editable key={group.title} path={['finops', 'techGroups', index]} removable label="Grupo de tecnologias">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-3 inline-flex rounded-xl border border-white/10 bg-white/5 p-2.5 text-emerald-300">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-semibold text-white">{group.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
                {group.items.map((item: string) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Editable>
        )
      })}
      <div className="flex items-center justify-center sm:col-span-2 lg:col-span-4">
        <AddItemButton
          path={['finops', 'techGroups']}
          label="+ Adicionar grupo"
          template={{ title: 'Novo grupo', icon: 'Database', items: ['Item de exemplo'] }}
        />
      </div>
    </div>
  )
}
