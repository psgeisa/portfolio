import { Quote } from 'lucide-react'
import { useSiteData } from '../../hooks/useSiteData'
import { Editable, AddItemButton } from '../admin/Editable'
import profilePhoto from '../../assets/profile.png'

type Props = {
  profileKey: string
}

export default function GenericProfileContent({ profileKey }: Props) {
  const site = useSiteData()
  const data = site?.[profileKey] ?? {}

  const hero = {
    eyebrow: 'Novo Perfil',
    title: 'Título da Página',
    subtitle: 'Subtítulo de apresentação do perfil.',
    quote: 'Aqui vc coloca sua experiência.',
    tags: [] as string[],
    ...(data.hero ?? {}),
  }
  const pillarsTitle: string = data.pillarsTitle ?? 'Destaques'
  const pillars: { title: string; items: string[] }[] = data.pillars ?? []
  const projectsTitle: string = data.projectsTitle ?? 'Projetos'
  const projects: { nome: string; descricao: string }[] = data.projects ?? []
  const filosofiaTitle: string = data.filosofiaTitle ?? 'Filosofia de Trabalho'
  const filosofia = {
    text: 'Aqui vc descreve sua filosofia de trabalho.',
    quote: 'Aqui vc coloca uma frase de impacto.',
    ...(data.filosofia ?? {}),
  }

  return (
    <div className="w-full bg-[#0a0c10] font-sans text-slate-100">
      <section className="relative overflow-hidden border-b border-white/5 px-6 py-24 text-center sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <img
            src={profilePhoto}
            alt="Geisa dos Reis"
            className="mx-auto mb-6 h-28 w-28 rounded-full border-2 border-emerald-400/40 object-cover shadow-lg shadow-emerald-500/10 sm:h-32 sm:w-32"
          />
          <Editable path={[profileKey, 'hero', 'eyebrow']} label="Subtítulo curto">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">{hero.eyebrow}</p>
          </Editable>
          <Editable path={[profileKey, 'hero', 'title']} label="Título">
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
          </Editable>
          <Editable path={[profileKey, 'hero', 'subtitle']} label="Subtítulo">
            <p className="mt-6 text-lg text-slate-300 sm:text-xl">{hero.subtitle}</p>
          </Editable>
          <Editable path={[profileKey, 'hero', 'quote']} label="Citação">
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
              <Quote className="mb-2 text-emerald-400/70" size={22} strokeWidth={1.75} />
              <p className="text-base italic text-slate-300 sm:text-lg">{hero.quote}</p>
            </div>
          </Editable>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {hero.tags.map((tag: string, index: number) => (
              <Editable key={tag} path={[profileKey, 'hero', 'tags', index]} removable label="Tag">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-200 transition-colors hover:border-emerald-400/40 hover:text-emerald-300">
                  {tag}
                </span>
              </Editable>
            ))}
            <AddItemButton path={[profileKey, 'hero', 'tags']} label="+ Tag" template="Nova tag" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <Editable path={[profileKey, 'pillarsTitle']} label="Título da seção">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">{pillarsTitle}</h2>
          </Editable>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Editable key={pillar.title + index} path={[profileKey, 'pillars', index]} removable label="Destaque">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-base font-semibold text-white">{pillar.title}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
                  {(pillar.items ?? []).map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Editable>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <AddItemButton
            path={[profileKey, 'pillars']}
            label="+ Adicionar destaque"
            template={{ title: 'Novo destaque', items: ['Item de exemplo'] }}
          />
        </div>
      </section>

      <section className="border-t border-white/5 bg-white/[0.015] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <Editable path={[profileKey, 'projectsTitle']} label="Título da seção">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{projectsTitle}</h2>
            </Editable>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Editable key={project.nome + index} path={[profileKey, 'projects', index]} removable label="Projeto">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-base font-semibold text-white">{project.nome}</h3>
                  <p className="mt-2 text-sm text-slate-400">{project.descricao}</p>
                </div>
              </Editable>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <AddItemButton
              path={[profileKey, 'projects']}
              label="+ Adicionar projeto"
              template={{ nome: 'Novo projeto', descricao: 'aqui projetos' }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-10 lg:px-16">
        <Editable path={[profileKey, 'filosofiaTitle']} label="Título da seção">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{filosofiaTitle}</h2>
        </Editable>
        <Editable path={[profileKey, 'filosofia', 'text']} label="Texto">
          <p className="mt-4 text-slate-400">{filosofia.text}</p>
        </Editable>
        <Editable path={[profileKey, 'filosofia', 'quote']} label="Citação">
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
            <Quote className="mb-2 text-emerald-400/70" size={22} strokeWidth={1.75} />
            <p className="text-lg font-medium italic text-emerald-300">{filosofia.quote}</p>
          </div>
        </Editable>
      </section>

      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500 sm:px-10 lg:px-16">
        {hero.title} · Geisa dos Reis
      </footer>
    </div>
  )
}
