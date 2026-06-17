import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  const balanceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    apiFetch(`/api/cv-data?perfil=${perfil}`)
      .then((res) => res.json())
      .then(setData)
  }, [perfil])

  // Distribui o conteúdo da coluna lateral para acompanhar a altura da coluna
  // branca, mantendo uma hierarquia tipográfica: a entrelinha dentro de cada
  // bloco cresce de forma suave (acréscimo `d` por linha) e o gap entre blocos
  // cresce R vezes mais (R*d), ficando ligeiramente maior que a entrelinha.
  // Há um teto suave (D_MAX) no acréscimo de entrelinha; se ainda sobrar espaço
  // (sidebar com pouco conteúdo), aceita-se uma cauda escura em vez de exagerar.
  const balanceSidebar = useCallback(() => {
    const box = balanceRef.current
    const aside = box?.parentElement
    const main = box?.closest('.cv-page')?.querySelector('main')
    if (!box || !aside || !main || box.children.length < 2) return
    const R = 1.5 // gap entre blocos cresce 1,5x o acréscimo de entrelinha
    const D_MAX = 60 // teto de segurança (px) p/ casos patológicos (sidebar mínima)
    // Altura-alvo = altura natural da coluna branca (main). Medimos pelo conteúdo
    // dela (não pela caixa esticada do flex, que a própria sidebar inflaria,
    // criando um laço de realimentação).
    const extentOf = (el: Element) => {
      const k = el.children
      return k[k.length - 1].getBoundingClientRect().bottom - k[0].getBoundingClientRect().top
    }
    const ms = getComputedStyle(main)
    const mainNatural = extentOf(main) + parseFloat(ms.paddingTop) + parseFloat(ms.paddingBottom)
    // Parte fixa da sidebar (foto + margens + paddings) que não escala.
    const as = getComputedStyle(aside)
    const photo = aside.querySelector('img')
    const photoMb = photo ? parseFloat(getComputedStyle(photo).marginBottom) : 0
    const photoH = photo ? photo.offsetHeight : 0
    const fixed = photoH + photoMb + parseFloat(as.paddingTop) + parseFloat(as.paddingBottom)
    const avail = mainNatural - fixed
    const gaps = box.children.length - 1
    // CV com mais de uma página A4: na impressão a lateral fica compacta (a
    // faixa escura preenche o resto), evitando que uma seção transborde sozinha
    // para uma página extra. Em tela e em CV de 1 página, mantém-se esticada.
    // (altura útil da página = A4 297mm menos as margens 12mm*2 da @page)
    const PAGE_CONTENT_PX = ((297 - 24) * 96) / 25.4
    box.classList.toggle('is-multipage', mainNatural > PAGE_CONTENT_PX)
    // Mede quanto a altura cresce por px de --d (≈ nº de linhas/itens afetados),
    // mantendo os gaps em zero durante a medição.
    box.style.setProperty('--ge', '0px')
    box.style.setProperty('--d', '0px')
    const h0 = extentOf(box)
    box.style.setProperty('--d', '10px')
    const perPx = (extentOf(box) - h0) / 10
    // H(d) = h0 + d*perPx (linhas) + gaps*R*d (blocos). Resolve d para encher avail.
    const denom = perPx + gaps * R
    let d = denom > 0 ? (avail - h0) / denom : 0
    if (!Number.isFinite(d) || d < 0) d = 0
    d = Math.min(d, D_MAX) // se passar do teto, deixa cauda em vez de exagerar
    box.style.setProperty('--d', `${d}px`)
    box.style.setProperty('--ge', `${R * d}px`)
  }, [])

  // Recalcula a distribuição da coluna lateral sempre que os dados mudam (após
  // as imagens carregarem, pois a foto define a altura) e em redimensionamentos.
  useLayoutEffect(() => {
    if (!data) return
    let cancelled = false
    const run = () => requestAnimationFrame(() => !cancelled && balanceSidebar())
    const images = Array.from(document.images)
    Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve()
              img.onerror = () => resolve()
            })
      )
    ).then(() => !cancelled && run())
    run()
    window.addEventListener('resize', run)
    return () => {
      cancelled = true
      window.removeEventListener('resize', run)
    }
  }, [data, balanceSidebar])

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
      if (!cancelled) {
        balanceSidebar()
        setTimeout(() => window.print(), 300)
      }
    })
    return () => {
      cancelled = true
    }
  }, [data, searchParams, balanceSidebar])

  if (!data) return null

  const isFinops = perfil === 'finops'
  const isDev = perfil === 'dev'
  const asideClasses = isFinops
    ? 'w-[68mm] shrink-0 bg-[#1b2733] px-6 py-6 text-slate-200 [&_.text-slate-700]:text-white [&_.text-slate-600]:text-slate-300 [&_.text-emerald-600]:text-[#2bbfa4]'
    : isDev
      ? 'w-[68mm] shrink-0 bg-[#0a0c10] px-6 py-6 text-slate-300 [&_.text-slate-700]:text-white [&_.text-slate-600]:text-slate-400 [&_.text-emerald-600]:text-emerald-400 [&_.border-emerald-400\\/50]:border-emerald-400/40'
      : 'w-[68mm] shrink-0 bg-neutral-800 px-6 py-6 text-slate-200 [&_.text-slate-700]:text-white [&_.text-slate-600]:text-slate-300 [&_.text-emerald-600]:text-emerald-400'
  // Cor da faixa lateral usada na impressão (mesma cor de fundo do aside).
  const stripeColor = isFinops ? '#1b2733' : isDev ? '#0a0c10' : '#262626'

  return (
    <>
      <style>{`
        html, body { background: #fff; }
        /* Distribuição da coluna lateral (valores calculados em balanceSidebar):
           --d = acréscimo de entrelinha por linha; --ge = acréscimo de gap entre
           blocos (= R*d, um pouco maior). Bases fixas preservam a hierarquia. */
        .cv-bal > * + * { margin-top: calc(0.5rem + var(--ge, 0px)); }
        .cv-bal .cv-body { line-height: calc(15.4px + var(--d, 0px)); }
        .cv-bal .cv-body .cv-rows > * + * { margin-top: calc(0.375rem + var(--d, 0px)); }

        /* Faixa escura da coluna lateral. Em tela fica escondida (o próprio aside
           tem o fundo); na impressão vira um elemento fixo, que o navegador
           repete em TODAS as páginas, com os fundos do conteúdo transparentes. */
        .cv-stripe { display: none; }
        @media print {
          /* margin: 0 elimina os cabeçalhos e rodapés gerados pelo navegador
             (data/hora, título da aba, URL, número de página). O espaçamento
             interno é reposto por padding no .cv-page abaixo. */
          @page { margin: 0; }
          html, body { margin: 0; }
          .cv-print-btn { display: none !important; }

          /* Espaçamento interno que substituiu o margin da @page. */
          .cv-page { padding-top: 12mm; padding-bottom: 12mm; }

          /* Faixa escura cobre a página inteira de borda a borda (sem sangria
             extra, pois a @page não tem mais margens). */
          .cv-stripe {
            display: block;
            position: fixed;
            left: 0;
            top: 0;
            width: 68mm;
            height: 100%;
            z-index: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Conteúdo acima da faixa; fundos transparentes para ela aparecer e o
             branco vir do papel (com o espaçamento da @page só na parte branca). */
          .cv-page { position: relative; z-index: 1; background: transparent !important; min-height: 0 !important; }
          aside { background: transparent !important; }

          /* Não deixar um título sozinho no fim da página: ele acompanha o
             conteúdo para a página seguinte. */
          .cv-page h3 { break-after: avoid; }

          /* CV multipágina: lateral compacta no topo (sem o stretch da tela),
             deixando a faixa escura preencher o restante das páginas. */
          .cv-bal.is-multipage { --d: 0px !important; --ge: 0px !important; }
        }
      `}</style>
      <button
        type="button"
        onClick={() => window.print()}
        className="cv-print-btn fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-lg transition-colors hover:bg-emerald-500"
      >
        Salvar PDF / Imprimir
      </button>
      <div className="cv-stripe" aria-hidden="true" style={{ background: stripeColor }} />
      <div className="cv-page mx-auto flex min-h-screen w-full max-w-[210mm] bg-white font-sans text-slate-700">
      <aside className={`${asideClasses} flex flex-col`}>
        <img
          src={profilePhoto}
          alt={data.nome}
          className="mx-auto mb-3 h-[180px] w-[180px] rounded-full border-2 border-emerald-400/50 object-cover"
        />

        {/* Ocupa o espaço restante; a distribuição suave (entrelinha + gaps) é
            aplicada via a classe cv-bal e o fator --k calculado em balanceSidebar. */}
        <div ref={balanceRef} className="cv-bal flex flex-1 flex-col">
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
          <div className="cv-rows">
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
              <div className="cv-rows pl-3">
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
          <div className="cv-rows">
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
              <div className="cv-rows pl-3">
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
        </div>
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
                  {formatCargo(exp.cargo, exp.funcao)}
                </p>
                {exp.periodo && (
                  <p className="text-[11px] italic lowercase text-slate-500">
                    {formatPeriodo(exp)}
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
          <div className="cv-rows">
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

// Títulos em português (cargo — funcao) que devem aparecer traduzidos nos CVs.
const CARGO_OVERRIDES: Record<string, string> = {
  'Analista|Dev': 'Data Analyst',
  'Operador de serviços|Operadora': 'Contract Analyst',
  'Assistente de Projetos|Assistente de Projetos': 'Project Assistant',
  'Secretária|Dev': 'Administrative Assistant',
}

function formatCargo(cargo?: string, funcao?: string) {
  const override = CARGO_OVERRIDES[`${cargo?.trim()}|${funcao?.trim()}`]
  if (override) return override
  return [cargo, funcao].filter(Boolean).join(' — ')
}

// Períodos marcados como "ATUAL" (experiências extras do perfil) que devem
// exibir um intervalo fixo em vez de "Atuando", por título de cargo.
const PERIODO_OVERRIDES: Record<string, string> = {
  'Administrative Assistant': '2019',
  'Project Assistant': 'ABR/2018 - MAR/2019',
  'Contract Analyst': 'ABR/2017 - MAR/2018',
}

function formatPeriodo(exp: Experiencia) {
  if (!exp.periodo.includes('ATUAL')) return exp.periodo
  return PERIODO_OVERRIDES[formatCargo(exp.cargo, exp.funcao)] ?? 'Atuando'
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
    <div className="break-inside-avoid">
      <h3 className="mb-1 flex items-center gap-1 text-[12px] font-semibold uppercase tracking-normal leading-none text-slate-700">
        {Icon && <Icon size={11} className="shrink-0" />}
        {title}
      </h3>
      <div className="cv-body pl-3 text-[11px] text-slate-600">{children}</div>
    </div>
  )
}
