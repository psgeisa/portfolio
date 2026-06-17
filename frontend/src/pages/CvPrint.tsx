import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { User, Phone, Layers, Award, Zap, GraduationCap, BookOpen, type LucideIcon } from 'lucide-react'
import profilePhoto from '../assets/profile.png'
import { apiFetch } from '../lib/api'

interface Experiencia {
  cargo: string
  funcao?: string
  instituicao: string
  setor?: string
  ano_inicio?: number | string
  ano_inicio_instituicao?: number | string
  ano_fim?: number | string
  periodo: string
  descricao?: string
  enriquecimento?: {
    atuacao?: string
    trajetoria?: string
    entregas_importantes?: string[]
    em_resumo?: string
  } | null
}

interface Certificacao {
  titulo: string
  instituicao?: string
  ano?: string | number
}

interface Educacao {
  curso: string
  instituicao?: string
  categoria?: string
  duracao_num?: string | number
  duracao_tempo?: string
  status?: string
  ano_fim?: string
}

interface CvData {
  nome: string
  idade: number
  resumo_formacao?: string
  telefone?: string
  email?: string
  location?: string
  linkedin?: string
  linkedin_label?: string
  github?: string
  role?: string
  filosofia?: string
  habilidades: string[]
  habilidades_grupos: { title: string; items: string[] }[]
  competencias: string[]
  experiencias: Experiencia[]
  certificacoes: Certificacao[]
  educacao: Educacao[]
}

