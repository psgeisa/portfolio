import { Quote, ClipboardList, Code2 } from 'lucide-react'
import {
  devSections as staticSections,
  devIntro as staticIntro,
  devTags as staticTags,
  devTimeline as staticTimeline,
  devTechGroups as staticTechGroups,
  type DevSection,
  type TechGroup,
} from '../../data/devData'
import { useSiteData } from '../../hooks/useSiteData'
import { resolveIcon } from '../../lib/icons'
import { Editable, AddItemButton } from '../admin/Editable'
import BackToTopButton from '../common/BackToTopButton'
import { useEdit } from '../../hooks/editContext'
import TechStackCarousel from './TechStackCarousel'
import AppGrid from './AppGrid'
import AppCarousel from './AppCarousel'
import profilePhoto from '../../assets/profile.png'

function BulletList({ items, columns }: { items: string[]; columns?: 2 | 3 }) {
  const gridClass = columns === 3 ? 'sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0' : columns === 2 ? 'sm:grid sm:grid-cols-2 sm:gap-x-6 sm:space-y-0' : ''
  return (
    <ul className={`mt-2 space-y-1.5 text-sm text-slate-400 ${gridClass}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 sm:py-0.5">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/60" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function DevContent() {
  const site = useSiteData()
  const dev = site?.dev
  const devIntro: string = dev?.devIntro ?? staticIntro
  const devTags: string[] = dev?.devTags ?? staticTags
  const devTimeline: { ano: string; texto: string }[] = dev?.devTimeline ?? staticTimeline
  const devTechGroups: TechGroup[] = (dev?.devTechGroups ?? staticTechGroups).map((group: any) => ({
    ...group,
    icon: typeof group.icon === 'string' ? resolveIcon(group.icon, Code2) : group.icon,
  }))
  const devSections: DevSection[] = (dev?.devSections ?? staticSections).map((section: any) => ({
    ...section,
    icon: typeof section.icon === 'string' ? resolveIcon(section.icon, ClipboardList) : section.icon,
  }))
  const hero = {
    eyebrow: 'Application Developer',
    title: 'Desenvolvimento de Soluções',
    subtitle: 'Soluções corporativas completas: front-end, back-end, dados, integrações, cloud e IA generativa.',
    ...(dev?.hero ?? {}),
  }
  const stackTitle: string = dev?.stackTitle ?? 'Stack Técnica'
  const filosofia = {
    title: 'Filosofia de Trabalho',
    text:
      'Acredito que desenvolvimento de software gera mais valor quando vai além da implementação técnica e atua como um facilitador de transformação. Busco compreender profundamente os processos, desafios e objetivos de negócio antes de definir soluções, conectando pessoas, dados e tecnologia para criar aplicações que simplifiquem operações e ampliem a capacidade de execução das equipes. Minha atuação envolve desde o levantamento de requisitos e modelagem de processos até o desenvolvimento de aplicações, integrações, automações e soluções apoiadas por inteligência artificial. Acredito que simplicidade, escalabilidade e experiência do usuário são fundamentais para que a tecnologia seja adotada de forma efetiva. Por isso, procuro transformar necessidades de negócio em produtos sustentáveis, capazes de evoluir junto com a organização e gerar valor contínuo ao longo do tempo.',
    quote: 'Uma boa solução não nasce da tecnologia. Ela nasce da compreensão do problema que precisa ser resolvido.',
    ...(dev?.filosofia ?? {}),
  }

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
          <Editable path={['dev', 'hero', 'eyebrow']} label="Subtítulo curto">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">{hero.eyebrow}</p>
          </Editable>
          <Editable path={['dev', 'hero', 'title']} label="Título">
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
          </Editable>
          <Editable path={['dev', 'hero', 'subtitle']} label="Subtítulo">
            <p className="mt-6 text-lg text-slate-300 sm:text-xl">{hero.subtitle}</p>
          </Editable>
          <Editable path={['dev', 'devIntro']} label="Frase de introdução">
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
              <Quote className="mb-2 text-emerald-400/70" size={22} strokeWidth={1.75} />
              <p className="text-base italic text-slate-300 sm:text-lg">{devIntro}</p>
            </div>
          </Editable>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {devTags.map((tag, index) => (
              <Editable key={tag} path={['dev', 'devTags', index]} removable label="Tag">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-200 transition-colors hover:border-emerald-400/40 hover:text-emerald-300">
                  {tag}
                </span>
              </Editable>
            ))}
            <AddItemButton path={['dev', 'devTags']} label="+ Tag" template="Nova tag" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-16 sm:px-10 lg:px-16">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">Trajetória</h2>
          {useEdit() && (
            <Editable path={['dev', 'devTimeline']} label="Trajetória">
              <span className="text-xs text-emerald-300">(editar linha do tempo)</span>
            </Editable>
          )}
        </div>
        <div className="mt-12 hidden lg:grid lg:grid-cols-5">
          {devTimeline.map((item, index) => (
            <div key={item.ano} className="relative h-56">
              <div
                className={`absolute top-1/2 h-px bg-emerald-400/30 ${
                  index === devTimeline.length - 1 ? 'inset-x-2 right-6' : 'inset-x-2'
                }`}
              />
              {index === devTimeline.length - 1 && (
                <div className="absolute right-2 top-1/2 z-10 h-px w-4 -translate-y-1/2 bg-emerald-400 [animation:blink_1s_step-end_infinite]" />
              )}
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400 bg-[#0a0c10]" />
              <div
                className={`absolute left-1/2 h-4 w-px -translate-x-1/2 bg-emerald-400/30 ${
                  index % 2 === 0 ? 'top-1/2 -translate-y-full' : 'top-1/2'
                }`}
              />

              {index % 2 === 0 ? (
                <>
                  <p className="absolute left-1/2 top-[calc(50%+10px)] -translate-x-1/2 text-sm font-semibold text-emerald-300">
                    {item.ano}
                  </p>
                  <div className="absolute inset-x-0 bottom-[calc(50%+16px)] h-24 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[10px] leading-tight text-slate-400 text-justify">{item.texto}</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="absolute left-1/2 bottom-[calc(50%+10px)] -translate-x-1/2 text-sm font-semibold text-emerald-300">
                    {item.ano}
                  </p>
                  <div className="absolute inset-x-0 top-[calc(50%+16px)] h-24 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[10px] leading-tight text-slate-400 text-justify">{item.texto}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="relative mt-10 space-y-6 lg:hidden">
          <div className="absolute bottom-2 left-0 top-2 z-0 w-px bg-emerald-400/30" />
          {devTimeline.map((item) => (
            <div key={item.ano} className="relative flex gap-4 pl-6">
              <div className="absolute left-0 top-1.5 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-emerald-400 bg-[#0a0c10]" />
              <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-emerald-300">{item.ano}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl space-y-10 px-6 pb-20 pt-10 sm:px-10 lg:px-16">
        {devSections.map((section, index) => {
          const Icon = section.icon
          return (
            <Editable key={section.title} path={['dev', 'devSections', index]} removable label="Seção">
            <div className="flex gap-4 sm:gap-6">
              <div
                className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 ${
                  section.title === 'Desenvolvimento de Aplicações Corporativas' ||
                  section.title === 'Desenvolvimento Web Full Stack'
                    ? 'mx-auto w-full lg:w-full lg:flex-1'
                    : 'flex-1'
                }`}
              >
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-2.5 text-emerald-300">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">{section.title}</h2>
              </div>
              {section.note && <p className="mt-2 text-sm italic text-slate-400">{section.note}</p>}

              <div className="mt-6 space-y-6">
                {section.blocks.map((block) => (
                  <div key={block.heading}>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {block.heading}
                    </p>
                    {block.items && <BulletList items={block.items} columns={block.columns} />}
                    {block.apps &&
                      (block.carousel ? (
                        <AppCarousel
                          apps={block.apps}
                          height={section.title === 'Desenvolvimento de Aplicações Corporativas' ? 299 : undefined}
                        />
                      ) : (
                        <AppGrid
                          apps={block.apps}
                          equalHeight
                        />
                      ))}
                  </div>
                ))}
              </div>

              {section.closing && (
                <div className="mt-6 border-t border-white/5 pt-6">
                  <p className="text-sm text-slate-400">{section.closing.paragraph}</p>
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left">
                    <Quote className="mb-2 text-emerald-400/70" size={18} strokeWidth={1.75} />
                    <p className="text-sm font-medium italic text-emerald-300">{section.closing.quote}</p>
                  </div>
                </div>
              )}
              </div>
            </div>
            </Editable>
          )
        })}
        <div className="flex justify-center pl-20 sm:pl-24">
          <AddItemButton
            path={['dev', 'devSections']}
            label="+ Adicionar seção"
            template={{ title: 'Nova seção', icon: 'ClipboardList', blocks: [] }}
          />
        </div>
      </section>

      <section className="border-t border-white/5 bg-white/[0.015] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <Editable path={['dev', 'stackTitle']} label="Título da seção">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{stackTitle}</h2>
            </Editable>
          </div>
          <div className="mt-12">
            <Editable path={['dev', 'devTechGroups']} label="Stack Técnica">
              <TechStackCarousel groups={devTechGroups} />
            </Editable>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-10 lg:px-16">
        <Editable path={['dev', 'filosofia', 'title']} label="Título da seção">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{filosofia.title}</h2>
        </Editable>
        <Editable path={['dev', 'filosofia', 'text']} label="Texto">
          <p className="mt-4 text-slate-400">{filosofia.text}</p>
        </Editable>
        <Editable path={['dev', 'filosofia', 'quote']} label="Citação">
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left backdrop-blur-sm">
            <Quote className="mb-2 text-emerald-400/70" size={22} strokeWidth={1.75} />
            <p className="italic text-slate-300">{filosofia.quote}</p>
          </div>
        </Editable>
      </section>

      <BackToTopButton />

      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500 sm:px-10 lg:px-16">
        Application Development · Geisa dos Reis
      </footer>
    </div>
  )
}
