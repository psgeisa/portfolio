import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Eye, LogOut, Save, Send } from 'lucide-react'
import FieldEditor from '../components/admin/FieldEditor'
import { EditContext } from '../hooks/editContext'
import { SiteDataOverrideContext } from '../hooks/siteDataContext'
import { getAt, setAt, removeAt, insertAt, type PathKey } from '../lib/pathUtils'
import HomeExperience, { type PerfilData } from '../components/home/HomeExperience'
import { apiFetch } from '../lib/api'

type Block = {
  key: string
  label: string
}

const BASE_BLOCKS: Block[] = [
  { key: '__about', label: 'Sobre mim / Perfis' },
  { key: '__cv', label: 'CVs' },
  { key: 'finops', label: 'FinOps' },
  { key: 'dev', label: 'Developer' },
  { key: 'dados', label: 'Data Science' },
]

export default function AdminDashboard() {
  const [site, setSite] = useState<any>(null)
  const [draft, setDraft] = useState<any>(null)
  const [cvData, setCvData] = useState<any>(null)
  const [profileData, setProfileData] = useState<PerfilData | null>(null)
  const [selected, setSelected] = useState<string>('__about')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [hideConfirm, setHideConfirm] = useState<{ key: string; label: string; hidden: boolean } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadAdmin = async () => {
      const authRes = await apiFetch('/api/admin/me')
      if (authRes.status === 401) {
        navigate('/admin/login')
        return
      }
      if (!authRes.ok) {
        setLoading(false)
        return
      }

      const [published, draftData, cvBlock, publicProfile] = await Promise.all([
        apiFetch('/api/content/site').then((res) => (res.ok ? res.json() : null)),
        apiFetch('/api/content/site_draft').then((res) => (res.ok ? res.json() : null)),
        apiFetch('/api/content/cv_data').then((res) => (res.ok ? res.json() : null)),
        apiFetch('/api/perfil').then((res) => (res.ok ? res.json() : null)),
      ])
      setSite(published || {})
      setDraft(draftData || published || {})
      setCvData(cvBlock || {})
      setProfileData(publicProfile)
      setLoading(false)
    }

    loadAdmin().catch(() => setLoading(false))
  }, [navigate])

  const blocks: Block[] = draft
    ? [
        ...BASE_BLOCKS,
        ...Object.keys(draft.perfis || {})
          .filter((key) => !BASE_BLOCKS.some((b) => b.key === key))
          .map((key) => ({ key, label: draft.perfis[key]?.titulo || key })),
      ]
    : BASE_BLOCKS

  const handleAddProfile = () => {
    const id = window.prompt('Identificador do novo perfil (sem espaços, ex: "marketing"):')
    if (!id) return
    if (draft.perfis?.[id] || draft[id]) {
      window.alert('Já existe um perfil com esse identificador.')
      return
    }
    const titulo = window.prompt('Nome de exibição do perfil:', id) || id
    setDraft({
      ...draft,
      ordem: [...(draft.ordem || []), id],
      perfis: {
        ...(draft.perfis || {}),
        [id]: { titulo, resumo: '', skills: [], certificacoes: [] },
      },
      [id]: {
        hero: {
          eyebrow: titulo,
          title: titulo,
          subtitle: 'Subtítulo de apresentação do perfil.',
          quote: 'Aqui vc coloca sua experiência.',
          tags: ['Tag 1', 'Tag 2'],
        },
        pillarsTitle: 'Destaques',
        pillars: [
          { title: 'Destaque 1', items: ['Item de exemplo', 'Outro item'] },
          { title: 'Destaque 2', items: ['Item de exemplo'] },
        ],
        projectsTitle: 'Projetos',
        projects: [
          { nome: 'Projeto exemplo', descricao: 'aqui projetos' },
        ],
        filosofiaTitle: 'Filosofia de Trabalho',
        filosofia: {
          text: 'Aqui vc descreve sua filosofia de trabalho.',
          quote: 'Aqui vc coloca uma frase de impacto.',
        },
      },
    })
    setSelected(id)
  }

  const putBlock = async (blockId: string, data: any) => {
    return apiFetch(`/api/content/${blockId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  const postJson = async (url: string, data: any) => {
    return apiFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  const handleEnrichExperiences = async (perfil: string) => {
    setAiLoading(perfil)
    setStatus(`Gerando enriquecimento de experiências para ${perfil}...`)
    try {
      const res = await postJson('/api/admin/cv-ai/enrich-experiences', { perfil })
      if (res.status === 401) {
        navigate('/admin/login')
        return
      }
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus(body.error || 'Erro ao gerar enriquecimento de experiências.')
        return
      }
      setCvData(body.cv_data)
      if (body.errors?.length) {
        setStatus(`Enriquecimento gerado para ${perfil} com ${body.errors.length} erro(s). Veja o console.`)
        console.warn('Erros no enriquecimento de experiências:', body.errors)
      } else {
        setStatus(`Enriquecimento de experiências gerado para ${perfil}.`)
      }
    } finally {
      setAiLoading(null)
    }
  }

  const handleSave = async () => {
    if (selected === '__cv') {
      if (cvData === null) return
      setStatus('Salvando dados dos CVs...')
      const res = await putBlock('cv_data', cvData)
      if (res.status === 401) {
        navigate('/admin/login')
        return
      }
      setStatus(res.ok ? 'Dados dos CVs salvos.' : 'Erro ao salvar CVs.')
      return
    }

    if (draft === null) return
    setStatus('Salvando rascunho...')
    const res = await putBlock('site_draft', draft)
    if (res.status === 401) {
      navigate('/admin/login')
      return
    }
    setStatus(res.ok ? 'Rascunho salvo.' : 'Erro ao salvar.')
  }

  const handlePublish = async () => {
    if (selected === '__cv') {
      if (cvData === null) return
      setStatus('Publicando dados dos CVs...')
      const res = await putBlock('cv_data', cvData)
      if (res.status === 401) {
        navigate('/admin/login')
        return
      }
      setStatus(res.ok ? 'Dados dos CVs publicados.' : 'Erro ao publicar CVs.')
      return
    }

    if (draft === null) return
    setStatus('Publicando...')
    const draftRes = await putBlock('site_draft', draft)
    if (draftRes.status === 401) {
      navigate('/admin/login')
      return
    }
    const liveRes = await putBlock('site', draft)
    if (liveRes.ok && draftRes.ok) {
      setSite(draft)
      setStatus('Publicado com sucesso.')
    } else {
      setStatus('Erro ao publicar.')
    }
  }

  const handleToggleHidden = async (key: string, hidden: boolean) => {
    const updated = {
      ...draft,
      perfis: {
        ...(draft.perfis || {}),
        [key]: { ...(draft.perfis?.[key] || {}), hidden },
      },
    }
    setDraft(updated)
    setStatus(hidden ? 'Ocultando...' : 'Publicando...')
    const draftRes = await putBlock('site_draft', updated)
    if (draftRes.status === 401) {
      navigate('/admin/login')
      return
    }
    const liveRes = await putBlock('site', updated)
    if (liveRes.ok && draftRes.ok) {
      setSite(updated)
      setStatus(hidden ? 'Página ocultada do site.' : 'Página visível no site.')
    } else {
      setStatus('Erro ao atualizar.')
    }
  }

  const handleLogout = async () => {
    await apiFetch('/api/admin/logout', {
      method: 'POST',
    }).catch(() => null)
    navigate('/admin/login')
  }

  if (loading) return <main className="p-10 text-slate-300">Carregando...</main>

  const currentLabel = blocks.find((b) => b.key === selected)?.label
  const previewProfiles = profileData
    ? Object.fromEntries(
        [
          ...new Set([
            ...Object.keys(profileData.perfis || {}),
            ...Object.keys(draft?.perfis || {}),
          ]),
        ].map((key) => [
            key,
            {
              ...(profileData.perfis?.[key] || {}),
              ...(draft?.perfis?.[key] || {}),
            },
          ]),
      )
    : {}
  const previewData: PerfilData | null = profileData
    ? {
        ...profileData,
        ordem: draft?.ordem || profileData.ordem,
        perfis: previewProfiles,
      }
    : null

  const editCtx = {
    get: (path: PathKey[]) => getAt(draft, path),
    set: (path: PathKey[], value: any) => setDraft((d: any) => setAt(d, path, value)),
    remove: (path: PathKey[]) => setDraft((d: any) => removeAt(d, path)),
    insert: (path: PathKey[], item: any) => setDraft((d: any) => insertAt(d, path, item)),
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] font-sans text-slate-100">
      <header className="sticky top-0 z-[80] border-b border-white/10 bg-[#0a0c10]/95 shadow-xl shadow-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="mr-auto flex items-center gap-3">
            <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Admin
            </span>
            <select
              value={selected}
              onChange={(event) => {
                setStatus(null)
                setSelected(event.target.value)
              }}
              aria-label="Tela em edição"
              className="rounded-lg border border-white/10 bg-[#11151c] px-3 py-2 text-sm font-medium text-slate-200 outline-none focus:border-emerald-400/50"
            >
              {blocks.map((block) => (
                <option key={block.key} value={block.key}>
                  {block.label}{draft?.perfis?.[block.key]?.hidden ? ' (oculto)' : ''}
                </option>
              ))}
            </select>
            <span className="hidden items-center gap-1.5 text-xs text-slate-500 sm:inline-flex">
              <Eye size={14} />
              Prévia em tempo real
            </span>
          </div>

          {status && <span className="w-full text-xs text-slate-400 sm:w-auto sm:text-sm">{status}</span>}
          {selected !== '__about' && selected !== '__cv' && (
            <button
              onClick={() => {
                const hidden = !!draft?.perfis?.[selected]?.hidden
                setHideConfirm({ key: selected, label: currentLabel || selected, hidden: !hidden })
              }}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:border-white/20 hover:text-white"
            >
              {draft?.perfis?.[selected]?.hidden ? 'Mostrar página' : 'Ocultar página'}
            </button>
          )}
          <button
            onClick={handleAddProfile}
            className="rounded-lg border border-dashed border-white/20 px-3 py-2 text-sm text-slate-300 hover:border-emerald-400/40 hover:text-emerald-300"
          >
            + Perfil
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 hover:border-white/20 hover:text-white"
          >
            <Save size={15} />
            {selected === '__cv' ? 'Salvar dados privados' : 'Salvar'}
          </button>
          {selected !== '__cv' && (
            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-400/15"
            >
              <Send size={15} />
              Publicar
            </button>
          )}
          <button
            onClick={handleLogout}
            title="Sair"
            className="rounded-lg border border-white/10 p-2 text-slate-400 hover:border-white/20 hover:text-white"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <main>
        {selected === '__cv' ? (
              <div className="mx-auto max-w-5xl px-8 py-8">

                <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="text-base font-semibold text-white">Enriquecimento de experiências (IA)</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Para cada experiência do perfil, a IA gera <span className="font-medium text-slate-300">atuação</span>,{' '}
                    <span className="font-medium text-slate-300">trajetória</span>,{' '}
                    <span className="font-medium text-slate-300">entregas importantes</span> e{' '}
                    <span className="font-medium text-slate-300">resumo executivo</span>, com base na própria
                    experiência e em todo o conteúdo da página do perfil. Nenhum outro campo é alterado.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {Object.keys(cvData?.perfis || {}).map((perfil) => {
                      const busy = aiLoading === perfil
                      return (
                        <button
                          key={perfil}
                          type="button"
                          disabled={!!aiLoading}
                          onClick={() => handleEnrichExperiences(perfil)}
                          className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:border-emerald-400/50 hover:bg-emerald-400/15 disabled:opacity-50"
                        >
                          {busy ? `Gerando ${perfil}...` : `Gerar para ${perfil}`}
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {Object.keys(cvData?.perfis || {}).map((perfil) => (
                      <a
                        key={perfil}
                        href={`/cv/${perfil}?print=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                      >
                        <Download size={14} strokeWidth={1.75} />
                        Baixar PDF {perfil}
                      </a>
                    ))}
                  </div>

                  {Object.keys(cvData?.perfis || {}).map((perfil) => {
                    const items = (cvData?.experiencias || [])
                      .map((exp: any, index: number) => ({ exp, index, enr: exp?.enriquecimento_ia?.[perfil] }))
                      .filter((item: any) => item.enr)
                    if (items.length === 0) return null
                    return (
                      <div key={perfil} className="mt-5 space-y-3 border-t border-white/10 pt-5">
                        <p className="text-sm font-semibold text-emerald-300">{perfil}</p>
                        {items.map(({ exp, index, enr }: any) => {
                          const updateField = (field: string, value: any) => {
                            setCvData((prev: any) => {
                              const next = { ...prev }
                              next.experiencias = [...(next.experiencias || [])]
                              const expCopy = { ...next.experiencias[index] }
                              expCopy.enriquecimento_ia = { ...(expCopy.enriquecimento_ia || {}) }
                              expCopy.enriquecimento_ia[perfil] = {
                                ...(expCopy.enriquecimento_ia[perfil] || {}),
                                [field]: value,
                              }
                              next.experiencias[index] = expCopy
                              return next
                            })
                          }
                          return (
                            <div key={index} className="rounded-lg border border-white/10 bg-black/20 p-4">
                              <p className="text-xs font-medium text-slate-400">
                                #{index} {exp.cargo || ''} — {exp.funcao || ''} · {exp.instituicao || ''}
                              </p>

                              <label className="mt-2 block text-xs font-semibold text-slate-400">Atuação</label>
                              <textarea
                                value={enr.atuacao || ''}
                                onChange={(e) => updateField('atuacao', e.target.value)}
                                rows={2}
                                className="mt-1 w-full rounded-md border border-white/10 bg-black/30 p-2 text-sm text-slate-200"
                              />

                              <label className="mt-2 block text-xs font-semibold text-slate-400">Trajetória</label>
                              <textarea
                                value={enr.trajetoria || ''}
                                onChange={(e) => updateField('trajetoria', e.target.value)}
                                rows={2}
                                className="mt-1 w-full rounded-md border border-white/10 bg-black/30 p-2 text-sm text-slate-200"
                              />

                              <label className="mt-2 block text-xs font-semibold text-slate-400">
                                Entregas importantes (uma por linha)
                              </label>
                              <textarea
                                value={(enr.entregas_importantes || []).join('\n')}
                                onChange={(e) =>
                                  updateField(
                                    'entregas_importantes',
                                    e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
                                  )
                                }
                                rows={4}
                                className="mt-1 w-full rounded-md border border-white/10 bg-black/30 p-2 text-sm text-slate-200"
                              />

                              <label className="mt-2 block text-xs font-semibold text-slate-400">Em resumo</label>
                              <textarea
                                value={enr.em_resumo || ''}
                                onChange={(e) => updateField('em_resumo', e.target.value)}
                                rows={2}
                                className="mt-1 w-full rounded-md border border-white/10 bg-black/30 p-2 text-sm text-slate-200"
                              />
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>

                <FieldEditor value={cvData || {}} onChange={setCvData} />
              </div>
        ) : previewData ? (
          <EditContext.Provider value={editCtx}>
            <SiteDataOverrideContext.Provider value={draft}>
              <HomeExperience
                dados={previewData}
                ativo={selected === '__about' ? 'sobre' : selected}
                onAtivoChange={(key) => {
                  setStatus(null)
                  setSelected(key === 'sobre' ? '__about' : key)
                }}
              />
            </SiteDataOverrideContext.Provider>
          </EditContext.Provider>
        ) : (
          <p className="p-8 text-sm text-slate-400">Não foi possível carregar a prévia do site.</p>
        )}
      </main>

      {hideConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11151c] p-6 shadow-2xl shadow-black/40">
            <h3 className="text-lg font-semibold text-white">
              {hideConfirm.hidden ? 'Ocultar página' : 'Mostrar página'}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {hideConfirm.hidden ? (
                <>
                  <span className="font-medium text-slate-200">"{hideConfirm.label}"</span> vai sumir do
                  site para os visitantes. O conteúdo continua salvo e editável aqui no admin, e você pode
                  mostrá-lo novamente quando quiser.
                </>
              ) : (
                <>
                  <span className="font-medium text-slate-200">"{hideConfirm.label}"</span> vai voltar a
                  aparecer no site para os visitantes.
                </>
              )}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setHideConfirm(null)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleToggleHidden(hideConfirm.key, hideConfirm.hidden)
                  setHideConfirm(null)
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  hideConfirm.hidden
                    ? 'border border-amber-400/30 bg-amber-400/10 text-amber-300 hover:border-amber-400/50 hover:bg-amber-400/15'
                    : 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-400/15'
                }`}
              >
                {hideConfirm.hidden ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
