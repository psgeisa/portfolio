import { Quote, Database } from 'lucide-react'
import {
  dadosTags as staticTags,
  dadosIntro as staticIntro,
  dadosFilosofia as staticFilosofia,
  dadosProjects as staticProjects,
  dadosSummary as staticSummary,
  dadosTechGroups as staticTechGroups,
  type Project,
  type TechGroup,
} from '../../data/dadosData'
import { useSiteData } from '../../hooks/useSiteData'
import { resolveIcon } from '../../lib/icons'
import { Editable, AddItemButton } from '../admin/Editable'
import BackToTopButton from '../common/BackToTopButton'
import TechStackCarousel from '../dev/TechStackCarousel'
import ProjectCarousel from './ProjectCarousel'
import ProjectCard from './ProjectCard'
import profilePhoto from '../../assets/profile.png'

export default function DadosContent() {
  const site = useSiteData()
  const dados = site?.dados
  const dadosTags: string[] = dados?.dadosTags ?? staticTags
  const dadosIntro: string = dados?.dadosIntro ?? staticIntro
  const dadosFilosofia: string[] = dados?.dadosFilosofia ?? staticFilosofia
  const dadosProjects: Project[] = dados?.dadosProjects ?? staticProjects
  const dadosSummary: Project = dados?.dadosSummary ?? staticSummary
  const dadosTechGroups: TechGroup[] = (dados?.dadosTechGroups ?? staticTechGroups).map((group: any) => ({
    ...group,
    icon: typeof group.icon === 'string' ? resolveIcon(group.icon, Database) : group.icon,
  }))
  const hero = {
    eyebrow: 'Data Science & Analytics',
    title: 'Data & AI Solutions',
    subtitle: 'Produtos de dados, soluções analíticas e aplicações de IA voltadas para decisão.',
    ...(dados?.hero ?? {}),
  }
  const projectsTitle: string = dados?.projectsTitle ?? 'Projetos'
  const summaryTitle: string = dados?.summaryTitle ?? 'Em resumo'
  const stackTitle: string = dados?.stackTitle ?? 'Stack Técnica'
  const filosofiaTitle: string = dados?.filosofiaTitle ?? 'Filosofia de Trabalho'

  return (
    <div className="w-full bg-[#0a0c10] font-sans text-slate-100">
      <section className="relative overflow-hidden border-b border-white/5 px-6 py-24 text-center sm:px-10 lg:px-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(52,211,153,0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(96,165,250,0.12), transparent 40%)',
          }}
        />
        <div className="mx-auto max-w-4xl">
          <img
            src={profilePhoto}
            alt="Geisa dos Reis"
            className="mx-auto mb-6 h-28 w-28 rounded-full border-2 border-emerald-400/40 object-cover shadow-lg shadow-emerald-500/10 sm:h-32 sm:w-32"
          />
          <Editable path={['dados', 'hero', 'eyebrow']} label="Subtítulo curto">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">{hero.eyebrow}</p>
          </Editable>
          <Editable path={['dados', 'hero', 'title']} label="Título">
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
          </Editable>
          <Editable path={['dados', 'hero', 'subtitle']} label="Subtítulo">
            <p className="mt-6 text-lg text-slate-300 sm:text-xl">{hero.subtitle}</p>
          </Editable>
          <Editable path={['dados', 'dadosIntro']} label="Frase de introdução">
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
              <Quote className="mb-2 text-emerald-400/70" size={22} strokeWidth={1.75} />
              <p className="text-base italic text-slate-300 sm:text-lg">{dadosIntro}</p>
            </div>
          </Editable>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {dadosTags.map((tag, index) => (
              <Editable key={tag} path={['dados', 'dadosTags', index]} removable label="Tag">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-200 transition-colors hover:border-emerald-400/40 hover:text-emerald-300">
                  {tag}
                </span>
              </Editable>
            ))}
            <AddItemButton path={['dados', 'dadosTags']} label="+ Tag" template="Nova tag" />
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-white/[0.015] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <Editable path={['dados', 'projectsTitle']} label="Título da seção">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{projectsTitle}</h2>
            </Editable>
          </div>
          <div className="mt-12">
            <Editable path={['dados', 'dadosProjects']} label="Projetos">
              <ProjectCarousel projects={dadosProjects} />
            </Editable>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto max-w-2xl text-center">
            <Editable path={['dados', 'summaryTitle']} label="Título da seção">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{summaryTitle}</h2>
            </Editable>
          </div>
          <div className="mt-12">
            <Editable path={['dados', 'dadosSummary']} label="Resumo">
              <ProjectCard {...dadosSummary} />
            </Editable>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <Editable path={['dados', 'stackTitle']} label="Título da seção">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{stackTitle}</h2>
            </Editable>
          </div>
          <div className="mt-12">
            <Editable path={['dados', 'dadosTechGroups']} label="Stack Técnica">
              <TechStackCarousel groups={dadosTechGroups} />
            </Editable>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-10 lg:px-16">
        <Editable path={['dados', 'filosofiaTitle']} label="Título da seção">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{filosofiaTitle}</h2>
        </Editable>
        {dadosFilosofia.map((paragraph, index) => (
          <Editable key={paragraph} path={['dados', 'dadosFilosofia', index]} removable label="Parágrafo">
            <p className="mt-4 text-slate-400">{paragraph}</p>
          </Editable>
        ))}
        <div className="mt-4 flex justify-center">
          <AddItemButton path={['dados', 'dadosFilosofia']} label="+ Parágrafo" template="Novo parágrafo" />
        </div>
      </section>

      <BackToTopButton />

      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500 sm:px-10 lg:px-16">
        Data &amp; AI Solutions · Geisa dos Reis
      </footer>
    </div>
  )
}
