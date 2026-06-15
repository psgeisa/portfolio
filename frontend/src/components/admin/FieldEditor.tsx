type Props = {
  value: any
  onChange: (value: any) => void
  label?: string
  depth?: number
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-400/50'

const labelClass = 'mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400'

function prettyLabel(key: string) {
  return key.replace(/_/g, ' ')
}

function emptyLike(value: any): any {
  if (typeof value === 'string') return ''
  if (typeof value === 'number') return 0
  if (typeof value === 'boolean') return false
  if (Array.isArray(value)) return value.length ? emptyLike(value[0]) : ''
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).map((k) => [k, emptyLike(value[k])]))
  }
  return ''
}

export default function FieldEditor({ value, onChange, label, depth = 0 }: Props) {
  if (typeof value === 'string') {
    const long = value.length > 80 || value.includes('\n')
    return (
      <div>
        {label && <label className={labelClass}>{prettyLabel(label)}</label>}
        {long ? (
          <textarea
            className={`${inputClass} min-h-[80px]`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>
    )
  }

  if (typeof value === 'number') {
    return (
      <div>
        {label && <label className={labelClass}>{prettyLabel(label)}</label>}
        <input
          type="number"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        {label && prettyLabel(label)}
      </label>
    )
  }

  if (Array.isArray(value)) {
    const isStringArray = value.every((v) => typeof v === 'string')

    return (
      <div>
        {label && <label className={labelClass}>{prettyLabel(label)}</label>}
        <div className="flex flex-col gap-2">
          {value.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              {isStringArray ? (
                <input
                  className={inputClass}
                  value={item}
                  onChange={(e) => {
                    const copy = [...value]
                    copy[index] = e.target.value
                    onChange(copy)
                  }}
                />
              ) : (
                <div className="flex-1 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <FieldEditor
                    value={item}
                    depth={depth + 1}
                    onChange={(v) => {
                      const copy = [...value]
                      copy[index] = v
                      onChange(copy)
                    }}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="mt-1 shrink-0 rounded-lg border border-white/10 px-2 py-1 text-xs text-red-300 hover:border-red-400/40"
                title="Remover"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange([...value, emptyLike(value.length ? value[0] : '')])}
            className="self-start rounded-lg border border-dashed border-white/20 px-3 py-1.5 text-xs text-slate-400 hover:border-emerald-400/40 hover:text-emerald-300"
          >
            + Adicionar item
          </button>
        </div>
      </div>
    )
  }

  if (value && typeof value === 'object') {
    if (depth === 0) {
      return (
        <div className="flex flex-col gap-6">
          {Object.entries(value).map(([key, val]) => (
            <section key={key} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="mb-4 text-base font-semibold text-emerald-300">{prettyLabel(key)}</h3>
              <FieldEditor
                value={val}
                depth={1}
                onChange={(v) => onChange({ ...value, [key]: v })}
              />
            </section>
          ))}
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        {label && <h4 className="text-sm font-semibold text-slate-300">{prettyLabel(label)}</h4>}
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className={Array.isArray(val) || (val && typeof val === 'object') ? 'sm:col-span-2' : ''}>
              <FieldEditor
                value={val}
                label={key}
                depth={depth + 1}
                onChange={(v) => onChange({ ...value, [key]: v })}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {label && <label className={labelClass}>{prettyLabel(label)}</label>}
      <input
        className={inputClass}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