export default function CvPrint() {
  const { perfil = 'finops' } = useParams()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<CvData | null>(null)

  useEffect(() => {
    apiFetch(`/api/cv-data?perfil=${perfil}`)
      .then((res) => res.json())
      .then(setData)
  }, [perfil])

  // Abre o diálogo de impressão automaticamente quando chamado com ?print=1,
  // após os dados e as imagens carregarem.
  useEffect(() => {
    if (!data || searchParams.get('print') !== '1') return
    const images = Array.from(document.images)
    const ready = Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve()
              img.onerror = () => resolve()
            })
      )
    )
    let cancelled = false
    ready.then(() => {
      if (!cancelled) setTimeout(() => window.print(), 300)
    })
    return () => {
      cancelled = true
    }
  }, [data, searchParams])

  if (!data) return null

  const isFinops = perfil === 'finops'
  const isDev = perfil === 'dev'
  const asideClasses = isFinops
    ? 'w-[68mm] shrink-0 bg-[#1b2733] px-6 py-6 text-slate-200 [&_.text-slate-700]:text-white [&_.text-slate-600]:text-slate-300 [&_.text-emerald-600]:text-[#2bbfa4]'
    : isDev
      ? 'w-[68mm] shrink-0 bg-[#0a0c10] px-6 py-6 text-slate-300 [&_.text-slate-700]:text-white [&_.text-slate-600]:text-slate-400 [&_.text-emerald-600]:text-emerald-400 [&_.border-emerald-400\\/50]:border-emerald-400/40'
      : 'w-[68mm] shrink-0 bg-neutral-800 px-6 py-6 text-slate-200 [&_.text-slate-700]:text-white [&_.text-slate-600]:text-slate-300 [&_.text-emerald-600]:text-emerald-400'

  return (
    <>
      <style>{`html, body { background: #fff; } @media print { .cv-print-btn { display: none !important; } }`}</style>
      <button
        type="button"
        onClick={() => window.print()}
        className="cv-print-btn fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-lg transition-colors hover:bg-emerald-500"
      >
        Salvar PDF / Imprimir
      </button>
      <div className="cv-page mx-auto flex min-h-screen w-full max-w-[210mm] bg-white font-sans text-slate-700">
      <aside className={asideClasses}>
        <img
          src={profilePhoto}
          alt={data.nome}
          className="mx-auto mb-3 h-[180px] w-[180px] rounded-full border-2 border-emerald-400/50 object-cover"
        />

        <CvSection title="Sobre mim" icon={User}>
          <p>{data.idade} anos</p>
          {data.resumo_formacao && <p>{data.resumo_formacao}</p>}
        </CvSection>

        <CvSection title="Contato" icon={Phone}>
          {data.linkedin && (
            <a href={data.linkedin} className="text-emerald-600 break-all">
              {data.linkedin_label}
            </a>
          )}
          {data.telefone && <p>{data.telefone}</p>}
          {data.email && <p>{data.email}</p>}
          {data.github && (
            <a href={data.github} className="break-all text-emerald-600">
              {data.github}
            </a>
          )}
          {data.location && <p>{data.location}</p>}
        </CvSection>

        <CvSection title="Competências" icon={Layers}>
          <ul className="space-y-0.5">
            {data.competencias.map((item) => (
              <li key={item}>▪ {item}</li>
            ))}
          </ul>
        </CvSection>

        <CvSection title="Certificações" icon={Award}>
          <div className="space-y-1.5">
            {data.certificacoes
              .filter((cert) => cert.instituicao !== 'LinkedIn')
              .map((cert, i) => (
                <div key={i} className="break-inside-avoid">
                  <p className="text-[11px] font-semibold text-slate-700">{cert.titulo}</p>
                  <p className="text-[11px]">{cert.instituicao} · {cert.ano}</p>
                </div>
              ))}
          </div>
          {data.certificacoes.some((cert) => cert.instituicao === 'LinkedIn') && (
            <>
              <hr className="mt-[2.56px] mb-[1.92px] border-transparent" />
              <p className="mb-1.5 pl-3 flex items-center gap-1 text-[11px] uppercase italic text-slate-700">
                <Zap size={10} className="shrink-0" />
                Certificações rápidas
              </p>
              <div className="space-y-1.5 pl-3">
                {data.certificacoes
                  .filter((cert) => cert.instituicao === 'LinkedIn')
                  .map((cert, i) => (
                    <div key={i} className="break-inside-avoid">
                      <p className="text-[11px] font-semibold text-slate-700">{cert.titulo}</p>
                      <p className="text-[11px]">{cert.instituicao} · {cert.ano}</p>
                    </div>
                  ))}
              </div>
            </>
          )}
        </CvSection>

        <CvSection title="Educação" icon={GraduationCap}>
          <div className="space-y-1.5">
            {data.educacao
              .filter((edu) => edu.categoria !== 'curso')
              .map((edu, i) => (
                <div key={i} className="break-inside-avoid">
                  <p className="text-[11px] font-semibold text-slate-700">{edu.curso}</p>
                  <p className="text-[11px]">{edu.instituicao} · {edu.ano_fim}</p>
                </div>
              ))}
          </div>
          {data.educacao.some((edu) => edu.categoria === 'curso') && (
            <>
              <hr className="mt-[2.56px] mb-[1.92px] border-transparent" />
              <p className="mb-1.5 pl-3 flex items-center gap-1 text-[11px] uppercase italic text-slate-700">
                <BookOpen size={10} className="shrink-0" />
                Cursos
              </p>
              <div className="space-y-1.5 pl-3">
                {data.educacao
                  .filter((edu) => edu.categoria === 'curso')
                  .map((edu, i) => (
                    <div key={i} className="break-inside-avoid">
                      <p className="text-[11px] font-semibold text-slate-700">{edu.curso}</p>
                      <p className="text-[11px]">{edu.instituicao} · {edu.ano_fim}</p>
                    </div>
                  ))}
              </div>
            </>
          )}
        </CvSection>
      </aside>

      <main className="flex-1 px-7 py-6">
        <h1 className="text-center text-[20px] font-semibold text-slate-700">{data.nome}</h1>
        {data.role && <p className="mt-1 mb-4 text-center text-[16px] font-medium text-emerald-600">{data.role}</p>}

        {data.filosofia && (
          <section className="mb-4">
            <hr className="mb-3 border-transparent" />
            <h3 className="mb-1.5 text-[12px] font-semibold uppercase tracking-normal leading-none text-slate-700">
              Filosofia de trabalho
            </h3>
            <p className="text-justify text-[11px] leading-snug">{data.filosofia}</p>
          </section>
        )}

        <section className="mb-4">
          <h3 className="mb-1.5 text-[12px] font-semibold uppercase tracking-normal leading-none text-slate-700">
            Experiência
          </h3>
          <div className="space-y-2">
            {data.experiencias.map((exp, i) => (
              <div key={i} className="break-inside-avoid">
                {(i === 0 || data.experiencias[i - 1].instituicao !== exp.instituicao) && exp.instituicao && (
                  <p className="text-[11px] font-bold uppercase text-slate-700">
                    {exp.instituicao}
                    {(() => {
                      const desde = exp.ano_inicio_instituicao
                      const fim = exp.ano_fim
                      if (!desde) return null
                      if (!fim || fim === '-') return ` | desde ${desde}`
                      const anos = Number(fim) - Number(desde)
                      if (!anos || Number.isNaN(anos)) return null
                      return ` | ${anos} ${anos === 1 ? 'ano' : 'anos'}`
                    })()}
                  </p>
                )}
                <p className="text-[11px] font-bold text-slate-700">
                  {[exp.cargo, exp.funcao].filter(Boolean).join(' — ')}
                </p>
                {exp.periodo && (
                  <p className="text-[11px] italic lowercase text-slate-500">
                    {exp.periodo.includes('ATUAL') ? 'Atuando' : exp.periodo}
                  </p>
                )}
                {exp.enriquecimento?.trajetoria && (
                  <p className="mt-0.5 text-justify text-[11px] italic leading-snug text-slate-600">
                    {exp.enriquecimento.trajetoria}
                  </p>
                )}
                {exp.enriquecimento?.entregas_importantes && exp.enriquecimento.entregas_importantes.length > 0 && (
                  <ul className="mt-0.5 list-['▪'] pl-5 text-justify text-[11px] leading-snug [&>li]:pl-1">
                    {exp.enriquecimento.entregas_importantes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-1.5 text-[12px] font-semibold uppercase tracking-normal leading-none text-slate-700">
            Habilidades
          </h3>
          <div className="space-y-1.5">
            {data.habilidades_grupos.map((group) => (
              <div key={group.title} className="break-inside-avoid">
                <p className="mb-0.5 text-[10px] font-bold text-slate-700">{group.title}:</p>
                <div className="flex flex-wrap gap-1">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded border border-[0.5px] border-slate-300 px-1.5 py-0.5 text-[9px] leading-tight text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      </div>
    </>
  )
}

function CvSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon?: LucideIcon
  children: React.ReactNode
}) {
  return (
    <div className="mb-3 break-inside-avoid">
      <h3 className="mb-1 flex items-center gap-1 text-[12px] font-semibold uppercase tracking-normal leading-none text-slate-700">
        {Icon && <Icon size={11} className="shrink-0" />}
        {title}
      </h3>
      <div className="pl-3 text-[11px] leading-snug text-slate-600">{children}</div>
    </div>
  )
}
