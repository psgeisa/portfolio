import { useState, type ReactNode } from 'react'
import { useEdit } from '../../hooks/editContext'
import type { PathKey } from '../../lib/pathUtils'
import FieldEditor from './FieldEditor'

type Props = {
  path: PathKey[]
  removable?: boolean
  children: ReactNode
  label?: string
}

export function Editable({ path, removable, children, label }: Props) {
  const edit = useEdit()
  const [open, setOpen] = useState(false)

  if (!edit) return <>{children}</>

  return (
    <div className="group/edit relative rounded-lg outline-2 outline-offset-2 outline-transparent transition-all hover:outline-emerald-400/60 hover:outline-dashed">
      {children}

      <div className="pointer-events-none absolute right-1 top-1 z-30 flex gap-1 opacity-0 transition-opacity group-hover/edit:pointer-events-auto group-hover/edit:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setOpen((v) => !v)
          }}
          className="rounded-md border border-emerald-400/40 bg-[#0a0c10] px-2 py-1 text-xs text-emerald-300 shadow hover:bg-emerald-400/10"
          title="Editar"
        >
          ✎ Editar
        </button>
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm('Remover este item?')) edit.remove(path)
            }}
            className="rounded-md border border-red-400/40 bg-[#0a0c10] px-2 py-1 text-xs text-red-300 shadow hover:bg-red-400/10"
            title="Remover"
          >
            🗑
          </button>
        )}
      </div>

      {open && (
        <div className="absolute right-0 top-8 z-40 w-[360px] max-w-[90vw] rounded-xl border border-emerald-400/30 bg-[#0a0c10] p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-300">{label || 'Editar'}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400 hover:text-slate-200"
            >
              Fechar
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            <FieldEditor value={edit.get(path)} onChange={(v) => edit.set(path, v)} />
          </div>
        </div>
      )}
    </div>
  )
}

type AddProps = {
  path: PathKey[]
  template: any
  label?: string
}

export function AddItemButton({ path, template, label = '+ Adicionar item' }: AddProps) {
  const edit = useEdit()
  if (!edit) return null
  return (
    <button
      type="button"
      onClick={() => edit.insert(path, typeof template === 'function' ? template() : template)}
      className="rounded-lg border border-dashed border-emerald-400/40 px-4 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-400/10"
    >
      {label}
    </button>
  )
}
